import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import FormWalkthrough from '../formWalkthrough/FormWalkthrough';
import steps from './steps';

const AddCarbonCertifications = (props) => {

    const {
        createCarbonCertificationsState,
        createCarbonCertifications,
        clearCreateCarbonCertifications,
        cancelOverrideFunction,
        successOverrideFunction,
        pitchId
    } = props;


    useEffect(() => {
        if (createCarbonCertificationsState.lastSuccessTime > 0) {
            clearCreateCarbonCertifications();
            successOverrideFunction();
        }
    }, [clearCreateCarbonCertifications, createCarbonCertificationsState.lastSuccessTime, successOverrideFunction]);

    const onFormSubmit = (model) => {
        createCarbonCertifications([model], pitchId);
    }

    return (
        <section className="u-whole-page u-flex u-flex--centered u-flex--justify-centered">
            <FormWalkthrough
                steps={steps}
                fullPage={true}
                onCancel={cancelOverrideFunction}
                onSubmit={onFormSubmit}
                errors={[]}
            />
        </section>
    );
}

AddCarbonCertifications.propTypes = {
    pitchId: PropTypes.number.isRequired
}

export default AddCarbonCertifications;