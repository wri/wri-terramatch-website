import { connect } from 'react-redux';
import { createPitch, clearCreatePitch, clearUploadPitchVideo, clearUploadPitchCoverPhoto } from '../../redux/modules/pitch';
import { createDraft, clearCreateDraft, updateDraft, clearUpdateDraft, clearPublishDraft, publishDraft } from '../../redux/modules/drafts';

import CreatePitch from './CreatePitch';

const mapStateToProps = ({ pitch, metrics, treeSpecies, carbonCertifications, documentAwards, drafts }) => ({
  uploadPitchCoverState: pitch.uploadPitchCover,
  uploadPitchVideoState: pitch.uploadPitchVideo,
  createPitchState: pitch.createPitch,
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
    createPitch: (model) => {
      dispatch(createPitch(model));
    },
    publishDraft: (id) => {
      dispatch(publishDraft(id));
    },
    clearUpdateDraft: () => {
      dispatch(clearUpdateDraft());
    },
    clearState: () => {
      dispatch(clearCreatePitch());
      dispatch(clearCreateDraft());
      dispatch(clearUpdateDraft());
      dispatch(clearUploadPitchVideo());
      dispatch(clearUploadPitchCoverPhoto());
      dispatch(clearPublishDraft());
    }
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(CreatePitch);
