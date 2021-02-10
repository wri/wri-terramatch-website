import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import FormWalkthrough from '../formWalkthrough/FormWalkthrough';
import { getSteps } from './steps';

const AddRestorationMetrics = (props) => {
    const {
        createMetricsState,
        createMetrics,
        clearCreateMetrics,
        cancelOverrideFunction,
        successOverrideFunction,
        pitchId,
        methods,
        updateMetrics,
        metricsEditState,
        updateMetricsState,
        clearUpdateMetrics
    } = props;

    useEffect(() => {
        if (createMetricsState.lastSuccessTime > 0 && updateMetricsState.lastSuccessTime > 0) {
            clearCreateMetrics();
            clearUpdateMetrics();
            successOverrideFunction(createMetricsState.data);
        }
    }, [clearCreateMetrics, clearUpdateMetrics, createMetricsState, successOverrideFunction, updateMetricsState]);

    const onFormSubmit = (model) => {
      updateMetrics(metricsEditState);
      createMetrics([model], pitchId);
    };

    return (
        <section className="u-whole-page u-flex u-flex--centered u-flex--justify-centered">
            <FormWalkthrough
                steps={getSteps(methods)}
                fullPage={true}
                onCancel={cancelOverrideFunction}
                onSubmit={onFormSubmit}
                errors={[]}
            />
        </section>
    );
};

AddRestorationMetrics.propTypes = {
    pitchId: PropTypes.number.isRequired
};

export default AddRestorationMetrics;
