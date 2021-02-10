const metricValues = [
  'experience',
  'land_size',
  'price_per_hectare',
  'biomass_per_hectare',
  'carbon_impact',
  'species_impacted'
];

const treeValues = [
  'count',
  'is_native',
  'name',
  'owner',
  'price_to_maintain',
  'price_to_plant',
  'saplings',
  'site_prep',
  'produces',
  'survival_rate',
  'season'
];

/**
 * Parse form response into the correct format:
 * [{
 *   restoration_type: type,
 *      ...keys // (experience, land_size, price_per_hectare etc...);
 *  }...]
 * @param  {[type]} metricObject Response from the create pitch form
 * @return {[type]}              Array in the correct format for project metric creation
 */
export const getArrayOfMetrics = (metricObject) => {
  const metricArray = [];
  for (const key in metricObject) {
      const keySplit = key.split('-');
      const metricKey = keySplit[0];
      const modelKey = keySplit[1];

      const newMetricObject = {restoration_method: metricKey};
      newMetricObject[modelKey] = parseInt(metricObject[key], 10);

      const index = metricArray.findIndex(metric => metric.restoration_method === metricKey);

      if (index === -1) {
        metricArray.push(newMetricObject);
      } else {
        const metric = metricArray[index];
        if (modelKey === 'species_impacted') {
          metric[modelKey] = metricObject[key];
        } else {
          metric[modelKey] = isNaN(parseInt(metricObject[key])) ? null : parseInt(metricObject[key], 10);
        }
      }
  }

  metricArray.forEach((metric) => {
    metricValues.forEach(key => {
      if (metric[key] === undefined) {
        if (key === 'species_impacted') {
          metric[key] = [];
        } else {
          metric[key] = null;
        }
      }
    });
  });

  return metricArray;
};

export const parseMetrics = (metrics) => {
  const metricObject = {}
  metrics.forEach((metric) => {
    const name = metric.restoration_method;
    metricObject[`${name}-experience`] = metric.experience;
    metricObject[`${name}-land_size`] = metric.land_size;
    metricObject[`${name}-price_per_hectare`] = metric.price_per_hectare;
    metricObject[`${name}-biomass_per_hectare`] = metric.biomass_per_hectare;
    metricObject[`${name}-carbon_impact`] = metric.carbon_impact;
    metricObject[`${name}-species_impacted`] = metric.species_impacted;
  });
  return metricObject;
};

export const getArrayOfTreeSpecies = (treeObject) => {
  const tree = JSON.parse(JSON.stringify(treeObject));
  const treeArray = [];
  delete tree.listCount;
  for (const key in tree) {
      const keySplit = key.split('-');
      const treeKey = keySplit[0];
      const modelKey = keySplit[1];

      const index = treeKey;

      if (!treeArray[index]) {
        treeArray.push({});
      }
      const specie = treeArray[index];
      switch (modelKey) {
        case 'name':
        case 'owner':
        case 'season':
          specie[modelKey] = tree[key];
          break;
        case 'is_native':
          specie[modelKey] = !!tree[key][0]
          break;
        case 'produces':
          const produces = getProducesObjects(tree[key]);
          specie.produces_food = produces.produces_food;
          specie.produces_firewood = produces.produces_firewood;
          specie.produces_timber = produces.produces_timber;
          break;
        default:
          specie[modelKey] = parseFloat(tree[key]);
          break;
      }
  }

  treeArray.forEach((specie) => {
    treeValues.forEach(key => {
      if (specie[key] === undefined) {
        if (key === 'is_native') {
          specie[key] = false;
        } else if (key === 'produces') {
          specie.produces_food = specie.produces_food || false;
          specie.produces_firewood = specie.produces_firewood || false;
          specie.produces_timber = specie.produces_timber || false;
        } else {
          specie[key] = null;
        }
      }
    });
  });

  return treeArray;
};

