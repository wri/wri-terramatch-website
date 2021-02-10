import React from "react";
import { useTranslation } from "react-i18next";
import FormInput from '../formInput/FormInput';
import FormTypes from '../formInput/FormInputTypes';

import {
    carbonFields,
    metricFields,
    projectFields,
    treeFields
} from './fields';

const StatsRow = ({ children, title }) => {
    return (
      <div className="c-stats__row">
        <h2 className="u-text-uppercase u-text-bold c-stats__row__title">
          {title}
        </h2>
        <div className="c-stats__row__content">{children}</div>
      </div>
    );
};

const EditStat = props => {
    const {
        model,
        setModel,
        errors,
        fields,
        key
    } = props;

    const { t } = useTranslation();

    const updateField = (e, field, type) => {
        let val;
        const newModel = model;

        switch(type)  {
            case FormTypes.asyncSelect:
            case FormTypes.checkboxGroup:
            case FormTypes.map:
            case FormTypes.multiText:
                val = e.value;
                newModel[field] = val;
            break;
            default:
                val = e.currentTarget.value;
                newModel[field] = val;
            break;
        }
        setModel({...newModel});
    }

    return (
        <>
            {fields.map(field =>  {
                return (
                <FormInput
                    id={`${key}-${field.id}`}
                    type={field.type}
                    label={t(field.label)}
                    showLabel={field.showLabel}
                    required={field.required}
                    onKeyDown={field.onKeyDown || null}
                    min={field.min || 0}
                    value={model[field.id]}
                    onChange={e => updateField(e, field.id, field.type)}
                    errors={errors[field.id]}
                    resource={field.resource}
                    asyncValue={field.asyncValue}
                    asyncLabel={field.asyncLabel}
                    translate={field.translate}
                    isGrid={field.isGrid}
                />
            )})}
        </>
    );
}

const EditStats = props => {
    const {
        projectState,
        setProject,
        carbonCertsState,
        setCarbonCerts,
        metricsState,
        setMetrics,
        treeSpeciesState,
        setTreeSpecies,
        errors
    } = props;

    const { t } = useTranslation();

    const setModelAtIndex = (model, index, type) => {
        switch(type) {
            case 'carbon':
                carbonCertsState[index] = model;
                setCarbonCerts([...carbonCertsState]);
            break;
            case 'metric':
                metricsState[index] = model;
                setMetrics([...metricsState]);
            break;
            case 'tree':
                treeSpeciesState[index] = model;
                setTreeSpecies([...treeSpeciesState]);
            break;
            default:
            break;
        }
    }

    return (
        <section className="c-section c-section--standard-width u-padding-top-large">
            {projectFields.map(step => {
            return (
                <StatsRow title={t(step.title)}>
                    <EditStat
                        model={projectState}
                        setModel={setProject}
                        fields={step.fields}
                        errors={errors.project}
                        key={t(step.title)}
                    />
                </StatsRow>
            )})}
            <StatsRow title={t('project.certificates.title')}>
                {carbonCertsState.map((carbon, index) => (
                    <EditStat
                        model={carbon}
                        setModel={(model) => setModelAtIndex(model, index, 'carbon')}
                        fields={carbonFields}
                        errors={errors.carbon[carbon.id] || {}}
                        key={`carbon-${index}`}
                    />
                ))}
            </StatsRow>
            <StatsRow title={t('project.projectMetrics.title')}>
                {metricsState.map((metric, index) => (
                    <EditStat
                        model={metric}
                        setModel={(model) => setModelAtIndex(model, index, 'metric')}
                        fields={metricFields}
                        errors={errors.metric[metric.id] || {}}
                        key={`metric-${index}`}
                    />
                ))}
            </StatsRow>
            <StatsRow title={t('project.treeSpecies.title')}>
                {treeSpeciesState.map((tree, index) => (
                    <EditStat
                        model={tree}
                        setModel={(model) => setModelAtIndex(model, index, 'tree')}
                        fields={treeFields}
                        errors={errors.tree[tree.id] || {}}
                        key={`tree-${index}`}
                    />
                ))}
            </StatsRow>
        </section>
    )
}

export default EditStats;
