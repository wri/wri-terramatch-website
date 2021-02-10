import React, { useState, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Collapse } from 'react-collapse';
import facebookIcon from '../../assets/images/icons/social/facebook.svg';
import instagramIcon from '../../assets/images/icons/social/instagram.svg';
import twitterIcon from '../../assets/images/icons/social/twitter.svg';
import { goalColours, revenueDriversToString } from '../../helpers';
import Map from '../map/Map';

const TwoCol = ({children}) => (
    <div className="c-stats__two_col">
        {children}
    </div>
)

const TwoColItem = (props) => {
    const { title, link, value, extra } = props;
    const { t } = useTranslation();

    return (
        <div className="c-stats__two_col__item ">
            <p className="u-font-primary u-text-bold u-text-capitalize u-font-grey-alt">{title}</p>
            { link ?
                <a href={link} className="u-font-primary u-text-bold" target="_blank" rel="noopener noreferrer">{value}</a>
                :
                <p className="u-font-primary u-text-bold u-text-capitalize">
                  {typeof value === "boolean" && value && t('common.yes')}
                  {typeof value === "boolean" && !value && t('common.no')}
                  {typeof value !== "boolean" && value}
                </p>
            }
            <p className="u-font-primary u-font-small">{extra}</p>
        </div>
    )
}

const StatsRow = ({ children, title }) => {
    return (
        <div className="c-stats__row">
            <h2 className="u-text-uppercase u-text-bold c-stats__row__title">{title}</h2>
            <div className="c-stats__row__content">
                {children}
            </div>
        </div>
    )
}

const SustainableDevGoal = ({goal}) => {
    const { t } = useTranslation();
    const colour = goalColours[goal];
    return(
        <div className="c-stats__dev_goal u-margin-bottom-small u-margin-right-small" style={{backgroundColor: colour}}>
            <img
                className='c-stats__dev_icon'
                src={require(`../../assets/images/icons/sdg/${goal}.svg`)}
                alt={t(`api.sustainable_development_goals.${goal}`)}
                role='presentation'
            />
            <p>{t(`api.sustainable_development_goals.${goal}`)}</p>
        </div>
    )
}

const TreeSpecies = ({tree}) => {
    const { t } = useTranslation();
    const [ isOpen, setIsOpen ] = useState(false);

    const getTotalPrice = () => {
        return (
            (parseFloat(tree.price_to_plant, 10) || 0) +
            (parseFloat(tree.price_to_maintain, 10) || 0) +
            (parseFloat(tree.site_prep, 10) || 0) +
            (parseFloat(tree.saplings, 10) || 0))
    }

    return(
        <>
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
                    <TwoColItem title={t('project.treeSpecies.saplings')} value={tree.saplings.toFixed(2) } />
                    <TwoColItem title={t('project.treeSpecies.priceToPlant')} value={tree.price_to_plant.toFixed(2) } />
                    <TwoColItem title={t('project.treeSpecies.priceToMaintain')} value={tree.price_to_maintain.toFixed(2) } />
                    <TwoColItem title={t('project.treeSpecies.sitePrep')} value={tree.site_prep.toFixed(2) } />
                    <TwoColItem title={t('project.treeSpecies.overallPrice')} value={getTotalPrice()} />
                    <TwoColItem title={t('project.treeSpecies.survivalRate')} value={tree.survival_rate} />
                    <TwoColItem title={t('project.treeSpecies.producesFood')} value={tree.produces_food} />
                    <TwoColItem title={t('project.treeSpecies.producesTimber')} value={tree.produces_timber} />
                    <TwoColItem title={t('project.treeSpecies.producesFirewood')} value={tree.produces_firewood} />
                    <TwoColItem title={t('project.treeSpecies.owner')} value={t(`api.tree_species_owners.${tree.owner}`)} />
                    <TwoColItem title={t('project.treeSpecies.native')} value={tree.native === 1 ? true : false} />
                    <TwoColItem title={t('project.treeSpecies.season')} value={tree.season} />
                </TwoCol>
            </Collapse>
        </>
    )
}

const ProjectStats = props => {
    const { t } = useTranslation();
    const { project, organisation, carbonCertifications,
        metrics, treeSpecies } = props;

    const orgLocation = `${organisation.city}, ${organisation.state}, ${t(`api.countries.${organisation.country}`)}`;

    return (
        <section className="c-section c-section--standard-width u-padding-top-large">
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
            <StatsRow title={t('project.funding.title')}>
                <TwoCol>
                    <TwoColItem title={t('project.funding.amount')} value={project.funding_amount} />
                    <TwoColItem title={t('project.funding.drivers')} value={revenueDriversToString(project.revenue_drivers, t)} />
                </TwoCol>
            </StatsRow>
            {(carbonCertifications && carbonCertifications.length > 0) &&
                <StatsRow title={t('project.certificates.title')}>
                    <TwoCol>
                        { carbonCertifications.map(cert => (
                            <TwoColItem title={t('project.certificates.certificate')}
                                key={cert.id}
                                value={t(`api.carbon_certification_types.${cert.type}`)}
                                extra={cert.other_value}
                                link={cert.link}
                            />))}
                    </TwoCol>
                </StatsRow>
            }
            <StatsRow title={t('project.capabilities.title')}>
                <TwoCol>
                    <TwoColItem title={t('project.capabilities.frequency')} value={project.reporting_frequency} />
                    <TwoColItem title={t('project.capabilities.level')} value={project.reporting_level} />
                </TwoCol>
            </StatsRow>
            {metrics && metrics.length > 0 &&
                <StatsRow title={t('project.projectMetrics.title')}>
                    <TwoCol>
                        <TwoColItem title={t('project.projectMetrics.timespan')} value={t('project.projectMetrics.timespanUnit', { count: project.estimated_timespan })} />
                    </TwoCol>
                    {metrics.map(metric => (
                            <Fragment key={metric.id}>
                                <h3 className="c-stats__subheader u-text-uppercase">{metric.restoration_method}</h3>
                                <TwoCol>
                                    <TwoColItem title={t('project.projectMetrics.experience')} value={metric.experience} />
                                    <TwoColItem title={t('project.projectMetrics.landSize')} value={metric.land_size} />
                                    <TwoColItem title={t('project.projectMetrics.pricePerHectare')} value={metric.price_per_hectare} />
                                    <TwoColItem title={t('project.projectMetrics.carbonImpact')} value={metric.carbon_impact} />
                                    <TwoColItem title={t('project.projectMetrics.biomassPerHectare')} value={metric.biomass_per_hectare} />
                                    <TwoColItem title={t('project.projectMetrics.biodiversityImpact')} value={metric.species_impacted.toString()} />
                                </TwoCol>
                            </Fragment>
                        )
                    )}
                </StatsRow>
            }
            {treeSpecies && treeSpecies.length > 0 &&
                <StatsRow title={t('project.treeSpecies.title')}>
                    {treeSpecies.map(tree => (
                        <TreeSpecies tree={tree} key={tree.id}/>
                    ))}
                </StatsRow>
            }
            <StatsRow title={t('project.geolocation.title')}>
                <Map mapDefaultConfig={{}} editMode={false} geojson={JSON.parse(project.land_geojson)} />
            </StatsRow>
            <StatsRow title={t('api.attributes.sustainable_development_goals')}>
                <TwoCol>
                        {project.sustainable_development_goals.map(goal =>
                            <SustainableDevGoal goal={goal} key={goal}/>
                        )}
                </TwoCol>
            </StatsRow>
        </section>
    )
}

export default ProjectStats;
