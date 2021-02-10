import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Tab from '../tab/Tab';
import PitchDetails from './PitchDetailsContainer';
import PitchStats from './PitchStats';
import PitchContacts from '../projectContacts/PitchContactsContainer';
import PitchDocuments from './DocumentsContainer'

const PitchTabs = (props) => {

    const {
        activeTab,
        setActiveTab,
        pitchStatus,
        pitchState,
        setPitch,
        organisationState,
        errors,
        isEditing,
        me,
        compareProjectId
    } = props;

    const { t } = useTranslation();
    const [scrollToView, setScrollToView] = useState(null);

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
            activeTabComponent = <PitchDetails
                pitchState={pitchState}
                pitchStatus={pitchStatus}
                setPitch={setPitch}
                isEditing={isEditing}
                me={me}
                organisationState={organisationState}
                errors={errors}
                compareProjectId={compareProjectId}
                setActiveTab={setActiveTab}
                setScrollToView={setScrollToView}
                />
        break;
        case 'metrics':
            activeTabComponent = <PitchStats
                project={pitchState}
                setProject={setPitch}
                organisation={organisationState}
                isEditing={isEditing}
                errors={errors}
                defaultScrollToView={scrollToView}
                setDefaultScrollToView={setScrollToView}
                setScrollToView={setScrollToView}
                />
        break;
        case 'team':
            activeTabComponent = <PitchContacts orgId={organisationState.id} projectId={pitchState.id} isEditing={isEditing} />
        break;
        case 'documents':
            activeTabComponent = <PitchDocuments orgId={organisationState.id} pitchId={pitchState.id} isEditing={isEditing} />
        break;
        default:
        break;
    }

    return (
        <>
            <Tab items={tabs} tabChange={setActiveTab} activeTabKey={activeTab} />
            <div className="c-tab__content">
                {activeTabComponent}
            </div>
        </>
    )

}

export default PitchTabs;
