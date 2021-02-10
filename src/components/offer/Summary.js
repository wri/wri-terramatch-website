import React from 'react';
import { useTranslation } from 'react-i18next';
import ProjectCard from '../../components/projectCard/ProjectCardContainer';
import ProjectCardEdit from '../../components/projectCard/ProjectCardEdit';
import FormInput from '../formInput/FormInput';
import FormTypes from '../formInput/FormInputTypes';
import SustainableDevelopmentGoals from '../sustainableDevelopmentGoals/SustainableDevelopmentGoals';
import facebookIcon from '../../assets/images/icons/social/facebook.svg';
import instagramIcon from '../../assets/images/icons/social/instagram.svg';
import twitterIcon from '../../assets/images/icons/social/twitter.svg';
import { numberOnlyKeyDown } from '../../helpers';

const TwoCol = ({children}) => (
    <div className="c-stats__two_col">
        {children}
    </div>
)

const TwoColItem = ({title, value, link}) => (
    <div className="c-stats__two_col__item u-margin-bottom-small">
        <p className="u-font-primary u-text-bold u-text-capitalize u-font-grey-alt u-margin-none">{title}</p>
        { link ?
            <a href={link} className="u-font-primary u-text-bold">{link}</a>
            :
            <p className="u-font-primary u-text-bold u-text-capitalize u-margin-none">{value}</p>
        }
    </div>
)

