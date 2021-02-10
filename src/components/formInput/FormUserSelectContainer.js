import { connect } from 'react-redux'
import FormUserSelect from './FormUserSelect';
import { getTeamMembers, clearTeamMembers } from '../../redux/modules/teamMembers';

const mapStateToProps = ({ auth, teamMembers }) => ({
  teamMembersState: teamMembers.getTeamMembers,
  meState: auth.me
});

const mapDispatchToProps = (dispatch) => {
  return {
    getTeamMembers: (organisationId)  => {
      dispatch(getTeamMembers(organisationId));
    },
    clearState: () => {
      dispatch(clearTeamMembers());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormUserSelect);
