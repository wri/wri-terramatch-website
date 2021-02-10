import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { Loader, Button, Modal } from 'tsc-chameleon-component-library';
import { getMappedVersionedArray, getResponseErrors, numberOnlyKeyDown, didSend } from '../../helpers';
import AddRestorationMetrics from '../addRestorationMetric/AddRestorationMetricsContainer';
import FormInput from '../formInput/FormInput';
import FORM_TYPES from '../formInput/FormInputTypes';
import TwoCol from '../pitch/TwoCol';
import TwoColItem from '../pitch/TwoColItem';

const EditMethodMetric = (props) => {
    const {
        model,
        setModel,
        updateState,
        onDeleteClick,
        disableDelete
    } = props;

    const { t } = useTranslation();
    const [ errors, setErrors ] = useState({});

    useEffect(() => {
        if (updateState.error) {
            const id = updateState.error.response.req.url.split('/').pop();

            if (parseInt(id) === model.id) {
                const responseErrors = getResponseErrors(updateState);
                setErrors(responseErrors);
            }
        }
    }, [model, updateState]);

    const valueChange = (e, field) => {
        switch (field) {
            case "species_impacted":
                model[field] = e.value;
            break;
            default:
                model[field] = e.currentTarget.value;
            break;
        }
        setModel(model);
    };

    return (
        <div className="u-flex u-flex--column u-margin-bottom-large">
          <div className="u-flex">
            <h3 className="c-stats__subheader u-text-uppercase u-margin-top-none u-flex--grow ">
                {t(`api.restoration_methods.${model.restoration_method}`)}
            </h3>
            <Button className="c-button--tiny has-icon has-icon--cross-right u-margin-left-small"
                variant="danger"
                click={() => onDeleteClick(model)}
                disabled={disableDelete}>
                {t('common.delete')}
            </Button>
          </div>

            <FormInput
                id="experience"
                label={t("createPitch.details.restorationMethod.experience")}
                type={FORM_TYPES.number}
                showLabel
                value={model.experience}
                onChange={(e) => valueChange(e, 'experience')}
                errors={errors['experience']}
                required
                onKeyDown={numberOnlyKeyDown}
                className="u-margin-vertical-tiny"
            />

            <FormInput
                id="land_size"
                label={t("createPitch.details.restorationMethod.landSize")}
                type={FORM_TYPES.number}
                showLabel
                value={model.land_size}
                onChange={(e) => valueChange(e, 'land_size')}
                errors={errors['land_size']}
                required
                min="0"
                onKeyDown={numberOnlyKeyDown}
                className="u-margin-vertical-tiny"
            />

            <FormInput
                id="price_per_hectare"
                label={t("createPitch.details.restorationMethod.pricePerHectare")}
                type={FORM_TYPES.number}
                showLabel
                value={model.price_per_hectare}
                onChange={(e) => valueChange(e, 'price_per_hectare')}
                errors={errors['price_per_hectare']}
                required
                min="0"
                onKeyDown={numberOnlyKeyDown}
                className="u-margin-vertical-tiny"
            />

            <FormInput
                id="biomass_per_hectare"
                label={t("createPitch.details.restorationMethod.biomassPerHectare")}
                type={FORM_TYPES.number}
                showLabel
                value={model.biomass_per_hectare}
                onChange={(e) => valueChange(e, 'biomass_per_hectare')}
                errors={errors['biomass_per_hectare']}
                min="0"
                onKeyDown={numberOnlyKeyDown}
                className="u-margin-vertical-tiny"
            />

            <FormInput
                id="carbon_impact"
                label={t("createPitch.details.restorationMethod.carbonImpact")}
                type={FORM_TYPES.number}
                showLabel
                value={model.carbon_impact}
                onChange={(e) => valueChange(e, 'carbon_impact')}
                errors={errors['carbon_impact']}
                onKeyDown={numberOnlyKeyDown}
                className="u-margin-vertical-tiny"
            />

            <FormInput
                id="species_impacted"
                label={t("createPitch.details.restorationMethod.speciesImpacted")}
                help={t('createPitch.details.restorationMethod.speciesImpactedHelp')}
                helpLink="https://www.iucnredlist.org/"
                type={FORM_TYPES.multiText}
                showLabel
                value={model.species_impacted}
                onChange={(e) => valueChange(e, 'species_impacted')}
                errors={errors['species_impacted']}
                className="u-margin-vertical-tiny"
            />
        </div>
    )
}

