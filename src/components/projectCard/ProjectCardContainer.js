import { connect } from 'react-redux';
import ProjectCard from './ProjectCard';
import { getOrganisationOffers, clearGetOrganisationOffers } from '../../redux/modules/offer';
import { getOrganisationPitches, clearGetOrganisationPitches } from '../../redux/modules/pitch';

const mapStateToProps = (({offer, pitch, auth, compatibilityScore}) => (
    {
        offersState: offer.getOrganisationOffers,
        pitchesState: pitch.getOrganisationPitches,
        me: auth.me
    }
));

const mapDispatchToProps = (dispatch) => {
    return {
        getOffers: organisationId => {
            dispatch(getOrganisationOffers(organisationId));
        },
        getPitches: organisationId => {
            dispatch(getOrganisationPitches(organisationId));
        },
        clearState: () => {
            dispatch(clearGetOrganisationPitches());
            dispatch(clearGetOrganisationOffers());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCard);
