import { connect } from 'react-redux';
import { createDraft, clearCreateDraft, updateDraft, clearUpdateDraft, clearPublishDraft, publishDraft } from '../../redux/modules/drafts';
import { clearUploadPitchCoverPhoto } from '../../redux/modules/pitch';

import CreateOffer from './CreateOffer';

const mapStateToProps = ({ pitch, drafts }) => ({
  uploadCoverState: pitch.uploadPitchCover,
  createDraftState: drafts.createDraft,
  updateDraftState: drafts.updateDraft,
  publishDraftState: drafts.publishDraft
});

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchMethod: (method, attributes) => {
      dispatch(method(attributes));
    },
    createDraft: (model) => {
      dispatch(createDraft(model));
    },
    updateDraft: (id, changes) => {
      dispatch(updateDraft(id, changes));
    },
    clearUpdateDraft: () => {
      dispatch(clearUpdateDraft());
    },
    publishDraft: (id) => {
      dispatch(publishDraft(id));
    },
    clearState: () => {
      dispatch(clearCreateDraft());
      dispatch(clearUpdateDraft());
      dispatch(clearPublishDraft());
      dispatch(clearUploadPitchCoverPhoto());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateOffer);
