export default [
  {
    title: 'filters.landOwnerships',
    modelKey: 'land_ownerships',
    valueKey: 'ownership'
  },
  {
    title: 'filters.landTypes',
    modelKey: 'land_types',
    valueKey: 'type'
  },
  {
    title: 'filters.restorationMethods',
    modelKey: 'restoration_methods',
    valueKey: 'method'
  },
  {
    title: 'filters.fundingSources',
    modelKey: 'funding_sources',
    valueKey: 'source'
  },
  {
    title: 'filters.restorationGoals',
    modelKey: 'restoration_goals',
    valueKey: 'goal'
  },
  {
    title: 'filters.fundingBracket',
    apiPath: 'funding_brackets',
    modelKey: 'funding_bracket',
    valueKey: 'bracket',
    isRadio: true,
  },
  {
    title: 'filters.landSize',
    apiPath: 'land_sizes',
    modelKey: 'land_size',
    isRadio: true,
    valueKey: 'size'
  },
  {
    title: 'filters.geography',
    apiPath: 'continents',
    modelKey: 'land_continent',
    isRadio: true,
    valueKey: 'continent'
  },
  {
    title: 'filters.sustDevGoals',
    modelKey: 'sustainable_development_goals',
    valueKey: 'goal'
  },
  {
    title: 'filters.reportingFrequencies',
    apiPath: 'reporting_frequencies',
    modelKey: 'reporting_frequency',
    isRadio: true,
    valueKey: 'frequency'
  },
  {
    title: 'filters.reportingLevels',
    apiPath: 'reporting_levels',
    modelKey: 'reporting_level',
    isRadio: true,
    valueKey: 'level'
  },
  {
    offerTitle: 'filters.minimumPricePerTree',
    pitchTitle: 'filters.maximumPricePerTree',
    modelKey: 'price_per_tree',
    valueKey: 'amount',
  }
]
