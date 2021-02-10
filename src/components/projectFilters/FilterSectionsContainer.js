import { connect } from 'react-redux';
import { sortClearSearch } from '../../redux/modules/sort';
import FilterSection from './FilterSections';

const mapStateToProps = ({ filters }) => ({
  filters: filters
});

const mapDispatchToProps = dispatch => {
  return {
    sortClearSearch: () => {
      dispatch(sortClearSearch());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterSection);
