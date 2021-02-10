import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CarbonCertification from '../carbonCertification/CarbonCertificationContainer';
import TreeSpecies from '../treeSpecies/TreeSpeciesContainer';
import MethodMetric from '../methodMetric/MethodMetricContainer';
import facebookIcon from '../../assets/images/icons/social/facebook.svg';
import instagramIcon from '../../assets/images/icons/social/instagram.svg';
import twitterIcon from '../../assets/images/icons/social/twitter.svg';
import { revenueDriversToString, numberOnlyKeyDown } from '../../helpers';
import FormInput from '../formInput/FormInput';
import FORM_TYPES from '../formInput/FormInputTypes';
import Map from '../map/Map';
import TwoCol from './TwoCol';
import TwoColItem from './TwoColItem';
import SustainableDevelopmentGoals from '../sustainableDevelopmentGoals/SustainableDevelopmentGoals';

const StatsRow = ({ children, title, id, refVal }) => {
    return (
        <div className="c-stats__row u-flex--break-md" id={id} ref={refVal}>
            <h2 className="u-text-uppercase u-text-bold c-stats__row__title">{title}</h2>
            <div className="c-stats__row__content">
                {children}
            </div>
        </div>
    )
}

const ProjectStats = props => {
    const { t } = useTranslation();

    const {
            project,
            setProject,
            organisation,
            isEditing,
            errors,
            defaultScrollToView,
            setScrollToView,
            onAddMetric
          } = props;

    const metricsRef = useRef(null);

    const orgLocation = `${organisation.city}, ${organisation.state}, ${t(`api.countries.${organisation.country}`)}`;

    const valueChange = (e, field) => {
        switch (field) {
            case 'revenue_drivers':
            case 'reporting_frequency':
            case 'reporting_level':
            case 'sustainable_development_goals':
              project[field] = e.value;
              break;
            case 'land_geojson':
              project[field] = JSON.stringify(e.value);
              break;
            default:
              project[field] = e.currentTarget.value;
            break;
        }

        setProject({...project});
    };

    useEffect(() => {
      if (defaultScrollToView === 'restorationMethod' && metricsRef && metricsRef.current) {
        metricsRef.current.scrollIntoView(false);
        setScrollToView(null)
      }
    }, [defaultScrollToView, metricsRef, setScrollToView]);

    return (
        <section className="c-section c-section--standard-width u-padding-top-large">
            {!isEditing &&
                <StatsRow title={t('project.organisationDetails.title')}>
                <TwoCol>
                    <TwoColItem title={t('project.organisationDetails.name')} value={organisation.name} />
                    <TwoColItem title={t('project.organisationDetails.website')}
                        value={organisation.website}
                        link={organisation.website}
                    />
                    <TwoColItem title={t('project.organisationDetails.location')} value={orgLocation} />
                    <div className="c-stats__two_col__item c-stats__two_col__item--edit">
                        <ul className="c-stats__social">
                            {organisation.facebook &&
                                <li className="u-display-inline-block u-margin-right-small">
                                    <a href={organisation.facebook} target="_blank" rel="noopener noreferrer">
                                        <img src={facebookIcon} alt="facebook link" className="c-stats__social__icon" />
                                    </a>
                                </li>
                            }
                            {organisation.instagram &&
                                <li className="u-display-inline-block u-margin-right-small">
                                    <a href={organisation.instagram} target="_blank" rel="noopener noreferrer">
                                        <img src={instagramIcon} alt="instagram link" className="c-stats__social__icon" />
                                    </a>
                                </li>
                            }
                            {organisation.twitter &&
                                <li className="u-display-inline-block u-margin-right-small">
                                    <a href={organisation.twitter} target="_blank" rel="noopener noreferrer">
                                        <img src={twitterIcon} alt="twitter link" className="c-stats__social__icon" />
                                    </a>
                                </li>
                            }
                        </ul>
                    </div>
                </TwoCol>
            </StatsRow>
            }

            <StatsRow title={t('project.funding.title')}>
                {!isEditing ?
                    <TwoCol>
                        <TwoColItem title={t('project.funding.amount')} value={project.funding_amount && `$${project.funding_amount.toLocaleString()}`} />
                        <TwoColItem title={t('project.funding.drivers')} value={revenueDriversToString(project.revenue_drivers, t)} />
                    </TwoCol>
                :
                    <>
                        <FormInput
                            id="funding_amount"
                            label={t('createPitch.details.fundingAmount')}
                            type={FORM_TYPES.number}
                            required
                            showLabel
                            min="0"
                            value={project.funding_amount}
                            onChange={(e) => valueChange(e, 'funding_amount')}
                            errors={errors['funding_amount']}
                            onKeyDown={numberOnlyKeyDown}
                            className="u-margin-vertical-tiny"
                        />
                        <FormInput
                            id="revenue_drivers"
                            label={t("createPitch.details.revenueDrivers")}
                            type={FORM_TYPES.checkboxGroup}
                            resource='/revenue_drivers'
                            asyncValue ='driver'
                            asyncLabel= 'api.revenue_drivers'
                            translate
                            required
                            showLabel
                            value={project.revenue_drivers}
                            onChange={(e) => valueChange(e, 'revenue_drivers')}
                            errors={errors['revenue_drivers']}
                            className="u-margin-vertical-tiny"
                        />
                    </>
                }

            </StatsRow>
            <CarbonCertification pitchId={project.id} orgId={organisation.id} isEditing={isEditing} />
            <StatsRow title={t('project.capabilities.title')}>
                {!isEditing ?
                    <TwoCol>
                        <TwoColItem title={t('project.capabilities.frequency')} value={t(`api.reporting_frequencies.${project.reporting_frequency}`)} />
                        <TwoColItem title={t('project.capabilities.level')} value={project.reporting_level} />
                    </TwoCol>
                    :
                    <>
                        <FormInput
                            id="reporting_frequency"
                            label={t("createPitch.details.reportingFrequency")}
                            type={FORM_TYPES.asyncSelect}
                            resource='/reporting_frequencies'
                            asyncValue ='frequency'
                            asyncLabel= 'api.reporting_frequencies'
                            translate
                            required
                            showLabel
                            value={project.reporting_frequency}
                            onChange={(e) => valueChange(e, 'reporting_frequency')}
                            errors={errors['reporting_frequency']}
                            className="u-margin-vertical-tiny"
                        />
                        <FormInput
                            id="reporting_level"
                            label={t("createPitch.details.reportingLevel")}
                            type={FORM_TYPES.asyncSelect}
                            resource='/reporting_levels'
                            asyncValue ='level'
                            asyncLabel= 'api.reporting_levels'
                            translate
                            required
                            showLabel
                            value={project.reporting_level}
                            onChange={(e) => valueChange(e, 'reporting_level')}
                            errors={errors['reporting_level']}
                            className="u-margin-vertical-tiny"
                        />
                    </>
                }

            </StatsRow>
            <StatsRow title={t('project.projectMetrics.title')} refVal={metricsRef}>
                {!isEditing ?
                    <TwoCol>
                        <TwoColItem title={t('project.projectMetrics.timespan')} value={t('project.projectMetrics.timespanUnit', { count: project.estimated_timespan })} />
                    </TwoCol>
                    :
                    <FormInput
                        id="estimated_timespan"
                        label={t('createPitch.details.timespanHelp')}
                        type={FORM_TYPES.number}
                        required
                        showLabel
                        min="0"
                        value={project.estimated_timespan}
                        onChange={(e) => valueChange(e, 'estimated_timespan')}
                        errors={errors['estimated_timespan']}
                        className="u-margin-bottom"
                        onKeyDown={numberOnlyKeyDown}
                    />
                }
                <MethodMetric
                  pitch={project}
                  setPitch={setProject}
                  methods={project.restoration_methods}
                  onAddMetric={onAddMetric}
                  orgId={organisation.id}
                  isEditing={isEditing} />
            </StatsRow>
            <TreeSpecies pitchId={project.id} orgId={organisation.id} isEditing={isEditing} />
            <StatsRow title={t('project.geolocation.title')}>
                {!isEditing ?
                    <Map mapDefaultConfig={{}} editMode={false} geojson={JSON.parse(project.land_geojson)} />
                :
                    <FormInput
                        id="land_geojson"
                        label={t("createPitch.details.locationMap")}
                        type={FORM_TYPES.map}
                        required
                        showLabel
                        value={project.land_geojson}
                        onChange={(e) => valueChange(e, 'land_geojson')}
                        errors={errors['land_geojson']}
                    />
                }

            </StatsRow>
            <StatsRow title={t('api.attributes.sustainable_development_goals')}>
                {!isEditing ?
                    <TwoCol>
                      <SustainableDevelopmentGoals goals={project.sustainable_development_goals} />
                    </TwoCol>
                    :
                    <FormInput
                        id="sustainable_development_goals"
                        label={t("createPitch.details.sustDevGoals")}
                        type={FORM_TYPES.checkboxGroup}
                        resource='/sustainable_development_goals'
                        asyncValue ='goal'
                        asyncLabel= 'api.sustainable_development_goals'
                        translate
                        required
                        showLabel
                        value={project.sustainable_development_goals}
                        onChange={(e) => valueChange(e, 'sustainable_development_goals')}
                        errors={errors['sustainable_development_goals']}
                    />
                }

            </StatsRow>
        </section>
    )
}

export default ProjectStats;
