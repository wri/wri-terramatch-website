import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { canFetch } from '../../helpers';
import ProgressRing from '../progressRing/ProgressRing';

const matchFilters = [
  'land_ownerships',
  'land_types',
  'restoration_methods',
  'funding_sources',
  'restoration_goals',
  'funding_bracket',
  'land_size',
  'land_continent',
  'sustainable_development_goals',
  'reporting_frequency',
  'reporting_level',
  'price_per_tree'
];

// custom styling for react-select
const customStyles = {
  option: (styles, state) => ({
      ...styles,
      backgroundColor: state.isSelected ? "#27A9E0" : null
    })
};

const CATEGORIES_COUNT = matchFilters.length;

const ProjectCategory = props => {
  const { item, showIndicator } = props;
  const { isArray } = item;

  const renderIndicator = () => {
    if (!showIndicator) {
      return <div className="c-match-category__indicator c-match-category__indicator--null" />
    } else if (item.match) {
      return <div className="c-match-category__indicator" />
    } else {
      return <div className="c-match-category__indicator c-match-category__indicator--invalid" />
    }
  }

  if (!isArray) {
    return (
      <div className="c-match-category c-match-category--single">
        <div className="c-match-category__label">
          <img src={require(`../../assets/images/icons/match/${item.category}.svg`)} alt='' role='presentation' />
          <p className="u-font-primary">{item.key}</p>
        </div>
        <div className="c-match-category__value">
          <p className="u-font-primary u-text-bold u-text-capitalize">
            {item.value}
          </p>
        </div>
        {renderIndicator()}
      </div>
    );
  }

  return (
    <>
      <div className="c-match-category">
        <div className="c-match-category__label">
          <img src={require(`../../assets/images/icons/match/${item.category}.svg`)} alt='' role='presentation' />
          <p className="u-font-primary">{item.key}</p>
        </div>
        <div className="c-match-category__value">
          <p className="u-font-primary u-text-bold u-text-capitalize">
            {item.value[0]}
          </p>
        </div>
        {renderIndicator()}
      </div>
      <div className="c-match-array">
        <p className="u-font-primary u-text-bold u-padding-vertical-tiny">
          {item.value.join(', ')}
        </p>
      </div>
    </>
  )
}

const ProjectCard = props => {
  const {
    project,
    hideCompatibility,
    offersState,
    getOffers,
    pitchesState,
    getPitches,
    me,
    isOffer,
    clearState,
    compareProjectId } = props;

  const { t } = useTranslation();
  const [dropdownOffers, setDropdownOffers] = useState([]);
  const [selectedProject , setSelectedProject] = useState(null);

  useEffect(() => {
    const userOrg = me.data && me.data.organisation_id;

    if (userOrg && canFetch(offersState)
      && canFetch(pitchesState)) {
      isOffer ? getPitches(userOrg) : getOffers(userOrg);
    }

  }, [getOffers, getPitches, offersState, pitchesState, me, isOffer])

  useEffect(() => {
    const items = isOffer ? pitchesState : offersState;

    if (items && items.data && items.data.length) {
        const formatted = items.data.map(item => {
          return {
              id: item.id,
              label: item.name,
              value: item
          };
        });
        if (compareProjectId !== undefined && compareProjectId !== null) {
          setSelectedProject(formatted.find(project => project.id === parseInt(compareProjectId, 10)) ||
                             formatted[0]);
        } else {
          setSelectedProject(formatted[0]);
        }
        setDropdownOffers(formatted);
    }
  }, [setSelectedProject, setDropdownOffers, offersState, pitchesState, isOffer, compareProjectId]);

  useEffect(() => {
    return clearState;
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const categoryList = Object.keys(project)
    .filter(category => matchFilters.includes(category))
    .sort((a, b) => matchFilters.indexOf(a) - matchFilters.indexOf(b))
    .map(category => {
        const projectValue = project[category];

        let localizedKey = t(`attributes.${category}`);
        let localizedValue = t(`api.${category}.${projectValue}`);
        let isArray = false;

        if (Array.isArray(projectValue) && projectValue.length > 1) {
          isArray = true;
          localizedValue = Array.from(projectValue, value => t(`api.${category}.${value}`))
        }

        if (category === 'land_continent') {
          localizedValue = projectValue;

          const country = t(`api.countries.${project.land_country}`);
          const continent = t(`api.continents.${project.land_continent}`);

          localizedKey = t('filters.geography');
          localizedValue = `${continent}${project.land_country ? `, ${country}` : ''}`;
        }

        if (category === 'reporting_frequency') {
          localizedValue = t(`api.reporting_frequencies.${projectValue}`);
        }

        if (category === 'reporting_level') {
          localizedValue = t(`api.reporting_levels.${projectValue}`);
        }

        if (category === 'price_per_tree') {
          localizedValue = projectValue ? projectValue : t('common.na');
        }

        if (category === 'sustainable_development_goals' && project[category].length === 0) {
          localizedValue = t('common.na');
        }

        let match = null;


        if (selectedProject) {
            const matchValue = selectedProject.value[category];
            if (category === 'price_per_tree') {
              if (isOffer) {
                match = matchValue <= projectValue;
              } else {
                match = matchValue >= projectValue;
              }
            } else if (Array.isArray(projectValue)) {
                match = matchValue.some(elem => projectValue.includes(elem));
                if (!match && category === 'sustainable_development_goals') {
                  match = matchValue.length === 0 || projectValue.length === 0;
                }
            } else if (projectValue === null && category === 'sustainable_development_goals') {

            } else {
                match = matchValue === projectValue;
            }
        }

        const item = {
            key: localizedKey,
            category: category,
            value: localizedValue,
            match: match,
            isArray: isArray
        }

        return item;
    });

    const matchCount = categoryList.filter(item => item.match).length;
    const elements = categoryList.map((item, i) => <ProjectCategory item={item} key={i} showIndicator={me.data && me.data.organisation_id && !hideCompatibility} />)

    return (
      <div className="c-match u-padding-vertical-large">
        { selectedProject && !hideCompatibility &&
            <>
                <div className="u-text-center">
                  <p className="u-text-uppercase u-margin-none u-font-primary u-text-bold u-font-medium">
                    {isOffer ? t('project.match.basedOnPitch') : t('project.match.basedOnFunding')}
                  </p>
                </div>
                <Select
                    isSearchable={false}
                    className="u-margin-top-small c-match__select"
                    classNamePrefix="c-match__select"
                    options={dropdownOffers}
                    onChange={(data) => setSelectedProject(data)}
                    styles={customStyles}
                    defaultValue={selectedProject}
                    value={selectedProject}
                />
                <ProgressRing
                  radius={40}
                  pointerRadius={7.3}
                  strokeWidth={5.6}
                  trackStrokeWidth={5.6}
                  progress={matchCount}
                  progressMax={CATEGORIES_COUNT}
                  showOutOf
                  unitText="match"
                  className="c-match__progress-ring"
                />
                <div className="u-text-center u-margin-vertical-small">
                  <p className="u-text-uppercase u-font-primary u-text-bold u-font-medium">
                    {matchCount}/{CATEGORIES_COUNT} {t('project.match.amount')}
                  </p>
                </div>

            </>
        }

        {elements}
      </div>
  );
}

ProjectCard.propTypes = {
  isOffer: PropTypes.bool.isRequired,
  hideCompatibility: PropTypes.bool
};

ProjectCard.defaultProps = {
  isOffer: false,
  hideCompatibility: false
};

export default ProjectCard;
