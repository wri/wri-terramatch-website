import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { Collapse } from 'react-collapse';
import { Button, Modal, Loader } from 'tsc-chameleon-component-library';
import { getMappedVersionedArray, getResponseErrors, numberOnlyKeyDown } from '../../helpers';
import AddTreeSpecies from '../addTreeSpecies/AddTreeSpeciesContainer';
import TwoCol from '../pitch/TwoCol';
import TwoColItem from '../pitch/TwoColItem';

import FormInput from '../formInput/FormInput';
import FormTypes from '../formInput/FormInputTypes';

const getTotalPrice = (tree) => {
    return (
        (parseFloat(tree.price_to_plant, 10) || 0) +
        (parseFloat(tree.price_to_maintain, 10) || 0) +
        (parseFloat(tree.site_prep, 10) || 0) +
        (parseFloat(tree.saplings, 10) || 0))
}

const TreeSpecie = ({tree}) => {
    const { t } = useTranslation();
    const [ isOpen, setIsOpen ] = useState(false);

    return(
        <div className="u-margin-bottom-small">
            <div className="u-flex u-flex--space-between c-tree-species__dropdown">
                <h3 className="c-tree-species__header-text">{tree.name}</h3>
                <div
                    role="button"
                    aria-label={t('common.open')}
                    onClick={() => {setIsOpen(!isOpen)}}
                    onKeyDown={() => {setIsOpen(!isOpen)}}
                    tabIndex="0"
                    className={`c-tree-species__collapse-button ${isOpen ? 'c-tree-species__collapse-button--open' : ''}`}>
                    <div
                    role="presentation"
                    className="c-icon c-icon--chevron-black"
                    />
                </div>
            </div>
            <Collapse isOpened={isOpen}>

                <TwoCol>
                        <TwoColItem title={t('project.treeSpecies.numberOfTrees')} value={tree.count} />
                </TwoCol>
                <h3 className="c-stats__subheader u-text-uppercase">{t('project.treeSpecies.details', { name: tree.name })}</h3>
                <TwoCol>
                    <TwoColItem title={t('project.treeSpecies.saplings')} value={parseFloat(tree.saplings).toFixed(2)} />
                    <TwoColItem title={t('project.treeSpecies.priceToPlant')} value={parseFloat(tree.price_to_plant).toFixed(2)} />
                    <TwoColItem title={t('project.treeSpecies.priceToMaintain')} value={parseFloat(tree.price_to_maintain).toFixed(2)} />
                    <TwoColItem title={t('project.treeSpecies.sitePrep')} value={parseFloat(tree.site_prep).toFixed(2)} />
                    <TwoColItem title={t('project.treeSpecies.overallPrice')} value={getTotalPrice(tree).toFixed(2)} />
                    <TwoColItem title={t('project.treeSpecies.survivalRate')} value={tree.survival_rate} />
                    <TwoColItem title={t('project.treeSpecies.producesFood')} value={tree.produces_food} />
                    <TwoColItem title={t('project.treeSpecies.producesTimber')} value={tree.produces_timber} />
                    <TwoColItem title={t('project.treeSpecies.producesFirewood')} value={tree.produces_firewood} />
                    {
                        (tree.owner) &&
                        <TwoColItem title={t('project.treeSpecies.owner')} value={tree.owner} />
                    }

                    <TwoColItem title={t('project.treeSpecies.native')} value={tree.is_native} />
                    <TwoColItem title={t('project.treeSpecies.season')} value={tree.season} />
                </TwoCol>
            </Collapse>
        </div>
    )
}

