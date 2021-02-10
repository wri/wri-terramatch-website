import { AREAS } from '../components/map/draw-control/constants';

const geojsonArea = require('@mapbox/geojson-area');

// check area size on draw complete
const checkArea = (area) => {
  return geojsonArea.geometry(area.geometry) >= AREAS.minSize;
}

export { checkArea };
