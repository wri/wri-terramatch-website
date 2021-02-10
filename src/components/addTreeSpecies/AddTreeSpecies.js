import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import FormWalkthrough from '../formWalkthrough/FormWalkthrough';
import { getArrayOfTreeSpecies} from '../../helpers';
import { getSteps } from './steps';
import { useTranslation } from 'react-i18next';

const AddTreeSpecies = (props) => {

    const {
        createTreeSpeciesState,
        createTreeSpecies,
        clearCreateTreeSpecies,
        cancelOverrideFunction,
        successOverrideFunction,
        pitchId
    } = props;

    const { t } = useTranslation();

    useEffect(() => {
        if (createTreeSpeciesState.lastSuccessTime > 0) {
            clearCreateTreeSpecies();
            successOverrideFunction();
        }
    }, [clearCreateTreeSpecies, createTreeSpeciesState.lastSuccessTime, successOverrideFunction]);

    const onFormSubmit = (model) => {
        const array = getArrayOfTreeSpecies(model);
        createTreeSpecies(array, pitchId);
    }

    return (
        <section className="u-whole-page u-flex u-flex--centered u-flex--justify-centered">
            <FormWalkthrough
                steps={getSteps(t)}
                fullPage={true}
                onCancel={cancelOverrideFunction}
                onSubmit={onFormSubmit}
                errors={[]}
            />
        </section>
    );
}

AddTreeSpecies.propTypes = {
    pitchId: PropTypes.number.isRequired
}

export default AddTreeSpecies;