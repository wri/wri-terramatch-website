import { connect } from 'react-redux';
import AddTreeSpecies from './AddTreeSpecies';
import  { createTreeSpecies, clearCreateTreeSpecies } from '../../redux/modules/treeSpecies';

const mapStateToProps = ({ treeSpecies }) => ({
    createTreeSpeciesState: treeSpecies.createTreeSpecies
});

const mapDispatchToProps = (dispatch) => {
    return {
        createTreeSpecies: (treeArray, pitchId) => {
            dispatch(createTreeSpecies(treeArray, pitchId));
        },
        clearCreateTreeSpecies: () => {
            dispatch(clearCreateTreeSpecies());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddTreeSpecies)