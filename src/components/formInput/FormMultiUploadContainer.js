import { connect } from 'react-redux'
import FormMultiUploadContainer from './FormMultiUpload';
import { upload, clearUpload } from '../../redux/modules/upload';

const mapStateToProps = ({ upload }) => ({
  uploadState: upload.upload
});

const mapDispatchToProps = (dispatch) => {
  return {
    upload: (attributes)  => {
      dispatch(upload(attributes));
    },
    clearUpload: () => {
      dispatch(clearUpload());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormMultiUploadContainer);
