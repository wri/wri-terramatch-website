import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button } from 'tsc-chameleon-component-library';
import FilterSections from '../../components/projectFilters/FilterSectionsContainer';
import SelectedFilterList from '../../components/selectedFilters/SelectedFiltersContainer';
import SortByDropdown from '../../components/sortByDropdown/SortByDropdownContainer';
import Select from 'react-select';
import DropdownIndicator from '../../components/navigation/DropdownIndicator';
import filterCategories from './filterCategories';
import ProjectList from '../../components/projectList/ProjectList';
import Pagination from '../../components/pagination/Pagination';
import { Link } from 'react-router-dom';
import { canFetch, gaEvent, getLatestVersion } from '../../helpers';
import offerImage from '../../assets/images/connections/funding.svg';
import pitchImage from '../../assets/images/connections/projects.svg';

const Projects = props => {
  const {
    isFunding,
    searchPitchesState,
    searchPitches,
    searchOffers,
    searchOffersState,
    filters,
    setFilters,
    getOffers,
    getPitches,
    offersState,
    pitchesState,
    meState,
    page,
    setPage,
    clearState,
    organisationState,
    clearFilters,
    clearSearch
  } = props;

  const searchState = isFunding ? searchOffersState : searchPitchesState;
  const search = isFunding ? searchOffers : searchPitches;

  const getProjectsState = isFunding ? pitchesState : offersState;
  const getProjects = isFunding ? getPitches : getOffers;

  const [ selectedProject, setSelectedProject ] = useState(null);
  const [ organisationType, setOrganisationType ] = useState(null);
  const [ searchResults, setSearchResults ] = useState([]);
  const [ sidebarOpen, setSidebarOpen ] = useState(false);

  const { t } = useTranslation();

  // Reset the search state and clear matches.
  // This triggers the search to be called again.
  const clearProjectSearch = () => {
    if (!searchState.isFetching) {
      setSearchResults([]);
      clearSearch();
    }
  };

  useEffect(() => {
    setSelectedProject(null);
    clearState();
  }, [props.location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Get organisation and set the type.
  useEffect(() => {
    if (organisationState.data) {
      getLatestVersion(organisationState);
      setOrganisationType(getLatestVersion(organisationState).data.category);
    }
  }, [meState, organisationState, setOrganisationType]);

  // Search projects.
  useEffect(() => {
    if (canFetch(searchState)) {
      search();
    }
  }, [searchState]); // eslint-disable-line react-hooks/exhaustive-deps

  // Get organisation projects.
  useEffect(() => {
    if (canFetch(getProjectsState)) {
      getProjects(meState.data.organisation_id);
    }
  }, [getProjectsState, meState, getProjects]);

  // On filter, page change
  useEffect(() => {
    clearProjectSearch();
  }, [page, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const onPageChange = number => {
    setPage(number);
  };

  const hasFiltersSelected = useCallback(() => {
    const attributes = Object.keys(filters);
    let res = false;
    attributes.forEach(attribute => {
      if (!res && filters[attribute].length > 0) {
        res = true;
      }
    });
    return res;
  }, [filters]);

  const hasFiltersOrProjectSelected = useCallback(() => {
    return hasFiltersSelected() || selectedProject;
  }, [hasFiltersSelected, selectedProject]);

  useEffect(() => {
    if (searchState.data !== null) {
      setSearchResults(searchState.data);
    }
  }, [searchState]);

  const setFiltersFromDropdown = project => {
    if (project === null) {
      clearFilters();
      setSelectedProject(null);
      return;
    }

    const projectToFilter = getProjectsState.data[project.key];
    // handle UI change for dropdown
    setSelectedProject(project);
    const validCategories = filterCategories.map(cat => cat.modelKey);

    const keys = Object.keys(projectToFilter);
    const newFilters = {...filters};

    keys.filter(key => validCategories.includes(key))
    .forEach(key => {
      // API returns some project attributes as flat strings
      // For consistency across the filtering state tree, we add them to an array
      let projectFilter = Array.isArray(projectToFilter[key]) ? projectToFilter[key] : [projectToFilter[key]];
      if (key === 'price_per_tree') {
        // Should remain out of an array.
        projectFilter = projectToFilter[key];
      }

      newFilters[key] = projectFilter;
    });

    setFilters(newFilters);
  };

  const h1Text = isFunding ? t('projects.exploreFunding') : t('projects.explorePitches');

  return (
    <article className="c-pitches">
      <aside className={`c-sidebar c-pitches__sidebar u-background-light-grey ${sidebarOpen ? 'c-pitches__sidebar--open' : ''}`}>
        <button onClick={() => {setSidebarOpen(false)}}
         className="c-close-button c-sidebar__close"
         aria-label={t('common.close')}>
          <div role="presentation" className="c-icon c-icon--chevron-black" />
        </button>
        {
          (getProjectsState.data && getProjectsState.data.length) ?
          <>
            <Select
                onChange={data => setFiltersFromDropdown(data)}
              options={getProjectsState.data.map((offer, index) => {return { key: index, label: offer.name}})}
              classNamePrefix='c-project-select'
              components={{ DropdownIndicator }}
              isSearchable={false}
              isClearable
            />
          {hasFiltersSelected() &&
            <Button
              className="u-width-100 u-margin-bottom-large c-button--outline"
              click={() => {
                clearFilters();
                setSelectedProject(null);
              }}>
              {t('projects.clearFilters')}
            </Button>
          }
          <div className="c-facet-separator u-margin-vertical-small" />
          </> : null
        }
        { getProjectsState.data &&
          <FilterSections
            filterCategories={filterCategories}
            filters={filters}
            setFilters={setFilters}
            projectType={isFunding ? 'offer' : 'pitch'}
          />
        }

      </aside>
      <div className="c-pitches__content">
        <section className="c-section c-section--standard-width">
          <div className="u-flex u-flex--space-between u-flex--break-md u-flex--centered">
            <h1 className="u-text-uppercase u-margin-bottom-none">
              { h1Text }
            </h1>
            { (organisationType === 'developer' || organisationType === 'both') && !isFunding  &&
              <Link className="c-button c-button--is-link u-text-center"
                    to={'/createProject'}
                    onClick={() => {gaEvent({category: 'Project', action: 'User clicked on "Add new project"'})}}
                    >
                    {t('createPitch.addNewPitch')}
              </Link>
            }
            { (organisationType === 'funder' || organisationType === 'both') && isFunding &&
              <Link className="c-button c-button--is-link u-text-center"
                to={'/createOffer'}
                onClick={() => {gaEvent({category: 'Project', action: 'User clicked on "Add new funding offer"'})}}>
                {t('createOffer.addNewPitch')}
              </Link>
            }
          </div>
          <SelectedFilterList projectType={isFunding ? 'offer' : 'pitch'}/>
          <Button click={() => {setSidebarOpen(true)}} variant="outline" className="c-button--small c-pitches__open-filters">
            {t('filters.selectFilters')}
          </Button>
          <div className="u-flex u-flex--space-between u-flex--baseline u-flex--break-md">
            <SortByDropdown
              showCompatibility={hasFiltersOrProjectSelected()}
              projectType={isFunding ? 'funding' : 'pitch'}
            />
          </div>
        </section>

        <section className="c-section c-section--standard-width">
          <ProjectList
            isLoading={searchState.isFetching || !searchState.data}
            projects={searchResults || []}
            projectType={isFunding ? 'funding' : 'pitch'}
            hideCompatibility={!hasFiltersOrProjectSelected()}
            linkParams={selectedProject && getProjectsState.data ? `compareProjectId=${getProjectsState.data[selectedProject.key].id}` : ''}
          />
        {(!searchState.isFetching && searchState.data && searchState.data.length > 0) &&
            <div className="u-margin-top-large">
              <Pagination
                currentPage={page}
                numPages={searchState.pagination.last}
                hasPreviousPage={page !== 1}
                hasNextPage={page !== searchState.pagination.last}
                setPage={page => onPageChange(page)}
              />
            </div>
          }
        {searchState.data && searchState.data.length === 0 &&
          <div className="u-text-center u-margin-top-large">
            <img src={isFunding ? offerImage : pitchImage} alt="" role="presentation" className="c-pitches__empty-image"/>
            <p className="u-font-medium">{isFunding ? t('offer.noProjects') : t('projects.noProjects')}</p>
          </div>
        }
        </section>
      </div>
    </article>
  );
};

Projects.propTypes = {
  isFunding: PropTypes.bool
};

Projects.defaultProps = {
  isFunding: false
};

export default Projects;