const MethodMetric = (props) => {
    const {
        metricsEditState,
        setMetricsEdit,
        updateMetricEdit,
        updateMetricsState,
        deleteMetric,
        deleteMetricState,
        clearDeleteMetric,
        getMetrics,
        getMetricsInspect,
        metricsState,
        metricsInspectState,
        meState,
        isEditing,
        orgId,
        methods,
        pitch,
        setPitch,
        updatePitch,
        updatePitchState
    } = props;

    const { t } = useTranslation();
    const [ addNew, setAddNew ] = useState(false);
    const [ metricToDelete, setMetricToDelete ] = useState(null);
    const pitchId = pitch.id;

    useEffect(() => {
        if (meState.data.organisation_id === orgId || meState.data.role === 'admin') {
            getMetricsInspect(pitchId)
        } else {
            getMetrics(pitchId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (metricsInspectState.data) {
            setMetricsEdit(getMappedVersionedArray(metricsInspectState).data);
        }
    }, [metricsInspectState, setMetricsEdit]);

    useEffect(() => {
        if (metricsState.data) {
            setMetricsEdit(metricsState.data);
        }
    }, [metricsState, setMetricsEdit]);

    useEffect(() => {
        if (didSend(deleteMetricState) && didSend(updatePitchState)) {
          setMetricToDelete(null);
          clearDeleteMetric();
          getMetricsInspect(pitchId);
        }
    }, [clearDeleteMetric, deleteMetricState, getMetricsInspect, pitchId, updatePitchState]);

    const isFetching = getMetrics.isFetching || getMetricsInspect.isFetching;

    if (isFetching) {
        return (
            <div className="c-stats__row">
                <Loader />
            </div>
        );
    }

    const onDeleteConfirm = () => {
        pitch['restoration_methods'] = pitch['restoration_methods'].filter(item => item !== metricToDelete.restoration_method);
        updatePitch(pitch);
        deleteMetric(metricToDelete.id);
    };

    if (isEditing) {
        return (
            <>
            {metricToDelete &&
                <Modal show close={() => setMetricToDelete(null)}>
                    <div className="u-text-center">
                        <h2 className="u-margin-bottom-tiny u-margin-top-none u-font-medium u-text-uppercase">{t('createPitch.details.deleteItem')}</h2>
                        <p>{t('createPitch.details.deleteItemHelp')}</p>
                        <Button
                        className="u-margin-top-large"
                        click={onDeleteConfirm}>
                        {t('common.confirm')}
                        </Button>
                    </div>
                </Modal>
            }
            {addNew &&
                <AddRestorationMetrics
                    pitchId={pitchId}
                    methods={methods}
                    cancelOverrideFunction={() => setAddNew(false)}
                    successOverrideFunction={(metricsRes) => {
                        const method = metricsRes[0].data.restoration_method;
                        pitch['restoration_methods'].push(method);
                        setPitch(pitch)
                        updatePitch(pitch);
                        getMetricsInspect(pitchId);
                        setAddNew(false);
                }}/>
            }
            {metricsEditState.map(metric => (
                <EditMethodMetric
                    key={metric.restoration_method}
                    model={metric}
                    updateState={updateMetricsState}
                    setModel={model => updateMetricEdit(model)}
                    disableDelete={metricsEditState.length === 1}
                    onDeleteClick={(model) => {
                        setMetricToDelete(model);
                    }}
                />
            ))}
            <div className="c-section c-section--thin-width u-text-center">
                <Button variant="outline" click={() => setAddNew(true)}>{t('createPitch.details.restorationMethod.add')}</Button>
            </div>
            </>
        );
    }

      return metricsEditState.length > 0 ? metricsEditState.map(metric => (
              <div key={metric.restoration_method}>
                  <h3 className="c-stats__subheader u-text-uppercase">
                      {t(`api.restoration_methods.${metric.restoration_method}`)}
                  </h3>
                  <TwoCol>
                      <TwoColItem title={t('project.projectMetrics.experience')} value={metric.experience} />
                      <TwoColItem title={t('project.projectMetrics.landSize')} value={metric.land_size} />
                      <TwoColItem title={t('project.projectMetrics.pricePerHectare')} value={metric.price_per_hectare} />
                      <TwoColItem title={t('project.projectMetrics.carbonImpact')} value={metric.carbon_impact} capitalize={false} />
                      <TwoColItem title={t('project.projectMetrics.biomassPerHectare')} value={metric.biomass_per_hectare} />
                      <TwoColItem title={t('project.projectMetrics.biodiversityImpact')} value={metric.species_impacted.toString()} />
                  </TwoCol>
              </div>
          )
      ) : null;
};

export default MethodMetric;
