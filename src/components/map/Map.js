import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { POLYGON_STYLES } from './draw-control/constants';
import pin from '../../assets/images/icons/location-pin-fixed.png';
import DrawControl from './draw-control/DrawControlContainer';
import geojsonMerge from '@mapbox/geojson-merge';
import union from '@turf/union';
import superagent from 'superagent';
import { Button } from 'tsc-chameleon-component-library';
import { checkArea } from '../../helpers';
import { withTranslation } from 'react-i18next';

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
    this.t = props.t;
    this.state = {
      geojson: props.geojson,
      isValidatingShapefile: false,
      error: '',
      map: null,
      shapeFiles: [],
      language: props.language
    };
    this.uploadInputRef = React.createRef();
  }

  componentDidMount() {
    this.setState({map: L.map('map', this.props.config)}, this.initMap);
  }

  componentWillUnmount() {
    if (this.state.map) {
      this.state.map.remove();
    }
  }

  componentDidUpdate(nextProps) {
    if (this.props.config.zoom !== nextProps.config.zoom) {
      this.state.map.setZoom(nextProps.config.zoom);
    }
    if (this.props.language !== this.state.language) {
      this.setState({language: this.props.language}, this.setBasemap);
    }
  }

  initMap = () => {
    this.setBasemap();
    this.props.map(this.state.map);
  }

  setLayerStyle (style, layer) {
    if (layer.setStyle) {
      layer.setStyle(style);
    }
  }

  async setInitialCountry(initialCountry) {
    // https://docs.mapbox.com/api/search/
    // (assuming the country code is GB)
    // search_text is "GB" (this is a required param!)
    // limit types to country, set country code arg to "GB"
    // types are limited to "country", meaning we don't get any other data types returned
    const geocodedRes = await superagent.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${initialCountry}.json?types=country&country=${initialCountry}&access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`);

    if (geocodedRes.body.features && geocodedRes.body.features.length > 0) {
      // we're making the assumption that the first country on the returned features is going to be what we want
      const country = geocodedRes.body.features[0];

      // lat/lng comes out in reverse from mapbox...
      this.state.map.setView([country.center[1], country.center[0]]);
    }
  }

  async setBasemap() {
    const style = this.state.language === 'es' ? process.env.REACT_APP_SPANISH_MAP_STYLE : process.env.REACT_APP_ENGLISH_MAP_STYLE;

    const { initialCountry } = this.props;

    if (initialCountry && !this.state.geojson) {
      this.setInitialCountry(initialCountry);
    }

    this.tileLayer = L.tileLayer(`https://api.mapbox.com/styles/v1/${style}/tiles/256/{z}/{x}/{y}?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`, {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      accessToken: process.env.REACT_APP_MAPBOX_TOKEN
    }).addTo(this.state.map);


    this.featureGroup = new L.FeatureGroup();
    this.state.map.addLayer(this.featureGroup);

    if (this.state.geojson && !this.props.editMode) {
      try {
        L.geoJson(this.props.geojson, {
          onEachFeature: (feature, layer) => {
            layer.setStyle(POLYGON_STYLES);
            this.featureGroup.addLayer(layer);
            this.state.map.fitBounds(layer.getBounds());
            this.props.onZoomChange && this.props.onZoomChange(this.map.getBoundsZoom(layer.getBounds()));
          }
        });
      } catch (err) {
        console.log('error loading geojson', this.props.geojson);
      }
    }
  }

  flattenGeojsonArray = () => {
    const geojson = geojsonMerge.merge(this.state.shapeFiles);
    if (geojson.features.length === 0) {
      this.setState({geojson: null}, () => {
        this.props.onGeojsonChange(null);
        this.initMap();
      });
    } else {
      this.setState({ geojson }, () => {
        this.props.onGeojsonChange(geojson);
        this.forceUpdate();
      });
    }
  }

  onDrawComplete = (geojson) => {
    if (!checkArea(geojson)) {
      this.setState({
        error: 'errors.map.minSize'
      });
      this.setState({ geojson: null });
      this.props.onGeojsonChange(null);
    } else if (this.state.shapeFiles.length) {
      // if we're uploading shapefiles, use the flatten method
      this.flattenGeojsonArray();
    } else {
      // otherwise, its a drawn shape. we can use the geojson directly
      this.setState({ geojson });
      this.props.onGeojsonChange(geojson);
      this.forceUpdate();
    }
  }

  onDrawDelete = () => {
    this.setState({ geojson: null });
    this.props.onGeojsonChange(this.state.geojson);
  }

  onShapefileChange = async (e) => {
    this.setState({ isValidatingShapefile: true });
    const shapeFile = e.target.files && e.target.files[0];
    const maxFileSize = 1000000 //1MB
    if (!shapeFile) {
      this.setState({ isValidatingShapefile: false });
      return;
    }
    if (shapeFile && e.target.files[0].size <= maxFileSize) {
      const formData = new FormData();
      formData.append('upload', shapeFile);
      superagent
      .post('https://ogre.adc4gis.com/convert')
      .send(formData)
      .then((res) => {
        const geojson = res.body;
        if (geojson && geojson.features) {
          const features = geojson.features.filter(feature => feature.geometry && feature.geometry.type !== "Point");
          if (features.length === 0) {
            this.setState({
              isValidatingShapefile: false,
              error: 'errors.map.noPolygons'
            });
          } else {
            const geojsonParsed = features.reduce(union);
            if (geojsonParsed) {
              // Force render to notify the draw control of the external geojson
              this.setState({
                shapeFiles: [...this.state.shapeFiles,
                  { ...geojson, name: shapeFile.name }],
                error: '' });

              this.onDrawComplete(geojsonParsed);
            }
          }
        }
        this.setState({ isValidatingShapefile: false });
      })
      .catch((err) => {
        this.setState({
          isValidatingShapefile: false,
          error: 'errors.map.genericError'
        });
      });
    } else {
      this.setState({
        isValidatingShapefile: false,
        error: 'errors.map.tooBig'
      });
    }
  }

  setLocation = () => {
    this.state.map.locate({
      setView: true,
      maxZoom: 15
    });
  }

  removeShape = (index) => {
    if (this.state.shapeFiles.length === 1) {
      this.setState({ shapeFiles: [], geojson: null });
      this.forceUpdate();
    } else {
      const array = [...this.state.shapeFiles];
      const shape = array.indexOf(array[index]);
      if (shape!== -1) {
        array.splice(index, 1);

        this.setState({ shapeFiles: array }, () => {
          this.flattenGeojsonArray();
        });
      }
    }
  }

  render() {
    return (
      <>
        <div>
          <div id="map" className="c-map" style={{height: this.props.height}}></div>
          {this.props.editMode &&
          <div className="c-map__controls">
            <DrawControl
              map={this.state.map}
              mode={this.props.mode}
              onDrawComplete={this.onDrawComplete}
              onDrawDelete={this.onDrawDelete}
              geojson={this.state.geojson}
              saving={false}
          />
          <div className="c-map__locate-user">
            <button className="c-map__control c-map__control--location" type="button" onClick={this.setLocation}></button>
          </div>

          </div>
          }
          {this.props.editMode &&
          <div className="c-map__action u-text-center">
            <div className="c-map__upload-shapefile u-margin-top-small">
              <input
                type="file"
                id="shapefile"
                name="shapefile"
                className="u-display-hidden"
                accept=".zip, .csv, .json, .geojson, .kml, .kmz, .shp, .dbf, .shx"
                onChange={this.onShapefileChange}
                disabled={this.state.isValidatingShapefile}
                ref={this.uploadInputRef}
              />
              <Button variant="outline" click={() => {this.uploadInputRef.current.click()}}>
                {this.state.isValidatingShapefile ? 'Loading shapefile':'Upload shapefile'}
              </Button>
            </div>
            {this.state.error && <p>{this.t(this.state.error)}</p>}
          </div>
          }
        </div>
        <ul className="u-list-unstyled u-flex u-flex--space-evenly">
          {this.state.shapeFiles.map((shape, index) => {
            return (<li key={shape.name}>
              <b className="u-margin-right-small">{shape.name}</b>
              <Button
                className="c-button--small u-margin-tiny"
                click={() => this.removeShape(index)}
                variant="secondary">Remove</Button>
            </li>);
          })}
        </ul>
      </>
    );
  }
}

Map.propTypes = {
  config: PropTypes.object,
  map: PropTypes.func,
  height: PropTypes.string,
  geojson: PropTypes.object,
  editMode: PropTypes.bool,
  onGeojsonChange: PropTypes.func
}

Map.defaultProps = {
  config: {
    minZoom: 2,
    zoom: 8,
    center: [51.505, -0.09],
    detectRetina: true
  },
  map: () => {},
  height: '350px',
  geojson: null,
  editMode: false,
  onGeojsonChange: () => {}
}

export default withTranslation()(Map);
