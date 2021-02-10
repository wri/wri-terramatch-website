import { connect } from 'react-redux';
import ProjectContacts from './ProjectContacts';
import { getPitchContacts,
    createPitchContacts, deletePitchContact,
    clearPitchContacts,clearCreatePitchContacts, clearDeletePitchContact } from '../../redux/modules/pitch';
import { getTeamMembers, clearTeamMembers } from '../../redux/modules/teamMembers';

const mapStateToProps = ({ pitch, teamMembers }) => ({
    deleteContactState: pitch.deletePitchContact,
    createContactState: pitch.createPitchContacts,
    contacts: pitch.getPitchContacts,
    teamMembers: teamMembers.getTeamMembers,
});

const mapDispatchToProps = (dispatch) => {
    return {
        getContacts: (pitchId) => {
            dispatch(getPitchContacts(pitchId));
        },
        createContacts: (teamMembers, pitchId) => {
            dispatch(createPitchContacts(teamMembers, pitchId));
        },
        getTeamMembers: (orgId) => {
            dispatch(getTeamMembers(orgId));
        },
        deleteContact: (contactId) => {
            dispatch(deletePitchContact(contactId));
        },
        clearCreateContacts: () => {
            dispatch(clearCreatePitchContacts());
        },
        clearDeleteContact: () => {
            dispatch(clearDeletePitchContact());
        },
        clearState: () => {
            dispatch(clearCreatePitchContacts());
            dispatch(clearDeletePitchContact());
            dispatch(clearTeamMembers());
            dispatch(clearPitchContacts());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectContacts);