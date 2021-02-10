import React from 'react';
import PropTypes from 'prop-types';
import Map from '../map/Map';
import { useTranslation } from 'react-i18next';

const FormMapInput = (props) => {
  const { i18n } = useTranslation();
  const { onChange, value } = props;
  let geojson = value;
  const initialCountry = props.modelContext ? props.modelContext.land_country : null;

  // Leaflet requires the geojson to be an object.
  // Parse the model from it's string form here.
  if (typeof geojson === 'string') {
    geojson = geojson.length > 0 ? JSON.parse(value) : null
  }

  return (
    <Map
      editMode
      onGeojsonChange={(value) => onChange({value})}
      geojson={geojson}
      language={i18n.language}
      initialCountry={initialCountry}
    />
  );
}

FormMapInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
}

FormMapInput.defaultProps = {
  value: null
}

export default FormMapInput;
