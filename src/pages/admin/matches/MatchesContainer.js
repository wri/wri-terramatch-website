import { connect } from 'react-redux';
import Matches from './Matches';
import { getMatchTasks } from '../../../redux/modules/admin';

const mapStateToProps = ({ admin }) => ({
    matchTasksState: admin.getMatchTasks
});

const mapDispatchToProps = (dispatch) => {
    return {
        getMatchTasks: () => dispatch(getMatchTasks())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Matches);