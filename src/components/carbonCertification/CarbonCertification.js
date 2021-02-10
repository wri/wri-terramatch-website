import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Button, Modal, Loader } from 'tsc-chameleon-component-library';
import { getMappedVersionedArray, getResponseErrors } from '../../helpers';
import AddCarbonCertifications from '../addCarbonCertifications/AddCarbonCertificationContainer';
import FormInput from '../formInput/FormInput';
import FormTypes from '../formInput/FormInputTypes';
import TwoCol from '../pitch/TwoCol';
import TwoColItem from '../pitch/TwoColItem';

const EditCarbonCertification = (props) => {
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
            case 'type':
                model[field] = e.value;
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
                id="type"
                label={t("createPitch.details.carbonCerts.type")}
                type={FormTypes.asyncSelect}
                resource='/carbon_certification_types'
                asyncValue ='type'
                asyncLabel= 'api.carbon_certification_types'
                translate
                required
                showLabel
                value={model.type}
                onChange={(e) => valueChange(e, 'type')}
                errors={errors['type']}
                className="u-margin-vertical-tiny"
            />
            <FormInput
                id="other_value"
                label={t("createPitch.details.carbonCerts.other_value")}
                type={FormTypes.textarea}
                showLabel
                value={model.other_value}
                hidden={model.type !== 'other'}
                onChange={(e) => valueChange(e, 'other_value')}
                errors={errors['other_value']}
                className="u-margin-vertical-tiny"
            />
            <FormInput
                id="link"
                label={t("createPitch.details.carbonCerts.link")}
                type={FormTypes.url}
                value={model.link}
                showLabel
                translate
                onChange={(e) => valueChange(e, 'link')}
                errors={errors['link']}
                className="u-margin-vertical-tiny"
            />
            <Button className="c-button--tiny has-icon has-icon--cross-right u-margin-bottom-small u-flex--align-self-flex-end"
                variant="danger"
                click={() => onDeleteClick(model.id)}>
                {t('common.delete')}
            </Button>
        </div>
    )
}

const CarbonCertifications = (props) => {

    const {
        carbonCertsEditState,
        setCarbonCertsEdit,
        updateCarbonCertEdit,
        getCarbonCertifications,
        getCarbonCertificationsInspect,
        carbonCertificationsState,
        carbonCertificationsInspectState,
        updateCarbonCertificationsState,
        deleteCarbonCertification,
        deleteCarbonCertificationState,
        clearDeleteCertification,
        meState,
        isEditing,
        pitchId,
        orgId,
    } = props;

    const { t } = useTranslation();
    const [ certToDelete, setCertToDelete ] = useState(false);
    const [ addNew, setAddNew ] = useState(false);

    useEffect(() => {
        if (meState.data.organisation_id === orgId || meState.data.role === 'admin') {
            getCarbonCertificationsInspect(pitchId)
        } else {
            getCarbonCertifications(pitchId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        if (carbonCertificationsInspectState.data) {
            setCarbonCertsEdit(getMappedVersionedArray(carbonCertificationsInspectState).data)
        }
    }, [carbonCertificationsInspectState, setCarbonCertsEdit]);

    useEffect(() => {
        if (carbonCertificationsState.data) {
            setCarbonCertsEdit(carbonCertificationsState.data);
        }
    }, [carbonCertificationsState, setCarbonCertsEdit]);

    useEffect(() => {
        if (!deleteCarbonCertificationState.isFetching &&
            deleteCarbonCertificationState.data &&
            !deleteCarbonCertificationState.error &&
            deleteCarbonCertificationState.lastSuccessTime > 0) {
                setCertToDelete(null);
                clearDeleteCertification();
                getCarbonCertificationsInspect(pitchId);
        }
    }, [clearDeleteCertification, deleteCarbonCertificationState, getCarbonCertificationsInspect, pitchId]);


    const onDeleteConfirm = () => {
        deleteCarbonCertification(certToDelete);
    }

    const isFetching = getCarbonCertifications.isFetching || getCarbonCertificationsInspect.isFetching;

    if (isFetching) {
        return (
            <div className="c-stats__row">
                <Loader />
            </div>
        )
    }

    if (isEditing) {
        return (
            <>
                {certToDelete &&
                    <Modal show close={() => setCertToDelete(null)}>
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
                    <AddCarbonCertifications
                        pitchId={pitchId}
                        cancelOverrideFunction={() => setAddNew(false)}
                        successOverrideFunction={() => {
                            getCarbonCertificationsInspect(pitchId);
                            setAddNew(false);
                    }}/>
                }
                <div className="c-stats__row u-flex--break-md">
                    <h2 className="u-text-uppercase u-text-bold c-stats__row__title">
                        {t('project.certificates.title')}
                    </h2>
                    <div className="c-stats__row__content">
                        { carbonCertsEditState.map(cert => (
                            <EditCarbonCertification model={cert}
                                updateState={updateCarbonCertificationsState}
                                setModel={(model) => updateCarbonCertEdit(model)}
                                key={cert.id}
                                onDeleteClick={(id) => {
                                    setCertToDelete(id);
                                }}
                                />
                        ))}
                        <div className="c-section c-section--thin-width u-text-center">
                            <Button variant="outline" click={() => setAddNew(true)}>{t('createPitch.details.carbonCerts.add')}</Button>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return carbonCertsEditState.length > 0 ? (
        <div className="c-stats__row u-flex--break-md">
            <h2 className="u-text-uppercase u-text-bold c-stats__row__title">
                {t('project.certificates.title')}
            </h2>
            <div className="c-stats__row__content">
                <TwoCol>
                    { carbonCertsEditState.map(cert => (
                        <TwoColItem title={t('project.certificates.certificate')}
                            key={cert.id}
                            value={t(`api.carbon_certification_types.${cert.type}`)}
                            extra={cert.other_value}
                            link={cert.link}
                        />))}
                </TwoCol>
            </div>
        </div>
      ) : null;
}

CarbonCertifications.propTypes = {
    pitchId: PropTypes.number.isRequired,
}

export default CarbonCertifications;
