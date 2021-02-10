import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormWalkthrough from '../formWalkthrough/FormWalkthrough';
import { steps } from './AddDocumentAwardsSteps';
import { initialAsyncStatePropType } from '../../redux/asyncActionReducer';

const AddDocumentAwards = (props) => {
  const [ isSuccess, setIsSuccess ] = useState(false);
  const { createDocumentAwardsState,
          createDocumentAwards,
          successOverrideFunction,
          cancelOverrideFunction,
          pitchId
        } = props;

  useEffect(() => {
    if (createDocumentAwardsState.lastSuccessTime > 0) {
      if (successOverrideFunction) {
        successOverrideFunction()
      } else {
        setIsSuccess(true);
      }
    }
  }, [createDocumentAwardsState.lastSuccessTime, successOverrideFunction]);

  const onSubmit = (value) => {
    const { docs } = value;

    if (docs.length > 0) {
      createDocumentAwards(docs, pitchId);
    } else if (successOverrideFunction) {
      successOverrideFunction();
    } else {
      setIsSuccess(true);
    }

  };

  const successOptions = {
    noPage: true,
    link: '/profile'
  };

  return (
    <section className="u-whole-page u-flex u-flex--centered u-flex--justify-centered">
      <FormWalkthrough
        steps={steps}
        onSubmit={onSubmit}
        onCancel={cancelOverrideFunction}
        errors={[]}
        successOptions={successOptions}
        isFetching={createDocumentAwardsState.isFetching}
        isSuccess={isSuccess}
      />
    </section>
  )
};

AddDocumentAwards.propTypes =  {
  createDocumentAwardsState: initialAsyncStatePropType.isRequired,
  createDocumentAwards: PropTypes.func.isRequired
};

export default AddDocumentAwards;
