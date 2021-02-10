import { connect } from 'react-redux';
import AddCarbonCertifications from './AddCarbonCertifications';
import { createCarbonCertificates, clearCreateCarbonCertificates } from '../../redux/modules/carbonCertifications';

const mapStateToProps = ({ carbonCertifications }) => ({
    createCarbonCertificationsState: carbonCertifications.createCarbonCertificates
});

const mapDispatchToProps = (dispatch) => {
    return {
        createCarbonCertifications: (carbonArray, pitchId) => {
            dispatch(createCarbonCertificates(carbonArray, pitchId));
        },
        clearCreateCarbonCertifications: () => {
            dispatch(clearCreateCarbonCertificates());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddCarbonCertifications);