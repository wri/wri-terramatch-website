import { connect } from 'react-redux';
import TreeSpecies from './TreeSpecies';
import { getTreeSpecies,
    getTreeSpeciesInspect,
    clearGetTreeSpecies,
    clearGetTreeSpeciesInspect,
    deleteTreeSpecies,
    clearDeleteTreeSpecies
} from '../../redux/modules/treeSpecies';

import { setTreeSpecies, updateTreeSpecies } from '../../redux/modules/editPitch';

const mapStateToProps = ({ auth, editPitch, treeSpecies }) => ({
    treeSpeciesState: treeSpecies.getTreeSpecies,
    treeSpeciesInspectState: treeSpecies.getTreeSpeciesInspect,
    updateTreeSpeciesState: treeSpecies.patchTreeSpecies,
    deleteTreeSpeciesState: treeSpecies.deleteTreeSpecies,
    treeSpeciesEditState: editPitch.treeSpecies,
    meState: auth.me,
});

const mapDispatchToProps = (dispatch) => {
    return {
        getTreeSpecies: (pitchId) => {
            dispatch(getTreeSpecies(pitchId));
        },
        getTreeSpeciesInspect: (pitchId) => {
            dispatch(getTreeSpeciesInspect(pitchId));
        },
        deleteTreeSpecies: (treeId) => {
            dispatch(deleteTreeSpecies(treeId));
        },
        setTreeSpeciesEdit: (treeSpecies) => {
            dispatch(setTreeSpecies(treeSpecies));
        },
        updateTreeSpeciesEdit: (newSpecies) => {
            dispatch(updateTreeSpecies(newSpecies));
        },
        clearState: () => {
            dispatch(clearGetTreeSpecies());
            dispatch(clearGetTreeSpeciesInspect());
        },
        clearDeleteTreeSpecies: () => {
            dispatch(clearDeleteTreeSpecies());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TreeSpecies);