const Summary = (props) => {
    const { offer, organisation, isEditing, onChange, errors, me, compareProjectId } = props;
    const { t } = useTranslation();
    const orgLocation = `${organisation.city}, ${organisation.state}, ${organisation.country}`;

    const valueChange = (e, field) => {
        switch(field) {
            case 'sustainable_development_goals':
            case 'reporting_frequency':
            case 'reporting_level':
            case 'long_term_engagement':
                offer[field] = e.value;
                break;
            case 'price_per_tree':
              offer[field] = parseFloat(e.currentTarget.value);
              break;
            default:
                offer[field] = e.currentTarget.value;
                break;
        }
        onChange(offer);
    };

    const isMyOrganisation = organisation && me.data && organisation.id === me.data.organisation_id;
    const isAdmin = me.data && me.data.role === 'admin';

    return (
        <section className='c-section c-section--standard-width u-padding-top-huge u-flex u-flex--break-md'>
            <div className="o-flex-item u-padding-top-none c-offer__about-left" style={{flex: 1.5}}>
                <h2 className="u-text-uppercase c-offer__heading u-margin-none">{t('offer.title')}</h2>

                {!
                    isEditing ?
                        <p className="c-offer__description u-margin-top-small u-margin-bottom-small">{offer.description}</p>
                    :
                    <>
                        <FormInput
                            className="u-margin-bottom-small"
                            id="name"
                            label={t('createOffer.details.projectName')}
                            type={FormTypes.name}
                            value={offer.name}
                            errors={errors['name']}
                            showLabel
                            onChange={e => valueChange(e, 'name')}
                        />
                        <FormInput
                            className="u-margin-bottom-large"
                            id="description"
                            label={t('createOffer.details.description')}
                            type={FormTypes.textarea}
                            value={offer.description}
                            errors={errors['description']}
                            showLabel
                            onChange={e => valueChange(e, 'description')}
                        />
                    </>
                }
                {!isEditing &&
                    <>
                        <h2 className="c-offer__subtitle u-text-uppercase">{t('project.organisationDetails.title')}</h2>
                        <div className="c-stats__row__content">
                            <TwoCol>
                                <TwoColItem title={t('project.organisationDetails.name')} value={organisation.name} />
                                <TwoColItem title={t('project.organisationDetails.location')} value={orgLocation} />
                                <TwoColItem title={t('project.organisationDetails.website')}
                                    value={organisation.website}
                                    link={organisation.website}
                                />
                                <div className="c-stats__two_col__item">
                                    <ul className="c-stats__social">
                                        {organisation.facebook &&
                                            <li className="u-display-inline-block u-margin-right-small">
                                                <a href={organisation.facebook}>
                                                    <img src={facebookIcon} alt="facebook link" className="c-stats__social__icon" />
                                                </a>
                                            </li>
                                        }
                                        {organisation.instagram &&
                                            <li className="u-display-inline-block u-margin-right-small">
                                                <a href={organisation.instagram}>
                                                    <img src={instagramIcon} alt="instagram link" className="c-stats__social__icon" />
                                                </a>
                                            </li>
                                        }
                                        {organisation.twitter &&
                                            <li className="u-display-inline-block u-margin-right-small">
                                                <a href={organisation.twitter}>
                                                    <img src={twitterIcon} alt="twitter link" className="c-stats__social__icon" />
                                                </a>
                                            </li>
                                        }
                                    </ul>
                                </div>
                            </TwoCol>
                        </div>
                    </>
                }
                {
                    isEditing ?
                    <>
                        <h2 className="c-offer__subtitle u-text-uppercase">{t('project.funding.title')}</h2>
                        <div className="c-stats__row__content">
                            <FormInput
                                className="u-margin-bottom-small"
                                id="funding_amount"
                                showLabel
                                label={t('createOffer.details.fundingAmount')}
                                type={FormTypes.number}
                                value={offer.funding_amount}
                                errors={errors['funding_amount']}
                                onKeyDown={numberOnlyKeyDown}
                                onChange={e => valueChange(e, 'funding_amount')}
                            />
                            <FormInput
                                className="u-margin-bottom-small"
                                id="price_per_tree"
                                showLabel
                                label={t('createOffer.details.averagePricePerTree')}
                                type={FormTypes.number}
                                value={offer.price_per_tree}
                                errors={errors['price_per_tree']}
                                onKeyDown={numberOnlyKeyDown}
                                onChange={e => valueChange(e, 'price_per_tree')}
                            />
                            <FormInput
                                className="u-margin-bottom-small"
                                id="long_term_engagement"
                                label={t('createOffer.details.longTermEngagement')}
                                type={FormTypes.radioGroup}
                                data={[
                                    { value: true, label: t('common.yes')},
                                    { value: false, label: t('common.no')}
                                ]}
                                translate
                                showLabel
                                value={offer.long_term_engagement}
                                errors={errors['long_term_engagement']}
                                onChange={e => valueChange(e, 'long_term_engagement')}
                            />
                        </div>

                        <h2 className="c-offer__subtitle u-text-uppercase">{t('offer.reportingRequirements')}</h2>
                        <div className="c-stats__row__content">
                            <FormInput
                                className="u-margin-bottom-small"
                                id="reporting_frequency"
                                label={t('createOffer.details.reportingFrequency')}
                                type={FormTypes.asyncSelect}
                                resource="/reporting_frequencies"
                                asyncValue="frequency"
                                asyncLabel="api.reporting_frequencies"
                                translate
                                showLabel
                                value={offer.reporting_frequency}
                                errors={errors['reporting_frequency']}
                                onChange={e => valueChange(e, 'reporting_frequency')}
                            />
                            <FormInput
                                className="u-margin-bottom-small"
                                id="reporting_level"
                                label={t('createOffer.details.reportingLevel')}
                                type={FormTypes.asyncSelect}
                                resource="/reporting_levels"
                                asyncValue="level"
                                asyncLabel="api.reporting_levels"
                                translate
                                showLabel
                                value={offer.reporting_level}
                                errors={errors['reporting_level']}
                                onChange={e => valueChange(e, 'reporting_level')}
                            />
                        </div>
                        <h2 className="c-offer__subtitle u-text-uppercase">{t('api.attributes.sustainable_development_goals')}</h2>
                        <div className="c-stats__row__content">
                            <FormInput
                                className="u-margin-bottom-small"
                                id="sustainable_development_goals"
                                label={t('createOffer.details.sustDevGoals')}
                                type={FormTypes.checkboxGroup}
                                resource="/sustainable_development_goals"
                                asyncValue="goal"
                                asyncLabel="api.sustainable_development_goals"
                                translate
                                showLabel
                                value={offer.sustainable_development_goals}
                                errors={errors['sustainable_development_goals']}
                                onChange={e => valueChange(e, 'sustainable_development_goals')}
                            />
                        </div>
                    </>
                    :
                    <>
                        <h2 className="c-offer__subtitle u-text-uppercase">{t('project.funding.title')}</h2>
                        <div className="c-stats__row__content">
                            <TwoCol>
                                <TwoColItem title={t('offer.amount')} value={offer.funding_amount && `$${offer.funding_amount.toLocaleString()}`} />
                                <TwoColItem title={t('createOffer.details.averagePricePerTree')} value={offer.price_per_tree && `$${offer.price_per_tree.toLocaleString()}`} />
                                <TwoColItem title={t('project.capabilities.longTermEngagement')} value={offer.long_term_engagement ? t('common.yes') : t('common.no')} />
                            </TwoCol>
                        </div>

                        <h2 className="c-offer__subtitle u-text-uppercase">{t('offer.reportingRequirements')}</h2>
                        <div className="c-stats__row__content">
                            <TwoCol>
                                <TwoColItem title={t('project.capabilities.frequency')} value={t(`api.reporting_frequencies.${offer.reporting_frequency}`)} />
                                <TwoColItem title={t('project.capabilities.level')} value={offer.reporting_level} />
                            </TwoCol>
                        </div>
                        <h2 className="c-offer__subtitle u-text-uppercase">{t('api.attributes.sustainable_development_goals')}</h2>
                        <div className="c-stats__row__content">
                            <TwoCol>
                                <SustainableDevelopmentGoals goals={offer.sustainable_development_goals} />
                            </TwoCol>
                        </div>
                    </>

                }
                </div>

                <div className="o-flex-item">
                    {!isEditing ?
                        <ProjectCard
                          project={offer}
                          isOffer
                          hideCompatibility={isMyOrganisation || isAdmin}
                          compareProjectId={compareProjectId}
                        />
                    :
                        <ProjectCardEdit
                            isOffer
                            project={offer}
                            onChange={newOffer => {
                                onChange({ ...newOffer });
                            }}
                        />
                    }
                </div>
      </section>
    );

}

export default Summary;