const EditTreeSpecies = (props) => {

    const {
        model,
        setModel,
        updateState,
        onDeleteClick
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
            case "produces_food":
            case "produces_firewood":
            case "produces_timber":
                model[field] = e.currentTarget.checked;
            break;
            default:
                model[field] = e.currentTarget.value;
            break;
        }
        setModel(model);
    }

    return (
        <div className="u-flex u-flex--column u-margin-bottom-large">
            <FormInput
                id="name"
                label={t("createPitch.details.treeSpecies.name")}
                type={FormTypes.text}
                showLabel
                value={model.name}
                onChange={(e) => valueChange(e, 'name')}
                errors={errors['name']}
                required
                className="u-margin-vertical-tiny"
                maxLength={255}
            />
            <FormInput
                id="count"
                label={t("createPitch.details.treeSpecies.count")}
                type={FormTypes.number}
                showLabel
                value={model.count}
                onChange={(e) => valueChange(e, 'count')}
                errors={errors['count']}
                required
                onKeyDown={numberOnlyKeyDown}
                min="1"
                className="u-margin-vertical-tiny"
            />
            <FormInput
                id="price_to_plant"
                label={t("createPitch.details.treeSpecies.priceToPlant")}
                type={FormTypes.number}
                showLabel
                value={model.price_to_plant}
                onChange={(e) => valueChange(e, 'price_to_plant')}
                errors={errors['price_to_plant']}
                required
                onKeyDown={numberOnlyKeyDown}
                step="0.01"
                min="0"
                className="u-margin-vertical-tiny"
            />
            <FormInput
                id="saplings"
                label={t("createPitch.details.treeSpecies.saplings")}
                type={FormTypes.number}
                showLabel
                value={model.saplings}
                onChange={(e) => valueChange(e, 'saplings')}
                errors={errors['saplings']}
                required
                onKeyDown={numberOnlyKeyDown}
                step="0.01"
                min="0"
                className="u-margin-vertical-tiny"
            />
            <FormInput
                id="price_to_maintain"
                label={t("createPitch.details.treeSpecies.priceToMaintain")}
                type={FormTypes.number}
                showLabel
                value={model.price_to_maintain}
                onChange={(e) => valueChange(e, 'price_to_maintain')}
                errors={errors['price_to_maintain']}
                required
                onKeyDown={numberOnlyKeyDown}
                step="0.01"
                min="0"
                className="u-margin-vertical-tiny"
            />
            <FormInput
                id="site_prep"
                label={t("createPitch.details.treeSpecies.sitePrep")}
                type={FormTypes.number}
                showLabel
                value={model.site_prep}
                onChange={(e) => valueChange(e, 'site_prep')}
                errors={errors['site_prep']}
                required
                onKeyDown={numberOnlyKeyDown}
                step="0.01"
                min="0"
                className="u-margin-vertical-tiny"
            />
            <FormInput
                id="total_price_per_tree"
                label={t("createPitch.details.treeSpecies.totalPricePerTree")}
                type={FormTypes.number}
                showLabel
                value={getTotalPrice(model)}
                disabled
                className="u-margin-vertical-tiny"
            />
            <FormInput
                id="survival_rate"
                label={t("createPitch.details.treeSpecies.survivalRate")}
                type={FormTypes.number}
                showLabel
                value={model.survival_rate}
                onChange={(e) => valueChange(e, 'survival_rate')}
                errors={errors['survival_rate']}
                onKeyDown={numberOnlyKeyDown}
                min="0"
                className="u-margin-vertical-tiny"
            />
            <FormInput
                id="produces_food"
                label={t("createPitch.details.treeSpecies.produces_food")}
                type={FormTypes.checkbox}
                showLabel
                value={model.produces_food}
                onChange={(e) => valueChange(e, 'produces_food')}
                errors={errors['produces_food']}
                className="u-margin-vertical-tiny"
            />
            <FormInput
                id="produces_firewood"
                label={t("createPitch.details.treeSpecies.produces_firewood")}
                type={FormTypes.checkbox}
                showLabel
                value={model.produces_firewood}
                onChange={(e) => valueChange(e, 'produces_firewood')}
                errors={errors['produces_firewood']}
                className="u-margin-vertical-tiny"
            />

            <FormInput
                id="produces_timber"
                label={t("createPitch.details.treeSpecies.produces_timber")}
                type={FormTypes.checkbox}
                showLabel
                value={model.produces_timber}
                onChange={(e) => valueChange(e, 'produces_timber')}
                errors={errors['produces_timber']}
                className="u-margin-vertical-tiny"
            />

            <FormInput
                id="owner"
                label={t("createPitch.details.treeSpecies.owner")}
                type={FormTypes.text}
                translate
                showLabel
                value={model.owner}
                hidden={
                    !model.produces_firewood &&
                    !model.produces_timber &&
                    !model.produces_food
                }
                onChange={(e) => valueChange(e, 'owner')}
                errors={errors['owner']}
                className="u-margin-vertical-tiny"
                maxLength={255}
            />

            <FormInput
                id="season"
                label={t("createPitch.details.treeSpecies.season")}
                type={FormTypes.text}
                showLabel
                value={model.season}
                onChange={(e) => valueChange(e, 'season')}
                errors={errors['season']}
                className="u-margin-vertical-tiny"
                maxLength={255}
            />
            <Button className="c-button--tiny has-icon has-icon--cross-right u-margin-bottom-small u-flex--align-self-flex-end"
                variant="danger"
                click={() => onDeleteClick(model.id)}>
                {t('common.delete')}
            </Button>
        </div>
    )
}

