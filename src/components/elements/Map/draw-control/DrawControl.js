import "leaflet-draw/dist/leaflet.draw.css";

import circleToPolygon from "circle-to-polygon";
import L from "leaflet";
import { Control, Draw } from "leaflet-draw"; // eslint-disable-line no-unused-vars
import React from "react";

import Button from "../../Button/Button.tsx";
import Dropdown from "../../Inputs/Dropdown/Dropdown";
import Input from "../../Inputs/Input/Input";
import { DRAW_CONTROL, DRAW_CONTROL_DISABLED, POLYGON_STYLES, POLYGON_STYLES_ERROR } from "../mapSettings";
import Dialog from "./Dialog";

class DrawControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPickingExtraPropertiesType: null,
      isPickingExtraProperties: false,
      isPickingExtraPropertiesResolve: null,
      radius: 56,
      lng: 0, // -180:+180
      lat: 0, // -90:+90,
      deleteMode: false
    };
  }

  /** TODO: use componentDidUpdate */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.map !== nextProps.map) {
      this.map = nextProps.map;
      this.setLayers();
      this.setDrawing();
      if (this.props.geojson) {
        this.setFeatures();
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.geojson !== prevProps.geojson) {
      this.setFeatures();
    }
  }

  // SETTERS
  setLayers = () => {
    this.featureGroup = new L.FeatureGroup();
    this.map?.addLayer(this.featureGroup);
  };

  setFeatures = () => {
    // always clear layers before setting
    // allows for geojson to be added/remove to
    this.featureGroup?.clearLayers();
    L.geoJson(this.props.geojson, {
      onEachFeature: (feature, layer) => {
        const geoJson = layer.toGeoJSON();
        if (this.props.interventionTypes?.length > 0 && !geoJson.properties.IntervType) {
          this.setLayerStyle(POLYGON_STYLES_ERROR, layer);
        } else {
          this.setLayerStyle(POLYGON_STYLES, layer);
        }
        layer.on("click", this.onClickLayer);
        this.featureGroup?.addLayer(layer);
      }
    });

    this.fitBounds();
  };

  onClickLayer = async e => {
    if (!this.state.deleteMode) {
      const layer = e.target;

      await this.getLayerGeojson(layer);
      this.props.onDrawComplete(await this.getMapFeatureCollections());
    }
  };

  fitBounds() {
    try {
      this.map?.fitBounds(this.featureGroup.getBounds());
      this.props.onZoomChange && this.props.onZoomChange(this.map?.getBoundsZoom(this.featureGroup.getBounds()));
    } catch (e) {
      console.log(e);
    }
  }

  setDrawing = () => {
    const DRAW_CONFIG = { ...DRAW_CONTROL };
    DRAW_CONFIG.draw.polygon.drawError.message = this.props.t("You can't draw an area that intersects");
    const drawControl = Object.assign(DRAW_CONFIG, {
      edit: {
        featureGroup: this.featureGroup,
        remove: true
      }
    });
    const drawControlDisabled = Object.assign(DRAW_CONTROL_DISABLED, {
      edit: {
        featureGroup: this.featureGroup,
        remove: true
      }
    });

    this.drawControl = new L.Control.Draw(drawControl);
    this.drawControlDisabled = new L.Control.Draw(drawControlDisabled);

    if (this.props.mode === "manage" || this.props.hideEditControls) {
      this.drawControlDisabled.addTo(this.map);
    } else {
      this.drawControl.addTo(this.map);
    }

    // DRAW LISTENERS
    this.map?.on(L.Draw.Event.CREATED, e => {
      this.onDrawEventComplete(e);
    });

    this.map?.on(L.Draw.Event.EDITSTART, e => {
      this.setFeatures();
      this.props.setEditing(true);
    });

    this.map?.on(L.Draw.Event.EDITED, e => {
      this.onDrawEventEdit(e);
    });

    this.map?.on(L.Draw.Event.EDITSTOP, e => {
      this.props.setEditing(false);
    });

    this.map?.on(L.Draw.Event.DELETESTART, e => {
      this.setFeatures();
      this.setState({ deleteMode: true });
      this.props.setEditing(true);
    });

    this.map?.on(L.Draw.Event.DELETED, e => {
      this.onDrawEventDelete(e);
    });

    this.map?.on(L.Draw.Event.DELETESTOP, e => {
      this.props.setEditing(false);
      this.setState({ deleteMode: false });
    });
  };

  enableDrawing = () => {
    this.map?.removeControl(this.drawControlDisabled);
    this.drawControl.addTo(this.map);
  };

  disableDrawing = () => {
    this.map?.removeControl(this.drawControl);
    this.drawControlDisabled.addTo(this.map);
  };

  async getMapFeatureCollections() {
    const features = [];
    const layers = this.featureGroup.getLayers();

    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      const feature = await this.getLayerGeojson(layer, undefined, true, i + 1);
      if (feature) features.push(feature);
    }

    return {
      type: "FeatureCollection",
      features
    };
  }

  // EVENT LISTENERS
  async onDrawEventComplete(e) {
    const layer = e.layer;
    const layerType = e.layerType;

    await this.getLayerGeojson(layer, layerType);

    this.featureGroup.addLayer(layer);
    this.props.onDrawComplete && this.props.onDrawComplete(await this.getMapFeatureCollections());
    this.fitBounds();
  }

  onDrawEventEdit = async e => {
    const layers = e.layers;
    await layers.eachLayer(async layer => {
      await this.getLayerGeojson(layer, undefined, false);
      this.featureGroup.addLayer(layer);
    });
    this.fitBounds();
    this.props.onDrawComplete && this.props.onDrawComplete(await this.getMapFeatureCollections());
  };

  onDrawEventDelete = async e => {
    const layer = e.layer;

    if (layer) {
      this.featureGroup?.removeLayer(layer);
    }
    this.props.onDrawComplete && this.props.onDrawComplete(await this.getMapFeatureCollections());
  };

  async getLayerGeojson(layer, layerType, skipDialog, layerId) {
    if (!layer.toGeoJSON || !layer.toGeoJSON()?.geometry?.type) return null;

    let geoJsonLayer = layer.toGeoJSON();
    if (layerType) layer._layerType = layerType;

    if (!skipDialog && layer._layerType === "circlemarker") {
      const response = await new Promise(resolve => {
        this.setState({
          isPickingExtraProperties: true,
          isPickingExtraPropertiesType: "Point",
          isPickingExtraPropertiesResolve: resolve,
          lng: geoJsonLayer.geometry.coordinates[0],
          lat: geoJsonLayer.geometry.coordinates[1],
          name: geoJsonLayer.properties.Name,
          interventionType: geoJsonLayer.properties.IntervType,
          radius: layer._mRadius || 56
        });
      });

      layer._mRadius = response.radius;
      layer._latlng = { lat: response.lat, lng: response.lng };
      geoJsonLayer.geometry.coordinates[0] = response.lng;
      geoJsonLayer.geometry.coordinates[1] = response.lat;
      if (response.name) layer._name = response.name;
      if (response.interventionType) layer._interventionType = response.interventionType;
    }
    if (!skipDialog && this.props.interventionTypes?.length > 0 && layer._layerType !== "circlemarker") {
      // Ask the user for a radius
      const response = await new Promise(resolve => {
        this.setState({
          isPickingExtraProperties: true,
          isPickingExtraPropertiesType: "restOfShapes",
          isPickingExtraPropertiesResolve: resolve,
          name: geoJsonLayer.properties.Name,
          interventionType: geoJsonLayer.properties.IntervType
        });
      });
      if (response.name) layer._name = response.name;
      if (response.interventionType) layer._interventionType = response.interventionType;
    }
    if (layer._mRadius) {
      // Convert circle to geoJSON polygon.
      const polygon = circleToPolygon([layer._latlng.lng, layer._latlng.lat], layer._mRadius, 32);
      geoJsonLayer.geometry = polygon;
    }
    if (layer._name) {
      geoJsonLayer.properties.Name = layer._name;
    }
    if (layer._interventionType) {
      geoJsonLayer.properties.IntervType = layer._interventionType;
    }

    if (layerId) geoJsonLayer.properties.PolygonID = layerId;

    return geoJsonLayer;
  }

  onCircleSubmit = e => {
    if (e.keyCode !== 13 && e.keyCode !== undefined) {
      return;
    }
    e.preventDefault();

    if (this.props.interventionTypes?.length > 0 && !this.state.interventionType) {
      this.setState({
        interventionTypeError: {
          type: "required",
          message: "This field is required"
        }
      });
    } else {
      this.state.isPickingExtraPropertiesResolve({
        radius: this.state.radius,
        lng: this.state.lng,
        lat: this.state.lat,
        name: this.state.name,
        interventionType: this.state.interventionType
      });

      this.setState({
        isPickingExtraProperties: false,
        isPickingExtraPropertiesResolve: null
      });
    }
  };

  onClosePicker = () => {
    this.setState({
      isPickingExtraProperties: false,
      isPickingExtraPropertiesResolve: null
    });
  };

  onRadiusChange = e => {
    let value = Number(e.currentTarget.value);
    if (value < 56) {
      value = 56;
    }
    if (value > 20000000) {
      value = 20000000;
    }
    this.setState({ radius: value });
  };

  onLngChange = e => {
    let value = Number(e.currentTarget.value);
    if (Number(value) < -180) {
      value = -180;
    }

    if (Number(value) > 180) {
      value = 180;
    }
    this.setState({ lng: value });
  };

  onLatChange = e => {
    let value = Number(e.currentTarget.value);
    if (Number(value) < -90) {
      value = -90;
    }

    if (Number(value) > 90) {
      value = 90;
    }
    this.setState({ lat: value });
  };

  onNameChange = e => {
    this.setState({ name: e.currentTarget.value });
  };

  onInterventionTypeChange = value => {
    this.setState({ interventionType: value, interventionTypeError: null });
  };

  setLayerStyle(style, layer) {
    if (layer.setStyle) {
      layer.setStyle(style);
    }
  }

  render() {
    return (
      <Dialog onClose={this.onClosePicker} open={this.state.isPickingExtraProperties}>
        <div className="m-auto flex max-w-[800px] flex-col items-end rounded bg-white p-4 shadow">
          {this.state.isPickingExtraPropertiesType === "Point" && (
            <>
              <Input
                containerClassName="mb-3 w-full"
                id="radius"
                label={this.props.t("Enter a radius, in meters")}
                value={this.state.radius}
                onChange={this.onRadiusChange}
                onKeyDown={this.onCircleSubmit}
                min="56"
                max="20000000"
                step="1"
                type="number"
              />
              <Input
                containerClassName="mb-3 w-full"
                id="lng"
                label={this.props.t("Enter a longitude, in degrees")}
                value={this.state.lng}
                onChange={this.onLngChange}
                onKeyDown={this.onCircleSubmit}
                min="-180"
                max="180"
                type="number"
              />
              <Input
                containerClassName="mb-3 w-full"
                id="lat"
                label={this.props.t("Enter a latitude, in degrees")}
                value={this.state.lat}
                onChange={this.onLatChange}
                onKeyDown={this.onCircleSubmit}
                min="-90"
                max="90"
                type="number"
              />
            </>
          )}
          {this.props.interventionTypes?.length > 0 && (
            <>
              <Input
                containerClassName="mb-3 w-full"
                id="Name"
                label={this.props.t("Enter Name")}
                value={this.state.name}
                onChange={this.onNameChange}
                type="text"
              />
              <Dropdown
                containerClassName="mb-12 w-full"
                id="intervention_type"
                name="intervention_type"
                label={this.props.t("Enter Intervention Type")}
                value={this.state.interventionType}
                onChange={this.onInterventionTypeChange}
                isSearchable={false}
                required
                error={this.state.interventionTypeError}
                options={this.props.interventionTypes}
              />
            </>
          )}

          <Button className="m-1.5" onClick={this.onCircleSubmit}>
            {this.props.t("Continue")}
          </Button>
        </div>
      </Dialog>
    );
  }
}

DrawControl.defaultProps = {
  map: null,
  geojson: null,
  setEditing: () => {}
};

export default DrawControl;
