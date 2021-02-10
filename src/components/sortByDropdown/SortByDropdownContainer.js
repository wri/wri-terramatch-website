import { connect } from 'react-redux';
import { getPitches } from '../../redux/modules/pitch';
import { getOffers } from '../../redux/modules/offer';
import { setSortAttribute, setSortDirection } from '../../redux/modules/sort';
import SortByDropdown from './SortByDropdown';

const mapStateToProps = ({ sort }) => ({
  sortAttribute: sort.sortAttribute,
  sortDirection: sort.sortDirection
});

const mapDispatchToProps = dispatch => {
  return {
    setSortAttribute: sortValue => dispatch(setSortAttribute(sortValue)),
    setSortDirection: sortDirection => dispatch(setSortDirection(sortDirection)),
    getOffers: () => dispatch(getOffers()),
    getPitches: () => dispatch(getPitches())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SortByDropdown);
