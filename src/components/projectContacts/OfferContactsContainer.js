import { connect } from 'react-redux';
import ProjectContacts from './ProjectContacts';
import { getOfferContacts, 
    createOfferContacts, deleteOfferContact,
    clearGetOfferContacts,clearCreateOfferContacts, clearDeleteOfferContact } from '../../redux/modules/offer';
import { getTeamMembers, clearTeamMembers } from '../../redux/modules/teamMembers';

const mapStateToProps = ({ offer, teamMembers }) => ({
    deleteContactState: offer.deleteOfferContact,
    createContactState: offer.createOfferContacts,
    contacts: offer.getOfferContacts,
    teamMembers: teamMembers.getTeamMembers,
});

const mapDispatchToProps = (dispatch) => {
    return {
        getContacts: (offerId) => { 
            dispatch(getOfferContacts(offerId));
        },
        createContacts: (teamMembers, offerId) => {
            dispatch(createOfferContacts(teamMembers, offerId));
        },
        getTeamMembers: (orgId) => {
            dispatch(getTeamMembers(orgId));
        },
        deleteContact: (contactId) => {
            dispatch(deleteOfferContact(contactId));
        },
        clearCreateContacts: () => {
            dispatch(clearCreateOfferContacts());
        },
        clearDeleteContact: () => {
            dispatch(clearDeleteOfferContact());
        },
        clearState: () => {
            dispatch(clearCreateOfferContacts());
            dispatch(clearDeleteOfferContact());
            dispatch(clearTeamMembers());
            dispatch(clearGetOfferContacts());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectContacts);