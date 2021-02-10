import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { communityFields } from './fields';
import ProjectCard from "../projectCard/ProjectCardContainer";
import ProjectCardEdit from "../projectCard/ProjectCardEdit";
import FormInput from "../formInput/FormInput";
import FormTypes from "../formInput/FormInputTypes";

const EditableTextArea = ({
  isEditing,
  id,
  value,
  onChange,
  errors,
  label
}) => {
  if (!isEditing) {
    return <p>{value}</p>;
  }

  return (
    <FormInput
      id={id}
      label={label}
      showLabel
      type={FormTypes.textarea}
      value={value}
      onChange={onChange}
      errors={errors}
      className="u-margin-bottom-small"
    />
  );
};

const CommunityDetails = ({
  projectState,
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
          {projectState.local_community_involvement ?
            <p>{t("project.details.community.involvementTrue")}</p>
            :
            <p>{t("project.details.community.involvementFalse")}</p>
          }

          {projectState.training_involved &&
            <>
              <h3 className="u-margin-bottom-tiny u-margin-top-large u-font-medium u-text-bold">
                {t("project.details.community.trainingInvolved")}
              </h3>
              <p>{projectState.training_type}</p>
              <h3 className="u-margin-bottom-tiny u-margin-top-large u-font-medium u-text-bold">
                {t("project.details.community.trainingNumber")}
              </h3>
              <p>{projectState.training_amount_people}</p>
            </>
          }

          <h3 className="u-margin-bottom-tiny u-margin-top-large u-font-medium u-text-bold">
            {t("project.details.community.peopleWorkingIn")}
          </h3>
          <p>{projectState.people_working_in}</p>

          <h3 className="u-margin-bottom-tiny u-margin-top-large u-font-medium u-text-bold">
            {t("project.details.community.peopleNearby")}
          </h3>
          <p>{projectState.people_amount_nearby}</p>

          <h3 className="u-margin-bottom-tiny u-margin-top-large u-font-medium u-text-bold">
            {t("project.details.community.peopleAbroad")}
          </h3>
          <p>{projectState.people_amount_abroad}</p>

          <h3 className="u-margin-bottom-tiny u-margin-top-large u-font-medium u-text-bold">
            {t("project.details.community.numberOfEmployees")}
          </h3>
          <p>{projectState.people_amount_employees}</p>

          <h3 className="u-margin-bottom-tiny u-margin-top-large u-font-medium u-text-bold">
            {t("project.details.community.numberOfVolunteers")}
          </h3>
          <p>{projectState.people_amount_volunteers}</p>

          <h3 className="u-margin-bottom-tiny u-margin-top-large u-font-medium u-text-bold">
            {t("project.details.community.numberOfBenefitedPeople")}
          </h3>
          <p>{projectState.benefited_people}</p>
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
              label={t(field.label)}
              showLabel
              type={field.type}
              value={projectState[field.modelKey]}
              onChange={e => projectChange(e, field.modelKey)}
              errors={errors[field.modelKey]}
              required={field.required}
              className="u-margin-bottom-small"
            />
          )
        })}
      </>
    );
  }
};

const ProjectDetails = props => {
  const { projectState, setProject, isEditing, errors, projectStatus, me, organisationState } = props;
  const { t } = useTranslation();

  const projectChange = (e, field) => {
    let val = null;

    if (e.currentTarget.type === "checkbox") {
      val = e.currentTarget.checked;
    } else {
      val = e.currentTarget.value;
    }

    const newProject = projectState;
    newProject[field] = val;

    setProject({ ...newProject });
  };

  const isMyOrganisation = organisationState && me.data && organisationState.id === me.data.organisation_id;
  const isAdmin = me.data && me.data.role === 'admin';

  return (
    <section className="c-section c-section--standard-width u-padding-top-huge u-flex u-flex--break-md">
      <div className="o-flex-item u-padding-top-none u-padding-large" style={{ flex: 1.5 }}>
        <div className="u-margin-bottom-large">
          <h2 className="u-margin-bottom-tiny u-margin-top-none u-font-huge">
            {t("createPitch.details.description")}
          </h2>
          <EditableTextArea
              isEditing={isEditing}
              id="description"
              value={projectState.description}
              onChange={e => projectChange(e, "description")}
              errors={errors["description"]}
              label={t("createPitch.details.descriptionHelp")}
            />
        </div>
        <div className="u-margin-bottom-large">
          <h2 className="u-margin-bottom-tiny u-margin-top-none u-font-huge">
            {t("project.details.problem")}
          </h2>
          <EditableTextArea
            isEditing={isEditing}
            id="problem"
            value={projectState.problem}
            onChange={e => projectChange(e, "problem")}
            errors={errors["problem"]}
            label={t("createPitch.details.problemHelp")}
          />
        </div>

        <div className="u-margin-bottom-large">
          <h2 className="u-margin-bottom-tiny u-margin-top-none u-font-huge">
            {t("project.details.anticipatedOutcome")}
          </h2>
          <EditableTextArea
            isEditing={isEditing}
            id="anticipated_outcome"
            value={projectState.anticipated_outcome}
            onChange={e => projectChange(e, "anticipated_outcome")}
            errors={errors["anticipated_outcome"]}
            label={t("createPitch.details.anticipatedOutcome")}
          />
        </div>

        <div className="u-margin-bottom-large">
          <h2 className="u-margin-bottom-tiny u-margin-top-none u-font-huge">
            {t("project.details.whoIsInvolved")}
          </h2>
          <EditableTextArea
            isEditing={isEditing}
            id="who_is_involved"
            value={projectState.who_is_involved}
            onChange={e => projectChange(e, "who_is_involved")}
            errors={errors["who_is_involved"]}
            label={t("createPitch.details.whoIsInvolved")}
          />
        </div>
        <div className="u-margin-bottom-large">
          <CommunityDetails
            projectState={projectState}
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

        <EditableTextArea
          isEditing={isEditing}
          id="future_maintenance"
          value={projectState.future_maintenance}
          onChange={e => projectChange(e, "future_maintenance")}
          errors={errors["future_maintenance"]}
          label={t("createPitch.details.futureMaintenanceHelp")}
        />

        <h3 className="u-margin-bottom-tiny u-margin-top-large u-font-medium u-text-bold">
          {t("project.details.sustainability.useOfResources")}
        </h3>
        <EditableTextArea
          isEditing={isEditing}
          id="use_of_resources"
          value={projectState.use_of_resources}
          onChange={e => projectChange(e, "use_of_resources")}
          errors={errors["use_of_resources"]}
          label={t("createPitch.details.useOfResourcesHelp")}
        />
      </div>

      <div className="o-flex-item">
        {!isEditing ? (
          <ProjectCard
            project={projectState}
            hideCompatibility={projectStatus === 'rejected' || projectStatus === 'pending' || isAdmin || isMyOrganisation}
          />
        ) : (
          <ProjectCardEdit
            project={projectState}
            onChange={newProject => {
              setProject({ ...newProject });
            }}
          />
        )}
      </div>
    </section>
  );
};

ProjectDetails.propTypes = {
  projectState: PropTypes.object.isRequired
};

export default ProjectDetails;
