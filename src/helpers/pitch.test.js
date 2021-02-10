import { getArrayOfMetrics, getArrayOfTreeSpecies, getArrayOfCarbonCerts } from './pitch';

it('getArrayOfMetrics gets an array of metrics', () => {
  // This is an example metric object that is created from a user.. we need to
  // parse it into the correct format:
  // [{
  //   restoration_type: type,
  //   ...keys // (experience, land_size, price_per_hectare etc...);
  // }...]
  const metricObject = {
   "agroforestry-experience":"1",
   "agroforestry-land_size":"2",
   "agroforestry-price_per_hectare":"3",
   "agroforestry-biomass_per_hectare":"4",
   "agroforestry-carbon_impact":"5",
   "agroforestry-species_impacted": [
     "another thing"
   ],
   "terraces-experience":"7",
   "terraces-land_size":"8",
   "terraces-price_per_hectare":"9",
   "terraces-biomass_per_hectare":"10",
   "terraces-carbon_impact":"11",
   "terraces-species_impacted": [
     "another thing"
   ],
   "assisted_natural-experience":"13",
   "assisted_natural-land_size":"14",
   "assisted_natural-price_per_hectare":"15",
   "assisted_natural-biomass_per_hectare":"16",
   "assisted_natural-carbon_impact":"17",
   "assisted_natural-species_impacted": [
     "another thing"
   ],
   "ecological-experience":"19",
   "ecological-land_size":"20",
   "ecological-price_per_hectare":"21",
   "ecological-biomass_per_hectare":"22",
   "ecological-carbon_impact":"23",
   "ecological-species_impacted": [
     "a thing"
   ],
   "something-experience": "22"
  };

  const array = getArrayOfMetrics(metricObject);
  expect(array.length).toEqual(5); // 5 metric types

  // For each type, expect that it's in the new array.
  ['agroforestry', 'terraces', 'assisted_natural', 'ecological', 'something'].forEach(type => {
    ['experience', 'land_size', 'price_per_hectare', 'biomass_per_hectare', 'carbon_impact', 'species_impacted'].forEach(key => {
      const index = array.findIndex(metric => {
        let valueCheck = false
        if (key === 'species_impacted') {
          valueCheck = typeof metric[key] === 'object';
        } else {
          valueCheck = metric[key] === parseInt(metricObject[`${type}-${key}`], 10);
        }

        return metric.restoration_method === type &&
        (valueCheck || metric[key] === null)
      });
      expect(index).toBeGreaterThan(-1);
    });
  });
});

it('getArrayOfCarbonCerts gets an array of carbon certificates', () => {
  const carbonCertObject = {
    "0-type": "verified_carbon_standard",
    "0-link": "https://www.3sidedcube.com",
    "1-type": "plan_vivo",
    "1-link": "https://www.google.com",
    "listCount": 2
  };

  const array = getArrayOfCarbonCerts(carbonCertObject);
  expect(array.length).toEqual(2); // 5 metric types

  // For each type, expect that it's in the new array.
  ['0', '1'].forEach(type => {
    ['carbon_certification_type', 'link'].forEach(key => {
      const index = array.findIndex(cert => cert[key] === carbonCertObject[`${type}-${key}`]);
      expect(index).toBeGreaterThan(-1);
    });
  });
});

it('getArrayOfTreeSpecies gets an array of tree species', () => {
  const treeObject = {
    "0-count": 122331,
    "0-is_native": ["0-is_native"],
    "0-name": "treeeee",
    "0-owner": "Blah bnlah",
    "0-price_to_maintain": 123123,
    "0-price_to_plant": 123123,
    "0-produces": ["0-produces_food", "0-produces_firewood"],
    "0-survival_rate": 32234,
    "0-season": "Spring",
    "0-saplings": 1234,
    "0-site_prep": 120,
    "1-count": 3823,
    "1-is_native": [],
    "1-name": "blshsd",
    "1-owner": "Blah",
    "1-price_to_maintain": 348932879,
    "1-price_to_obtain": 34783,
    "1-price_to_plant": 89328932,
    "1-produces": ["1-produces_food"],
    "1-season": "Winter",
    "1-saplings": 123,
    "1-site_prep": 421,
    "listCount": 2
  };

  const array = getArrayOfTreeSpecies(treeObject);
  expect(array.length).toEqual(2); // 5 metric types

  // For each type, expect that it's in the new array.
  ['0', '1'].forEach(type => {
    [
     'count',
     'is_native',
     'name',
     'owner',
     'price_to_maintain',
     'produces_food',
     'produces_timber',
     'produces_firewood',
     'saplings',
     'site_prep',
     'price_to_plant',
     'survival_rate'
    ].forEach(key => {
      const index = array.findIndex(specie => {
        let valueCheck = false
        switch (key) {
          case 'produces_food':
          case 'produces_timber':
          case 'produces_firewood':
            valueCheck = true; // Update test
            break;
          case 'is_native':
            const nativeIndex = treeObject[`${type}-is_native`].findIndex(item => item.split('-')[1] === key);
            valueCheck = specie[key] === (nativeIndex > -1);
            break;
          case 'name':
          case 'owner':
            valueCheck = specie[key] === treeObject[`${type}-${key}`];
            break;
          default:
            valueCheck = specie[key] === parseInt(treeObject[`${type}-${key}`], 10);
            break;
        }

        return valueCheck || specie[key] === null;
      });

      expect(index).toBeGreaterThan(-1);
    });
  });
});
