import React from 'react';
import { useTranslation } from 'react-i18next';
import Tab from '../tab/Tab';
import Summary from './Summary';
import OfferContacts from '../projectContacts/OfferContactsContainer';

const OfferTabs = props => {
    const { t } = useTranslation();
    const { offer,
            organisation,
            activeTab,
            setActiveTab,
            isEditing,
            offerUpdate,
            errors,
            meState,
            compareProjectId
        } = props;

    const tabs = [
        {
            title: t('offer.summary'),
            key: 'summary'
        },
        {
            title: t('offer.team'),
            key: 'team'
        }
    ];

    let activeTabComponent = null;

    switch(activeTab) {
        case 'summary':
            activeTabComponent =
                <Summary organisation={organisation}
                    offer={offer}
                    isEditing={isEditing}
                    onChange={offerUpdate}
                    errors={errors}
                    me={meState}
                    compareProjectId={compareProjectId} />
            break;
        case 'team':
            activeTabComponent = <OfferContacts projectId={offer.id} orgId={organisation.id} isEditing={isEditing} />
            break;
        default:
            break;
    }

    return(
        <>
            <Tab items={tabs} tabChange={setActiveTab} activeTabKey={activeTab} />
            <div className="c-tab__content">
                {activeTabComponent}
            </div>
        </>
    )
}

export default OfferTabs;
