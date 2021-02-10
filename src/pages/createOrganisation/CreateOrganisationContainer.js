import { connect } from 'react-redux';
import { createOrganisation, clearCreateOrganisation } from '../../redux/modules/organisation';
import { clearCreateDocumentAwards } from '../../redux/modules/documentAwards';
import CreateOrganisation from './CreateOrganisation';

const mapStateToProps = ({ organisations }) => ({
  createOrganisationState: organisations.createOrganisation,
  uploadOrganisationAvatarState: organisations.uploadOrganisationAvatar,
  uploadOrganisationCoverState: organisations.uploadOrganisationCover
});

const mapDispatchToProps = (dispatch) => {
  return {
    createOrganisation: (model) => {
      dispatch(createOrganisation(model));
    },
    clearCreateOrganisation: () => {
      dispatch(clearCreateOrganisation());
      dispatch(clearCreateDocumentAwards());
    },
    dispatchMethod: (method, attributes) => {
      dispatch(method(attributes));
    }
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(CreateOrganisation);
