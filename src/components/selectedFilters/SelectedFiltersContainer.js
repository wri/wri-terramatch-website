import { connect } from 'react-redux';
import { setFilters } from '../../redux/modules/filters';
import { sortClearSearch } from '../../redux/modules/sort';
import SelectedFilters from './SelectedFilters';

const mapStateToProps = ({ filters }) => ({
  filters
});

const mapDispatchToProps = dispatch => {
  return {
    setFilters: filters => {
      dispatch(sortClearSearch());
      dispatch(setFilters(filters));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectedFilters);
