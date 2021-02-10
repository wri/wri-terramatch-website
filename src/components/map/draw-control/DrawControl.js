import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { Draw, Control } from 'leaflet-draw'; // eslint-disable-line no-unused-vars
import circleToPolygon from 'circle-to-polygon';
import { DRAW_CONTROL, DRAW_CONTROL_DISABLED, POLYGON_STYLES, POLYGON_STYLES_ERROR } from './constants';
import 'leaflet-draw/dist/leaflet.draw.css';
import { Modal, Button } from 'tsc-chameleon-component-library';
import FormInput from '../../formInput/FormInput';
import FORM_TYPES from '../../formInput/FormInputTypes';
import { withTranslation } from 'react-i18next';
import { checkArea } from '../../../helpers';

class DrawControl extends React.Component {
  constructor(props) {
    super(props);
    this.t = props.t;
    this.state = {
      isPickingRadius: false,
      isPickingRadiusResolve: null,
      radius: 56,
      lng: 0, // -180:+180
      lat: 0 // -90:+90
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
    this.map.addLayer(this.featureGroup);
  }

  setFeatures = () => {
    // always clear layers before setting
    // allows for geojson to be added/remove to
    this.featureGroup.clearLayers();

    L.geoJson(this.props.geojson, {
      onEachFeature: (feature, layer) => {
        if (!checkArea(layer.toGeoJSON())) {
          this.setLayerStyle(POLYGON_STYLES_ERROR, layer);
        } else {
          this.setLayerStyle(POLYGON_STYLES, layer);
        }
        this.featureGroup.addLayer(layer);
        if (layer.getBounds) {
          this.map.fitBounds(layer.getBounds());
          this.props.onZoomChange && this.props.onZoomChange(this.map.getBoundsZoom(layer.getBounds()));
        }
      }
    });
  }

  setDrawing = () => {
    const DRAW_CONFIG = {...DRAW_CONTROL};
    DRAW_CONFIG.draw.polygon.drawError.message = this.t('errors.map.intersect');
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

    if (this.props.mode === 'manage') {
      this.drawControlDisabled.addTo(this.map);
    } else {
      this.drawControl.addTo(this.map);
    }

    // DRAW LISTENERS
    this.map.on(L.Draw.Event.CREATED, (e) => {
      this.onDrawEventComplete(e);
    });

    this.map.on(L.Draw.Event.EDITSTART, (e) => {
      this.setFeatures();
      this.props.setEditing(true);
    });

    this.map.on(L.Draw.Event.EDITED, (e) => {
      this.onDrawEventEdit(e);
    });

    this.map.on(L.Draw.Event.EDITSTOP, (e) => {
      this.props.setEditing(false);
    });

    this.map.on(L.Draw.Event.DELETESTART, (e) => {
      this.setFeatures();
      this.props.setEditing(true);
    });

    this.map.on(L.Draw.Event.DELETED, (e) => {
      this.onDrawEventDelete(e);
    });

    this.map.on(L.Draw.Event.DELETESTOP, (e) => {
      this.props.setEditing(false);
    });
  }

  enableDrawing = () => {
    this.map.removeControl(this.drawControlDisabled);
    this.drawControl.addTo(this.map);
  }

  disableDrawing = () => {
    this.map.removeControl(this.drawControl);
    this.drawControlDisabled.addTo(this.map);
  }

  // EVENT LISTENERS
  async onDrawEventComplete(e) {
    const layer = e.layer;
    const geoJsonLayer = await this.getLayerGeojson(layer);
    if (!checkArea(geoJsonLayer)) {
      this.setLayerStyle(POLYGON_STYLES_ERROR, layer);
    }
    this.featureGroup.addLayer(layer);
    this.props.onDrawComplete && this.props.onDrawComplete(geoJsonLayer);
    if (layer._map && layer.getBounds) {
      this.map.fitBounds(layer.getBounds());
    }
    if (layer.getBounds) {
      this.props.onZoomChange && this.props.onZoomChange(this.map.getBoundsZoom(layer.getBounds()));
    }
    this.disableDrawing();
  }

  onDrawEventEdit = async (e) => {
    const layers = e.layers;
    await layers.eachLayer(async (layer) => {
      const geoJsonLayer = await this.getLayerGeojson(layer);
      this.featureGroup.addLayer(layer);
      this.props.onDrawComplete && this.props.onDrawComplete(geoJsonLayer);
      this.map.fitBounds(layer.getBounds());
    });
  }

  onDrawEventDelete = (e) => {
    const layer = e.layer;
    this.featureGroup.removeLayer(layer);
    this.props.onDrawComplete && this.props.onDrawDelete();
    if (this.featureGroup.getLayers().length === 0) {
      this.enableDrawing();
    }
  }

  async getLayerGeojson (layer) {
    let geoJsonLayer = layer.toGeoJSON();
    if (geoJsonLayer.geometry.type === 'Point' && !layer._mRadius) {
      // Ask the user for a radius
      const response = await new Promise((resolve) => {
        this.setState({
          isPickingRadius: true,
          isPickingRadiusResolve: resolve,
          lng: geoJsonLayer.geometry.coordinates[0],
          lat: geoJsonLayer.geometry.coordinates[1]
        });
      });
      layer._mRadius = response.radius;
      layer._latlng = { lat: response.lat, lng: response.lng };
      geoJsonLayer.geometry.coordinates[0] = response.lng;
      geoJsonLayer.geometry.coordinates[1] = response.lat;
    }
    if (layer._mRadius) {
      // Convert circle to geoJSON polygon.
      const polygon = circleToPolygon([layer._latlng.lng, layer._latlng.lat], layer._mRadius, 32);
      geoJsonLayer.geometry = polygon;
    }
    return geoJsonLayer;
  }

  onCircleSubmit = (e) => {
    if (e.keyCode !== 13 && e.keyCode !== undefined) {
      return;
    }
    e.preventDefault();

    this.state.isPickingRadiusResolve({
      radius: this.state.radius,
      lng: this.state.lng,
      lat: this.state.lat
    });

    this.setState({
      isPickingRadius: false,
      isPickingRadiusResolve: null
    });
  };

  onRadiusChange = (e) => {
    let value = Number(e.currentTarget.value);
    if (value < 56) {
      value = 56;
    }
    if (value > 20000000) {
      value = 20000000;
    }
    this.setState({radius: value });
  };

  onLngChange = (e) => {
    let value = Number(e.currentTarget.value);
    if (Number(value) < -180) {
      value = -180;
    }

    if (Number(value) > 180) {
      value = 180;
    }
    this.setState({lng: value});
  };

  onLatChange = (e) => {
    let value = Number(e.currentTarget.value);
    if (Number(value) < -90) {
      value = -90;
    }

    if (Number(value) > 90) {
      value = 90;
    }
    this.setState({lat: value});
  };

  setLayerStyle (style, layer) {
    if (layer.setStyle) {
      layer.setStyle(style);
    }
  }

  render() {
    return this.state.isPickingRadius ? (
        <Modal show close={this.onCircleSubmit}>
            <FormInput
              className="u-margin-bottom-small"
              id="radius"
              label={this.t('map.enterRadius')}
              showLabel
              value={this.state.radius}
              onChange={this.onRadiusChange}
              onKeyDown={this.onCircleSubmit}
              min="56"
              max="20000000"
              step="1"
              type={FORM_TYPES.number}
            />
            <FormInput
              className="u-margin-bottom-small"
              id="lng"
              label={this.t('map.enterLong')}
              showLabel
              value={this.state.lng}
              onChange={this.onLngChange}
              onKeyDown={this.onCircleSubmit}
              min="-180"
              max="180"
              type={FORM_TYPES.number}
            />
            <FormInput
              className="u-margin-bottom-large"
              id="lat"
              label={this.t('map.enterLat')}
              showLabel
              value={this.state.lat}
              onChange={this.onLatChange}
              onKeyDown={this.onCircleSubmit}
              min="-90"
              max="90"
              type={FORM_TYPES.number}
            />
            <div className="u-position-bottom u-position-right u-margin-small">
              <Button
                className="c-button--small u-margin-tiny"
                click={this.onCircleSubmit}>
                {this.t('common.continue')}
              </Button>
            </div>
        </Modal>
    ) : null;
  }
}

DrawControl.propTypes = {
  map: PropTypes.object,
  geojson: PropTypes.object,
  setEditing: PropTypes.func
};

DrawControl.defaultProps = {
  map: null,
  geojson: null,
  setEditing: () => {}
}

export default withTranslation()(DrawControl);
