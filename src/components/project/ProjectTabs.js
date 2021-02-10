import React from 'react';
import { useTranslation } from 'react-i18next';
import ProjectDetails from './ProjectDetails'

import Tab from '../tab/Tab';
import TeamMembers from './TeamMembers';
import Documents from './Documents';

import ProjectStats from './ProjectStats';
import EditStats from './EditStats';

const ProjectTabs = (props) => {
    const { t } = useTranslation();

    const {
        projectStatus,
        projectState,
        setProject,
        metricsState,
        setMetrics,
        organisationState,
        carbonCertsState,
        setCarbonCerts,
        treeSpeciesState,
        setTreeSpecies,
        errors,
        validationErrors,
        activeTab,
        setActiveTab,
        isEditing,
        me,
        documentsState,
        teamMembersState,
    } = props;

    const tabs = [
        {
            title: t('project.about'),
            key: 'about'
        },
        {
            title: t('project.metrics'),
            key: 'metrics'
        },
        {
            title: t('project.team'),
            key: 'team'
        },
        {
            title: t('project.documents.title'),
            key: 'documents'
        }
    ];

    let activeTabComponent = null;

    switch(activeTab) {
        case 'about':
            activeTabComponent = <ProjectDetails
                projectState={projectState}
                projectStatus={projectStatus}
                setProject={setProject}
                isEditing={isEditing}
                me={me}
                errors={errors.project}
                organisationState={organisationState}
              />
        break;
        case 'metrics':
                if (isEditing) {
                    activeTabComponent = <EditStats
                      projectState={projectState}
                      setProject={setProject}
                      carbonCertsState={carbonCertsState}
                      setCarbonCerts={setCarbonCerts}
                      metricsState={metricsState}
                      setMetrics={setMetrics}
                      treeSpeciesState={treeSpeciesState}
                      setTreeSpecies={setTreeSpecies}
                      errors={errors}
                      validationErrors={validationErrors}
                    />
                } else {
                    activeTabComponent = <ProjectStats
                      project={projectState}
                      organisation={organisationState}
                      carbonCertifications={carbonCertsState}
                      metrics={metricsState}
                      treeSpecies={treeSpeciesState}
                    />
                }
        break;
        case 'team':
            activeTabComponent = <TeamMembers
                teamMembersState={teamMembersState}
            />
        break;
        case 'documents':
            activeTabComponent = <Documents documentsState={documentsState} />
        break;
        default:
        break;
    }

    return (
        <>
            <Tab items={tabs} tabChange={setActiveTab} activeTabKey={activeTab}/>
            <div className="c-tab__content">
                {activeTabComponent}
            </div>
        </>
    )
}

export default ProjectTabs;
