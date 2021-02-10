// API attribute list data (/land_sizes etc.) is pluralized in the transifex JSON.
// The attribute on a project is NOT pluralized
// This is a workaround to get the correct labels.
const pluralKeys = {
  "funding_bracket": "funding_brackets",
  "land_size": "land_sizes",
  "land_continent": "continents",
  "land_country": "countries",
  "reporting_frequency": "reporting_frequencies",
  "reporting_level": "reporting_levels"
};


export const convertReduxFiltersToApiFormat = (filters, isPitch) => {
    const apiFormat = Object.keys(filters)
    .filter(key => filters[key] && filters[key].length !== 0)
    .map(key => {
        let res;
        switch(key) {
            case 'land_size':
            case 'land_continent':
            case 'land_country':
            case 'reporting_frequency':
            case 'reporting_level':
            case 'funding_bracket':
                // in
                res = {
                    attribute: key,
                    operator: 'in',
                    value: filters[key]
                }
                break;
            case 'land_types':
            case 'land_ownerships':
            case 'restoration_methods':
            case 'restoration_goals':
            case 'funding_sources':
            case 'sustainable_development_goals':
                // contains
                res = {
                    attribute: key,
                    operator: 'contains',
                    value: filters[key]
                }
                break;
            case 'price_per_tree':
            case 'funding_amount':
                if (isPitch) {
                    res = {
                        attribute: key,
                        operator: 'between',
                        value: [Number(filters[key]), 2147400000]
                    }
                } else {
                    res = {
                        attribute: key,
                        operator: 'between',
                        value: [0, Number(filters[key])]
                    }
                }
                break;
            case 'long_term_engagement':
                // boolean
                res = {
                    attribute: key,
                    operator: 'boolean',
                    value: filters[key]
                }
                break;
            default:
                break;
        }
        return res;
    });
    return apiFormat;
};

export const getFilterTranslation = (attribute, filter, t) => {
  // Transifex JSON workaround
  // Use the pluralized version of the translation key if it exists
  const attribLabel = Object.keys(pluralKeys).includes(attribute) ? pluralKeys[attribute] : attribute;

  return t(`api.${attribLabel}.${filter}`);
}
