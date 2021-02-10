import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormWalkthrough from '../../../components/formWalkthrough/FormWalkthrough';
import { steps } from './AddDocumentAwardsSteps';
import { initialAsyncStatePropType } from '../../../redux/asyncActionReducer';
import { Prompt } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const AddDocumentAwards = (props) => {
  const { t } = useTranslation();
  const [ isSuccess, setIsSuccess ] = useState(false);
  const { createDocumentAwardsState,
          createDocumentAwards,
          successOverrideFunction,
          cancelOverrideFunction
        } = props;

  const getRequestArray = (docsAwards, type) => {
    return docsAwards.map((doc) => {
      return {
        document: doc.id,
        type,
        name: doc.name
      }
    })
  };

  useEffect(() => {
    // Enable navigation prompt
    window.onbeforeunload = function() {
        return true;
    };

    return () => {
      // Remove navigation prompt
      window.onbeforeunload = null;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    const { docs, awards } = value;
    // Get array of docs.
    const docArray = docs ? getRequestArray(docs, 'legal') : [];
    const awardArray = awards ? getRequestArray(awards, 'award') : [];
    const allDocs = [...docArray, ...awardArray];

    if (allDocs.length > 0) {
      createDocumentAwards([...docArray, ...awardArray]);
    } else if (successOverrideFunction) {
      successOverrideFunction()
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
      <Prompt
        when={!isSuccess}
        message={t('common.changesNotSaved')}
      />
      <FormWalkthrough
        steps={steps}
        onSubmit={onSubmit}
        errors={[]}
        successOptions={successOptions}
        isFetching={createDocumentAwardsState.isFetching}
        isSuccess={isSuccess}
        onCancel={cancelOverrideFunction}
      />
    </section>
  )
};

AddDocumentAwards.propTypes =  {
  createDocumentAwardsState: initialAsyncStatePropType.isRequired,
  createDocumentAwards: PropTypes.func.isRequired
};

export default AddDocumentAwards;