const TreeSpecies = (props) => {

    const {
        treeSpeciesEditState,
        setTreeSpeciesEdit,
        updateTreeSpeciesEdit,
        getTreeSpecies,
        getTreeSpeciesInspect,
        treeSpeciesState,
        treeSpeciesInspectState,
        updateTreeSpeciesState,
        deleteTreeSpecies,
        deleteTreeSpeciesState,
        clearDeleteTreeSpecies,
        meState,
        isEditing,
        pitchId,
        orgId
    } = props;


    const { t } = useTranslation();
    const [ speciesToDelete, setSpeciesToDelete ] = useState(null);
    const [ addNew, setAddNew ] = useState(false);

    useEffect(() => {
        if (meState.data.organisation_id === orgId || meState.data.role === 'admin') {
            getTreeSpeciesInspect(pitchId)
        } else {
            getTreeSpecies(pitchId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        if (treeSpeciesInspectState.data) {
            setTreeSpeciesEdit(getMappedVersionedArray(treeSpeciesInspectState).data)
        }
    }, [treeSpeciesInspectState, meState, orgId, setTreeSpeciesEdit]);

    useEffect(() => {
        if (treeSpeciesState.data) {
            setTreeSpeciesEdit(treeSpeciesState.data);
        }
    }, [treeSpeciesState, setTreeSpeciesEdit]);

    useEffect(() => {
        if (!deleteTreeSpeciesState.isFetching &&
            deleteTreeSpeciesState.data &&
            !deleteTreeSpeciesState.error &&
            deleteTreeSpeciesState.lastSuccessTime > 0) {
                setSpeciesToDelete(null);
                clearDeleteTreeSpecies();
                getTreeSpeciesInspect(pitchId);
        }
    }, [clearDeleteTreeSpecies, deleteTreeSpeciesState, deleteTreeSpeciesState.lastSuccessTime, getTreeSpeciesInspect, pitchId]);

    const onDeleteConfirm = () => {
        deleteTreeSpecies(speciesToDelete);
    }

    const isFetching = getTreeSpecies.isFetching || getTreeSpeciesInspect.isFetching;

    if (isFetching) {
        return (
            <div className="c-stats__row">
                <Loader />
            </div>
        );
    }

    if (isEditing) {
        return (
            <>
                {speciesToDelete &&
                    <Modal show close={() => setSpeciesToDelete(null)}>
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
                    <AddTreeSpecies
                        pitchId={pitchId}
                        cancelOverrideFunction={() => setAddNew(false)}
                        successOverrideFunction={() => {
                            getTreeSpeciesInspect(pitchId);
                            setAddNew(false);
                    }}/>
                }
                <div className="c-stats__row u-flex--break-md">
                    <h2 className="u-text-uppercase u-text-bold c-stats__row__title">
                        {t('project.treeSpecies.title')}
                    </h2>
                    <div className="c-stats__row__content">
                        { treeSpeciesEditState.map(species => (
                            <EditTreeSpecies model={species}
                                updateState={updateTreeSpeciesState}
                                setModel={(model) => updateTreeSpeciesEdit(model)}
                                onDeleteClick={(id) => {
                                    setSpeciesToDelete(id);
                                }}
                                key={species.name}
                                />
                        ))}
                        <div className="c-section c-section--thin-width u-text-center">
                            <Button variant="outline" click={() => setAddNew(true)}>{t('createPitch.details.treeSpecies.add')}</Button>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    if (treeSpeciesEditState.length > 0) {
      return (
        <div className="c-stats__row u-flex--break-md">
            <h2 className="u-text-uppercase u-text-bold c-stats__row__title">
                {t('project.treeSpecies.title')}
            </h2>
            <div className="c-stats__row__content">
                { treeSpeciesEditState.map(tree => (<TreeSpecie tree={tree} key={tree.id} />)) }
            </div>
        </div>
      )
    } else {
      return <></>;
    }
}

export default TreeSpecies;
