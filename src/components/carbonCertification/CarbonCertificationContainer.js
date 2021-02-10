import { connect } from 'react-redux';
import CarbonCertification from './CarbonCertification';
import { getCarbonCertifications,
    getCarbonCertificationsInspect,
    clearGetCarbonCertifications,
    clearGetCarbonCertificationsInspect,
    deleteCarbonCertificate,
    clearDeleteCarbonCertificate
  } from '../../redux/modules/carbonCertifications';

import { setCarbonCerts, updateCarbonCert } from '../../redux/modules/editPitch';

const mapStateToProps = ({ carbonCertifications, auth, editPitch }) => ({
    carbonCertificationsState: carbonCertifications.getCarbonCertifications,
    carbonCertificationsInspectState: carbonCertifications.getCarbonCertificationsInspect,
    updateCarbonCertificationsState: carbonCertifications.patchCarbonCertificates,
    deleteCarbonCertificationState: carbonCertifications.deleteCarbonCertificate,
    carbonCertsEditState: editPitch.carbonCertificates,
    meState: auth.me
});

const mapDispatchToProps = (dispatch) => {
    return {
        getCarbonCertifications: (pitchId) => {
            dispatch(getCarbonCertifications(pitchId))
        },
        getCarbonCertificationsInspect: (pitchId) => {
            dispatch(getCarbonCertificationsInspect(pitchId));
        },
        deleteCarbonCertification: (certId) => {
            dispatch(deleteCarbonCertificate(certId));
        },
        clearDeleteCertification: () => {
            dispatch(clearDeleteCarbonCertificate());
        },
        setCarbonCertsEdit: (carbonCerts) => {
            dispatch(setCarbonCerts(carbonCerts));
        },
        updateCarbonCertEdit: (newCert) => {
            dispatch(updateCarbonCert(newCert));
        },
        clearState: () => {
            dispatch(clearGetCarbonCertifications());
            dispatch(clearGetCarbonCertificationsInspect());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CarbonCertification);