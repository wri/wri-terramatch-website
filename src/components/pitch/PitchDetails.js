import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import communityFields from "./fields/community";
import FormInput from "../formInput/FormInput";
import FormTypes from "../formInput/FormInputTypes";
import ProjectCard from "../projectCard/ProjectCardContainer";
import ProjectCardEdit from "../projectCard/ProjectCardEdit";
import VideoPreview from "../videoPreview/VideoPreview";
import { Button, Modal } from 'tsc-chameleon-component-library';

const EditableField = ({
    isEditing,
    id,
    value,
    onChange,
    errors,
    label,
    formType,
    required
  }) => {
    if (!isEditing) {
      return <p>{value}</p>;
    }

    return (
      <FormInput
        id={id}
        label={label}
        showLabel
        type={formType}
        value={value}
        onChange={onChange}
        errors={errors}
        className="u-margin-bottom-small"
        required={required}
      />
    );
  };

  const CommunityDetails = ({
    pitchState,
    isEditing,
    projectChange,
    errors
  }) => {
    const { t } = useTranslation();

    if (!isEditing) {
      return (
        <>
          <div className="u-margin-bottom-large">
            <h2 className="u-margin-bottom-tiny u-margin-top-none u-font-huge">
              {t("project.details.community.title")}
            </h2>

            <h3 className="u-margin-bottom-tiny u-margin-top-large u-font-medium u-text-bold">
              {t("project.details.community.title")}
            </h3>
            {pitchState.local_community_involvement ?
              <p>{t("project.details.community.involvementTrue")}</p>
              :
              <p>{t("project.details.community.involvementFalse")}</p>
            }

            {pitchState.training_involved &&
              <>
                <h3 className="u-margin-bottom-tiny u-margin-top-large u-font-medium u-text-bold">
                  {t("project.details.community.trainingInvolved")}
                </h3>
                <p>{pitchState.training_type}</p>
                <h3 className="u-margin-bottom-tiny u-margin-top-large u-font-medium u-text-bold">
                  {t("project.details.community.trainingNumber")}
                </h3>
                <p>{pitchState.training_amount_people}</p>
              </>
            }

            <h3 className="u-margin-bottom-tiny u-margin-top-large u-font-medium u-text-bold">
              {t("project.details.community.peopleWorkingIn")}
            </h3>
            <p>{pitchState.people_working_in}</p>

            <h3 className="u-margin-bottom-tiny u-margin-top-large u-font-medium u-text-bold">
              {t("project.details.community.peopleNearby")}
            </h3>
            <p>{pitchState.people_amount_nearby}</p>

            <h3 className="u-margin-bottom-tiny u-margin-top-large u-font-medium u-text-bold">
              {t("project.details.community.peopleAbroad")}
            </h3>
            <p>{pitchState.people_amount_abroad}</p>

            <h3 className="u-margin-bottom-tiny u-margin-top-large u-font-medium u-text-bold">
              {t("project.details.community.numberOfEmployees")}
            </h3>
            <p>{pitchState.people_amount_employees}</p>

            <h3 className="u-margin-bottom-tiny u-margin-top-large u-font-medium u-text-bold">
              {t("project.details.community.numberOfVolunteers")}
            </h3>
            <p>{pitchState.people_amount_volunteers}</p>

            <h3 className="u-margin-bottom-tiny u-margin-top-large u-font-medium u-text-bold">
              {t("project.details.community.numberOfBenefitedPeople")}
            </h3>
            <p>{pitchState.benefited_people}</p>
          </div>
        </>
      );
    } else {
      return (
        <>
          <h2 className="u-margin-bottom-tiny u-margin-top-small u-font-huge">
            {t('createPitch.details.problem')}
          </h2>

          {communityFields.map(field => {
            return (
              <FormInput
                id={field.modelKey}
                key={field.modelKey}
                label={t(field.label)}
                showLabel
                type={field.type}
                value={pitchState[field.modelKey]}
                onChange={e => projectChange(e, field.modelKey)}
                errors={errors[field.modelKey]}
                required={field.required}
                className="u-margin-vertical-tiny"
                onKeyDown={field.onKeyDown}
                min={field.min}
              />
            )
          })}
        </>
      );
    }
  };

  const PitchDetails = props => {
    const { pitchState,
            setPitch,
            isEditing,
            errors,
            projectStatus,
            organisationState,
            me,
            compareProjectId,
            uploadVideoState,
            uploadVideo,
            setActiveTab,
            setScrollToView  } = props;
    const { t } = useTranslation();
    const [ deleteVideo, setDeleteVideo ] = useState(false);
    const [ videoFileName, setVideoFileName ] = useState('');
    const [ videoErrors, setVideoErrors ] = useState([]);

    useEffect(() => {
      if (uploadVideoState.error &&
          uploadVideoState.error.response &&
          uploadVideoState.error.response.body &&
          uploadVideoState.error.response.body.errors) {
             setVideoErrors(uploadVideoState.error.response.body.errors);
      } else if (uploadVideoState.error) {
        setVideoErrors([{
          source: "video",
          code: "GENERIC"
        }])
      } else {
        setVideoErrors([]);
      }
    }, [uploadVideoState]);

    const videoFileChange = (e) => {
      const file = e.target.files[0];

      if (file) {
        uploadVideo({file});
        setVideoFileName(file.name);
      }
    };

    useEffect(() => {
      if (uploadVideoState.data) {
        projectChange(uploadVideoState.data.id, 'video');
      }
    }, [uploadVideoState.data]); // eslint-disable-line react-hooks/exhaustive-deps

    const projectChange = (e, field) => {
        let val = null;
        if (field === 'video') {
          val = e;
        } else if (e.currentTarget.type === "checkbox") {
          val = e.currentTarget.checked;
        } else {
          val = e.currentTarget.value;
        }

        const newProject = pitchState;
        newProject[field] = val;

        setPitch({ ...newProject });
    };

    const isMyOrganisation = organisationState && me.data && organisationState.id === me.data.organisation_id;
    const isAdmin = me.data && me.data.role === 'admin';

    useEffect(() => {
      if (Object.keys(errors).length > 0) {
        const element = document.querySelector('ul[role="alert"]');
        if (element) {
          element.scrollIntoView();
        }
      }
    }, [errors]);

      return (
        <section className="c-section c-section--standard-width u-padding-top-huge u-flex u-flex--break-md">
          <div className="o-flex-item c-project__details-tab">

            <div className="u-margin-bottom-large">
              <h2 className="u-margin-bottom-tiny u-margin-top-none u-font-huge">
                {t("createPitch.details.description")}
              </h2>

              { isEditing &&
                <FormInput
                  id="name"
                  label={t("createPitch.details.projectName")}
                  showLabel
                  type={FormTypes.text}
                  value={pitchState.name}
                  onChange={e => projectChange(e, "name")}
                  errors={errors["name"]}
                  className="u-margin-bottom-small"
                  required
                />
              }

              <EditableField
                formType={FormTypes.textarea}
                isEditing={isEditing}
                id="description"
                value={pitchState.description}
                onChange={e => projectChange(e, "description")}
                errors={errors["description"]}
                label={t("createPitch.details.descriptionHelp")}
                required
                />
            </div>

            <div className="u-margin-bottom-large">
              <h2 className="u-margin-bottom-tiny u-margin-top-none u-font-huge">
                {t("project.details.problem")}
              </h2>
              <EditableField
                formType={FormTypes.textarea}
                isEditing={isEditing}
                id="problem"
                value={pitchState.problem}
                onChange={e => projectChange(e, "problem")}
                errors={errors["problem"]}
                label={t("createPitch.details.problemHelp")}
                required
              />
            </div>

            <div className="u-margin-bottom-large">
              <h2 className="u-margin-bottom-tiny u-margin-top-none u-font-huge">
                {t("project.details.anticipatedOutcome")}
              </h2>
              <EditableField
                formType={FormTypes.textarea}
                isEditing={isEditing}
                id="anticipated_outcome"
                value={pitchState.anticipated_outcome}
                onChange={e => projectChange(e, "anticipated_outcome")}
                errors={errors["anticipated_outcome"]}
                label={t("createPitch.details.anticipatedOutcome")}
                required
              />
            </div>

            <div className="u-margin-bottom-large">
              <h2 className="u-margin-bottom-tiny u-margin-top-none u-font-huge">
                {t("project.details.whoIsInvolved")}
              </h2>
              <EditableField
                formType={FormTypes.textarea}
                isEditing={isEditing}
                id="who_is_involved"
                value={pitchState.who_is_involved}
                onChange={e => projectChange(e, "who_is_involved")}
                errors={errors["who_is_involved"]}
                label={t("createPitch.details.whoIsInvolved")}
                required
              />
            </div>
            <div className="u-margin-bottom-large">
              <CommunityDetails
                pitchState={pitchState}
                isEditing={isEditing}
                projectChange={projectChange}
                errors={errors}
              />
            </div>
            <h2 className="u-margin-bottom-tiny u-margin-top-small u-font-huge">
              {t("project.details.sustainability.title")}
            </h2>
            <h3 className="u-margin-bottom-tiny u-margin-top-large u-font-medium u-text-bold">
              {t("project.details.sustainability.futureMaintenance")}
            </h3>

            <EditableField
              formType={FormTypes.textarea}
              isEditing={isEditing}
              id="future_maintenance"
              value={pitchState.future_maintenance}
              onChange={e => projectChange(e, "future_maintenance")}
              errors={errors["future_maintenance"]}
              label={t("createPitch.details.futureMaintenanceHelp")}
              required
            />

            <h3 className="u-margin-bottom-tiny u-margin-top-large u-font-medium u-text-bold">
              {t("project.details.sustainability.useOfResources")}
            </h3>
            <EditableField
              formType={FormTypes.textarea}
              isEditing={isEditing}
              id="use_of_resources"
              value={pitchState.use_of_resources}
              onChange={e => projectChange(e, "use_of_resources")}
              errors={errors["use_of_resources"]}
              label={t("createPitch.details.useOfResourcesHelp")}
              required
            />
          </div>

          <div className="o-flex-item">
            {!isEditing ? (
              <ProjectCard
                project={pitchState}
                hideCompatibility={projectStatus === 'rejected' || projectStatus === 'pending' || isAdmin || isMyOrganisation}
                compareProjectId={compareProjectId}
              />
            ) : (
              <ProjectCardEdit
                project={pitchState}
                onPitchRestorationEdit={() => {
                  setActiveTab('metrics');
                  setScrollToView('restorationMethod');
                }}
                onChange={newProject => {
                  setPitch({ ...newProject });
                }}
              />
            )}
            {pitchState.video && isNaN(pitchState.video) ?
            <>
            <VideoPreview
              subtext={t('project.watchElevator')}
              src={pitchState.video}
              className="c-project__video u-margin-top-large"/>
            {isEditing &&
              <div className="u-text-center">
                <Button className="c-button--tiny has-icon has-icon--cross-right u-margin-bottom-small u-flex--align-self-flex-end"
                    variant="danger"
                    click={() => {setDeleteVideo(true)}}>
                    {t('project.deleteVideo')}
                </Button>
              </div>
            }
            </>
          : isEditing &&
            <FormInput className="u-margin-top-large u-text-center"
                        id="video"
                        showLabel
                        label={t('createPitch.details.elevatorPitch')}
                        type={FormTypes.file}
                        accept={FormTypes.fileTypes.video}
                        uploadState={uploadVideoState}
                        onChange={(e) => videoFileChange(e)}
                        errors={videoErrors}
                        fileName={videoFileName}
                        busy={uploadVideoState.isFetching}
                        success={!!uploadVideoState.data}
                        disabled={uploadVideoState.isFetching} />
            }
          </div>
          {deleteVideo &&
              <Modal show close={() => setDeleteVideo(false)}>
                  <div className="u-text-center">
                      <h2 className="u-margin-bottom-tiny u-margin-top-none u-font-medium u-text-uppercase">{t('project.deleteVideo')}</h2>
                      <p>{t('project.deleteVideoHelp')}</p>
                      <Button
                      className="u-margin-top-large"
                      click={() => {
                        projectChange(null, 'video');
                        setDeleteVideo(false);
                      }}>
                      {t('common.confirm')}
                      </Button>
                  </div>
              </Modal>
          }
        </section>
      );
  }

  export default PitchDetails;