const parseTreeSpecies = (treeSpeices) => {
  const treeObject = {};

  treeSpeices.forEach((species, index) => {
    treeObject[`${index}-owner`] = species.owner;
    treeObject[`${index}-survival_rate`] = species.survival_rate;
    treeObject[`${index}-saplings`] = species.saplings;
    treeObject[`${index}-site_prep`] = species.site_prep;
    treeObject[`${index}-price_to_maintain`] = species.price_to_maintain;
    treeObject[`${index}-price_to_plant`] = species.price_to_plant;
    treeObject[`${index}-count`] = species.count;
    treeObject[`${index}-name`] = species.name;
    treeObject[`${index}-is_native`] = species.is_native ? [`${index}-is_native`] : [];
    treeObject[`${index}-produces`] = parseProduces(species, index);
    treeObject[`${index}-season`] = species.season;
  });

  return {
    ...treeObject,
    listCount: treeSpeices.length
  };
};

export const getArrayOfCarbonCerts = (carbonCertsObject) => {
  const carbonCert = JSON.parse(JSON.stringify(carbonCertsObject));
  const carbonCertsArray = [];
  delete carbonCert.listCount;
  for (const key in carbonCert) {
    const keySplit = key.split('-');
    const certKey = keySplit[0];
    const modelKey = keySplit[1];

    const index = certKey;

    if (!carbonCertsArray[index]) {
      carbonCertsArray.push({});
    }
    const newCarbonCert = carbonCertsArray[index];
    newCarbonCert[modelKey] = carbonCert[key];
    if (!newCarbonCert.other_value) {
      newCarbonCert.other_value = null;
    }
    if (!newCarbonCert.link) {
      newCarbonCert.link = null;
    }
  }

  return carbonCertsArray;
};

const parseCarbonCerts = (carbonCerts) => {
  const carbonCertsObject = {};

  carbonCerts.forEach((cert, index) => {
    carbonCertsObject[`${index}-type`] = cert.type;
    carbonCertsObject[`${index}-other_value`] = cert.other_value;
    carbonCertsObject[`${index}-link`] = cert.link;
  });

  return {
    ...carbonCertsObject,
    listCount: carbonCerts.length === 0 ? 1 : carbonCerts.length
  };
};

const getProducesObjects = (produceArray) => {
  const object = {
    produces_food: false,
    produces_firewood: false,
    produces_timber: false
  }

  produceArray.forEach((produce) => {
    const key = produce.split('-')[1];
    object[key] = true;
  });

  return object;
};

const parseProduces = (species, index) => {
  const keys = ['produces_food', 'produces_firewood', 'produces_timber'];
  const parsed = [];

  keys.forEach(key => {
    if (species[key]) {
      parsed.push(`${index}-${key}`);
    }
  });

  return parsed;
};

export const getArrayOfTeamMembers = (teamMembers = []) => {
  return teamMembers.map((tm) => {
    return {
      user_id: tm.id
    }
  });
};

export const parseTeamMembers = (teamMembers = []) => {
  return teamMembers.map((tm) => ({
    id: tm.user_id,
    type: 'user'
  }));
};

export const getArrayOfDocuments = (documents = []) => {
  return documents.map((doc) => ({
    name: doc.name,
    type: "legal",
    document: doc.id !== undefined ? doc.id : doc.document
  }));
};

export const revenueDriversToString = (revenueDrivers, t) => {
  return revenueDrivers.map((item) => {
    return t(`api.revenue_drivers.${item}`);
  }).join(', ');
};

export const isProjectArchived = (project) => {
  return project && project.completed_at && !project.successful
};

export const parsePitchDraft = (draft) => {
  let model = draft.data.pitch;

  let childModels = {
    pitch_contacts: parseTeamMembers(draft.data.pitch_contacts),
    restoration_method_metrics: parseMetrics(draft.data.restoration_method_metrics),
    tree_species: parseTreeSpecies(draft.data.tree_species),
    carbon_certifications: parseCarbonCerts(draft.data.carbon_certifications)
  };

  return { model, childModels }
};

export const getMediaId = (orginalValue, uploadState) => {
  let state = JSON.parse(JSON.stringify(uploadState));
  let id = orginalValue;

  if (state.data && state.data.id) {
    id = state.data.id;
  }

  return id || null;
};
