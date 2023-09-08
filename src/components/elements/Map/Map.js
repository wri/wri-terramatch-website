"use client";

import "leaflet/dist/leaflet.css";

import union from "@turf/union";
import classnames from "classnames";
import L from "leaflet";
import React from "react";
import pin from "src/assets/icons/map-pin.svg";
import superagent from "superagent";

import Text from "@/components/elements/Text/Text";
import { getRestorationInterventionTypeOptions } from "@/constants/options/restorationInterventionTypes";

import { downloadFile } from "../../../utils";
import { merge } from "../../../utils/geojson";
import Button from "../Button/Button.tsx";
import DrawControl from "./draw-control/DrawControl";
import { POLYGON_STYLES } from "./mapSettings";

const MapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const DefaultIcon = L.icon({
  iconUrl: pin,
  iconSize: new L.Point(21, 27),
  opacity: 1,
  iconAnchor: new L.Point(10, 27),
  popupAnchor: new L.Point(0, -27)
});

L.Marker.prototype.options.icon = DefaultIcon;

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      geojson: props.geojson,
      accept: props.accept || ".zip, .csv, .json, .geojson, .kml, .shp, .dbf, .shx",
      isValidatingShapefile: false,
      error: "",
      shapeFiles: [],
      language: props.language,
      hasRejected: false,
      hasBlockedLocationPermission: null,
      loaded: false
    };

    this.map = null;
    this.uploadInputRef = React.createRef();
  }

  componentDidMount() {
    if (!this.map) {
      try {
        const map = L.map(`map-${this.props.id}`, this.props.config);
        this.map = map;
        map.on("load", this.mapLoaded);
        this.initMap();
      } catch (e) {
        console.log("componentDidMount Map error", e);
      }
    }

    this.getLocationPermission();
  }

  componentWillUnmount() {
    if (this.map && this.state.loaded) {
      this.map.remove();
    }
    this.map = null;
  }

  componentDidUpdate(nextProps, prevState) {
    if (this.map) {
      if (!this.props.editMode) {
        this.map.dragging.disable();
      } else {
        this.map.dragging.enable();
      }
      if (this.props.config.zoom !== nextProps.config.zoom) {
        this.map.setZoom(nextProps.config.zoom);
      }
      if (this.props.language !== this.state.language) {
        this.map.remove();
        this.setState({ language: this.props.language }, this.componentDidMount);
      }
    }

    if (nextProps.geojson !== prevState.geojson) {
      this.setState({ geojson: nextProps.geojson });
    }
  }

  async getLocationPermission() {
    const permissionStatus = await navigator?.permissions?.query({ name: "geolocation" });
    const locationPermission = permissionStatus?.state;
    this.setState({ hasBlockedLocationPermission: locationPermission === "denied" ? true : false });
  }

  mapLoaded() {
    this.setState({ loaded: true });
  }

  initMap = () => {
    this.setBasemap();
    this.props.map?.(this.map);
  };

  setLayerStyle(style, layer) {
    if (layer.setStyle) {
      layer?.setStyle?.(style);
    }
  }

  layerChange(e) {
    const layer = e.target;
    if (this.map && layer) {
      this.map.fitBounds(layer.getBounds());
      this.props.onZoomChange && this.props.onZoomChange(this.map.getBoundsZoom(layer.getBounds()));
    }
  }

  async setInitialCountry(initialCountry) {
    // https://docs.mapbox.com/api/search/
    // (assuming the country code is GB)
    // search_text is "GB" (this is a required param!)
    // limit types to country, set country code arg to "GB"
    // types are limited to "country", meaning we don't get any other data types returned
    const geocodedRes = await superagent.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${initialCountry}.json?types=country&country=${initialCountry}&access_token=${MapboxAccessToken}`
    );

    if (geocodedRes.body.features && geocodedRes.body.features.length > 0) {
      // we're making the assumption that the first country on the returned features is going to be what we want
      const country = geocodedRes.body.features[0];

      // lat/lng comes out in reverse from mapbox...
      this.map.setView([country.center[1], country.center[0]]);
    }
  }

  async setBasemap() {
    const style = this.state.language?.includes("es") ? "3sidedcube/ck3emczse01xv1cplsxgehfrl" : "mapbox/streets-v11";

    const { initialCountry } = this.props;

    if (initialCountry && !this.state.geojson) {
      this.setInitialCountry(initialCountry);
    }

    // Keys are rendered as the label for selection, translate them
    const mapStr = this.props.t("Map");
    const satStr = this.props.t("Satellite");
    const originalStr = this.props.t("Original");
    const editedStr = this.props.t("Edited");

    this.layers = {};
    this.geojsons = {};

    this.layers[mapStr] = L.tileLayer(
      `https://api.mapbox.com/styles/v1/${style}/tiles/256/{z}/{x}/{y}?access_token=${MapboxAccessToken}`,
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        accessToken: MapboxAccessToken
      }
    );

    this.layers[satStr] = L.tileLayer(
      `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=${MapboxAccessToken}`,
      {
        maxZoom: 18,
        accessToken: MapboxAccessToken
      }
    );

    this.layers[mapStr].addTo(this.map);
    L.control.layers(this.layers, null, { collapsed: false }).addTo(this.map);

    this.featureGroup = new L.FeatureGroup();

    if (this.state.geojson && !this.props.editMode) {
      try {
        if (this.props.comparisonGeoJson) {
          // If has comparison show toggle instead
          this.geojsons[originalStr] = L.geoJson(JSON.parse(this.props.comparisonGeoJson), {
            onEachFeature: (feature, layer) => {
              layer?.setStyle?.(POLYGON_STYLES);
            }
          }).on("add", e => this.layerChange(e));
          this.geojsons[editedStr] = L.geoJson(this.props.geojson, {
            onEachFeature: (feature, layer) => {
              layer?.setStyle?.(POLYGON_STYLES);
            }
          }).on("add", e => this.layerChange(e));
          const control = L.control
            .layers(this.geojsons, null, { collapsed: false, position: "bottomleft", id: "layers" })
            .addTo(this.map);

          // Force click the second element (Leaflet doesn't let you set the default for some reason!)
          control._section.querySelectorAll("label")[1].click();
          control._layerControlInputs[1].setAttribute("checked", "true");
        } else {
          this.map.addLayer(this.featureGroup);
          L.geoJson(this.props.geojson, {
            onEachFeature: (feature, layer) => {
              layer?.setStyle?.(POLYGON_STYLES);
              this.featureGroup.addLayer(layer);
            }
          });
          this.map.fitBounds(this.featureGroup.getBounds());
          this.props.onZoomChange && this.props.onZoomChange(this.map.getBoundsZoom(this.featureGroup.getBounds()));
        }
      } catch (err) {
        console.log("error loading geojson", err, this.props.geojson);
      }
    }
  }

  flattenGeojsonArray = () => {
    const geojson = merge(this.state.shapeFiles);
    if (geojson.features.length === 0) {
      this.setState({ geojson: null }, () => {
        this.props.onGeojsonChange(null);
        this.initMap();
      });
    } else {
      this.addGeoJsonProperties(geojson);
      this.setState({ geojson }, () => {
        this.props.onGeojsonChange(geojson);
      });
    }
  };

  addGeoJsonProperties = geojson => {
    geojson.features.map(feature => {
      if (this.props.geoJSONProperties) {
        this.props.geoJSONProperties.forEach(property => {
          feature.properties[property.key] = property.value;
        });
      }
      return feature;
    });
    return geojson;
  };

  onDrawComplete = (geojson, isFromUpload = false) => {
    if (this.state.shapeFiles.length && isFromUpload) {
      // if we're uploading shapefiles, use the flatten method
      this.flattenGeojsonArray();
    } else {
      // otherwise, its a drawn shape. we can use the geojson directly
      this.addGeoJsonProperties(geojson);
      this.setState({ geojson }, () => this.props.onGeojsonChange(geojson));
    }
  };

  onRejectBoundaries = () => {
    this.onDrawDelete();
    this.setState({ hasRejected: true });
    // gaEvent({
    //   category: "Remote_sensing_request",
    //   action: "click_to_open"
    // });
  };

  onShapefileChange = async e => {
    if (!this.props.multiFile && this.state.shapeFiles.length > 0) return;
    this.setState({ isValidatingShapefile: true });
    const shapeFile = e.target.files && e.target.files[0];
    const maxFileSize = 1000000; //1MB
    if (!shapeFile) {
      this.setState({ isValidatingShapefile: false });
      return;
    }

    if (
      (this.props.accept && !this.props.accept.includes(shapeFile.type)) ||
      (!shapeFile.type && shapeFile.name.includes(".kmz"))
    ) {
      this.setState({
        isValidatingShapefile: false,
        error: "errors.map.acceptTypeError"
      });
      return;
    }

    if (shapeFile && shapeFile.size <= maxFileSize) {
      const formData = new FormData();
      formData.append("upload", shapeFile);
      formData.append("rfc7946", true);

      superagent
        .post("https://ogre.adc4gis.com/convert")
        .send(formData)
        .then(res => {
          const geojson = res.body;
          if (geojson && geojson.features) {
            const features = geojson.features.filter(feature => feature.geometry && feature.geometry.type !== "Point");
            let geojsonParsed = features;
            if (features.length > 0) {
              geojsonParsed = features.reduce(union);
            }
            if (geojsonParsed) {
              // Force render to notify the draw control of the external geojson
              this.setState(
                {
                  shapeFiles: [...this.state.shapeFiles, { ...geojson, name: shapeFile.name }],
                  error: ""
                },
                () => {
                  this.onDrawComplete(geojsonParsed, true);
                }
              );
            }
          }
          this.uploadInputRef.current.value = "";
          this.setState({ isValidatingShapefile: false });
        })
        .catch(err => {
          this.setState({
            isValidatingShapefile: false,
            error: "errors.map.genericError"
          });
        });
    } else {
      this.setState({
        isValidatingShapefile: false,
        error: "errors.map.tooBig"
      });
    }
  };

  setLocation = () => {
    this.map.locate({
      setView: true,
      maxZoom: 15
    });
  };

  removeShape = index => {
    if (this.state.shapeFiles.length === 1) {
      this.setState({ shapeFiles: [], geojson: null });
      // this.forceUpdate();
    } else {
      const array = [...this.state.shapeFiles];
      const shape = array.indexOf(array[index]);
      if (shape !== -1) {
        array.splice(index, 1);

        this.setState({ shapeFiles: array }, () => {
          this.flattenGeojsonArray();
        });
      }
    }
  };

  render() {
    return (
      <>
        {this.props.editMode && (
          <DrawControl
            map={this.map}
            mode={this.props.mode}
            hideEditControls={this.props.hideEditControls}
            onDrawComplete={this.onDrawComplete}
            geojson={this.state.geojson}
            saving={false}
            interventionTypes={
              this.props.captureInterventionTypes && getRestorationInterventionTypeOptions(this.props.t)
            }
            t={this.props.t}
          />
        )}
        <div
          className={classnames(
            "relative z-0",
            this.props.className,
            this.props.hideEditControls && "c-map--hide-controls"
          )}
        >
          {this.state.hasBlockedLocationPermission && (
            <p className="text-body-100">
              {this.props.t(
                "Please switch on location services on your device, or allow location access in the browser settings."
              )}
            </p>
          )}
          <div id={`map-${this.props.id}`} className="c-map z-10" style={{ height: this.props.height }}>
            {(this.props.editMode || this.props.showLocation) && (
              <div className={classnames("c-map__controls", this.props.showLocation && "c-map__controls--bottom")}>
                {!this.props.hideEditControls && (
                  <div className="c-map__locate-user">
                    <button
                      className="c-map__control c-map__control--location"
                      type="button"
                      onClick={this.setLocation}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {(this.props.editMode || this.props.showUploadButton) && (
            <div className="c-map__action text-center">
              <div className="c-map__upload-shapefile mt-3">
                <input
                  type="file"
                  id="shapefile"
                  name="shapefile"
                  className="hidden"
                  accept={this.state.accept}
                  onChange={this.onShapefileChange}
                  disabled={this.state.isValidatingShapefile}
                  ref={this.uploadInputRef}
                />
                <Button
                  disabled={!this.props.multiFile && this.state.shapeFiles.length > 0}
                  onClick={() => {
                    this.uploadInputRef.current.click();
                  }}
                >
                  {this.props.t(
                    this.state.isValidatingShapefile
                      ? "Loading shapefile"
                      : this.props.uploadButtonText || "Upload shapefile"
                  )}
                </Button>

                {this.props.hasDownload && (
                  <Button
                    className="mt-3"
                    variant="secondary"
                    onClick={() => {
                      downloadFile(
                        this.props.hasDownload.boundary_geojson,
                        `${this.props.hasDownload.name}_boundary_geojson.geojson`,
                        false
                      );

                      // gaEvent({
                      //   category: `${this.props.hasDownload.projectType}_remote_sensing_export`,
                      //   action: "click_to_open"
                      // });
                    }}
                  >
                    {this.props.hasDownload.downloadString}
                  </Button>
                )}

                {this.props.showReject && (
                  <Button variant="secondary" className="ml-6" onClick={this.onRejectBoundaries}>
                    {this.props.t("Reject boundaries")}
                  </Button>
                )}
              </div>
              {this.state.error && <p>{this.props.t(this.state.error)}</p>}
              {this.state.hasRejected && (
                <p>{this.props.t("Project Boundaries have been rejected, please submit to continue")}</p>
              )}
            </div>
          )}
        </div>

        {this.state.shapeFiles.length > 0 && (
          <ul className="mt-4 flex justify-evenly">
            {this.state.shapeFiles.map((shape, index) => {
              return (
                <li key={shape.name}>
                  <Text as="b" className="mr-3" variant="text-heading-200">
                    {shape.name}
                  </Text>
                  <Button variant="secondary" className="m-1.5" onClick={() => this.removeShape(index)}>
                    {this.props.t("Remove")}
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </>
    );
  }
}

Map.defaultProps = {
  config: {
    minZoom: 2,
    zoom: 8,
    center: [51.505, -0.09],
    detectRetina: true
  },
  map: () => {},
  height: "350px",
  geojson: null,
  editMode: false,
  showLocation: false,
  onGeojsonChange: () => {},
  comparisonGeoJson: ""
};

export default Map;
