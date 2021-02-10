import { connect } from 'react-redux'
import Documents from './Documents';

import {
  getDocumentsInspect,
  clearCreateDocumentAwards
} from '../../redux/modules/documentAwards';

import { removeOrganisationDocument,
         clearRemoveOrganisationDocument } from '../../redux/modules/documentAwards';

const mapStateToProps = ({ documentAwards }) => ({
  removeDocumentState: documentAwards.removeOrganisationDocument
});

const mapDispatchToProps = (dispatch) => {
  return {
    removeDocument: (id) => {
      dispatch(removeOrganisationDocument(id));
    },
    clearRemoveDocument: () => {
      dispatch(clearRemoveOrganisationDocument());
    },
    clearCreateDocumentAwards: () => {
      dispatch(clearCreateDocumentAwards());
    },
    getDocumentsInspect: (organisationId) => {
      dispatch(getDocumentsInspect(organisationId));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Documents);
