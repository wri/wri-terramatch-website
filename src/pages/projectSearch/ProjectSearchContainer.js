import { connect } from 'react-redux';
import ProjectSearch from './ProjectSearch';
import { getPitches, clearGetPitches, getOrganisationPitches, clearGetOrganisationPitches } from '../../redux/modules/pitch';
import { setFilters, clearFilters } from '../../redux/modules/filters';
import { setSortDirection, setSortAttribute, setPage, sortClear, sortClearSearch } from '../../redux/modules/sort';
import { getOrganisationOffers, clearGetOrganisationOffers, getOffers, clearGetOffers } from '../../redux/modules/offer';
import { debounce } from '../../helpers'

const mapStateToProps = ({ pitch, filters, sort, auth, offer, organisations }) =>
{
  return ({
    filters,
    searchPitchesState: pitch.getPitches,
    offersState: offer.getOrganisationOffers,
    pitchesState: pitch.getOrganisationPitches,
    searchOffersState: offer.getOffers,
    sortDirection: sort.sortDirection,
    sortAttribute: sort.sortAttribute,
    page: sort.page,
    meState: auth.me,
    organisationState: organisations.getOrganisationVersionsNavBar
  });
}

const mapDispatchToProps = dispatch => {
  return {
    setFilters: filters => {
      dispatch(sortClearSearch());
      dispatch(setFilters(filters));
    },
    setSortDirection: (direction) => dispatch(setSortDirection(direction)),
    setSortAttribute: (attribute) => dispatch(setSortAttribute(attribute)),
    setPage: (page) => dispatch(setPage(page)),
    searchPitches: debounce(() => dispatch(getPitches()), 1000),
    getOffers: (id) => dispatch(getOrganisationOffers(id)),
    getPitches: (id) => dispatch(getOrganisationPitches(id)),
    searchOffers: debounce(() => dispatch(getOffers()), 1000),
    clearFilters: () => dispatch(clearFilters()),
    clearSearch: () => {
      dispatch(clearGetPitches());
      dispatch(clearGetOffers());
    },
    clearState: () => {
      dispatch(clearGetPitches());
      dispatch(clearGetOrganisationOffers());
      dispatch(clearGetOffers());
      dispatch(clearGetOrganisationPitches());
      dispatch(sortClear());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSearch);
