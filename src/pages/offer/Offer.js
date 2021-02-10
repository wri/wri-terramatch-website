import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'tsc-chameleon-component-library';
import locationPin from '../../assets/images/icons/location-pin-white.svg';
import LoadingScreen from '../../components/loading/LoadingScreen';
import OfferTabs from '../../components/offer/OfferTabs';
import ProfilePreviewCard from '../../components/profilePreviewCard/ProfilePreviewCard';
import { getResponseErrors, getLatestVersion, canFetch, getHeaderGradient, isProjectArchived } from '../../helpers';
import { Link } from 'react-router-dom';
import qs from 'query-string';

const Offer = (props) => {
    const {
            getOffer,
            getOrganisationOffersInspect,
            offerState,
            organisationOffersInspectState,
            getOrganisation,
            organisationState,
            updateOffer,
            updateOfferState,
            clearUpdateOffer,
            clearState,
            clearGetOrganisation,
            meState,
            myOrganisationState
    } = props;

    const { compareProjectId } = qs.parse(props.location.search);

    const [ activeTab, setActiveTab ] = useState('summary');
    const [ isAdmin, setIsAdmin ] = useState(false);
    const [ isMyOrganisation, setIsMyOrganisation ] = useState(false);

    const [ isEditing, setIsEditing ] = useState(false);
    const [ offer, setOffer ] = useState(offerState.data);
    const [ errors, setErrors ] = useState({});
    const [ hasClearedOrganisation, setHasClearedOrganisation ] = useState(false);

    if (!hasClearedOrganisation) {
        clearGetOrganisation();
    }

    const { t } = useTranslation();

    const fetchOffer = useCallback((options) => {
      if (options.inspect && canFetch(organisationOffersInspectState) && meState.data) {
        getOrganisationOffersInspect(meState.data.organisation_id);
      } else if (canFetch(offerState)) {
        getOffer(props.match.params.id);
      }
    }, [getOffer, offerState, props.match.params.id, organisationOffersInspectState, getOrganisationOffersInspect, meState]);

    useEffect(() => {
      if (organisationState.data && meState.data && !meState.isFetching) {
        setIsMyOrganisation(organisationState.data.id === meState.data.organisation_id);
        setIsAdmin(meState.data.role === 'admin');
      }

      if (!organisationState.data) {
        setHasClearedOrganisation(true);
      }
    }, [organisationState, meState, setIsMyOrganisation]);

    useEffect(() => {
      if (organisationOffersInspectState.data) {
        const newOffer = organisationOffersInspectState.data.find(offer => offer.id === parseInt(props.match.params.id, 10));
        if (newOffer) {
          setOffer(newOffer);
          if (canFetch(organisationState)) {
            getOrganisation(newOffer.organisation_id);
          }
        }
      }
    }, [getOrganisation, organisationOffersInspectState, organisationState, props.match.params.id]);

    useEffect(() => {
        if (offerState.data) {
            setOffer(offerState.data);
            if (canFetch(organisationState)) {
                getOrganisation(offerState.data.organisation_id);
            }
        } else if (offerState.error) {
          // Probably 403'd because it has been archived.
          // Try the inspect endpoint
          fetchOffer({inspect: true});
        } else {
          // Fetching for the first time.
          fetchOffer({inspect: false});
        }
    }, [offerState, getOffer, organisationState, getOrganisation, props.match.params.id, fetchOffer]);

    useEffect(() => {
        return clearState;
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const offerUpdate = (newOffer) => {
        setOffer({...newOffer});
    };

    const saveOffer = () => {
        clearUpdateOffer();
        updateOffer(offer, offerState.data.id);
    };

    useEffect(() => {
        if (updateOfferState.data && !updateOfferState.isFetching && !updateOfferState.error) {
            setIsEditing(false);
            getOffer(props.match.params.id);
        }
        if (updateOfferState.error)  {
            setErrors(getResponseErrors(updateOfferState));
        }
        else {
            setErrors({});
        }
    }, [getOffer, props.match.params.id, updateOfferState]);

    const headerBackgroundImage = getHeaderGradient(offer && offer.cover_photo);
    const isFetching = (offerState.isFetching || organisationState.isFetching);

    const canRegisterInterest = !isMyOrganisation && !isAdmin &&
                                myOrganisationState.data &&
                                getLatestVersion(myOrganisationState).data.category !== 'funder';

    const canUpdateFundingStatus = isMyOrganisation && !isProjectArchived(offer);


    return (!isFetching && offer && organisationState.data) ? (
        <div className="c-offer">
            <section className='u-font-white c-project__header u-flex u-flex--break-md' style={{ backgroundImage: headerBackgroundImage }}>
                <div className='c-section c-section--standard-width u-padding-top-huge'>
                <div className='c-project__icon u-margin-top-none u-margin-bottom-small' role='presentation' style={{ backgroundImage: `url(${offer.avatar})` }}></div>
                <h1 className='u-font-white u-margin-vertical-tiny'>{offer.name}</h1>
                <p className='u-font-primary u-margin-vertical-tiny'>
                    <img alt='' src={locationPin} className='c-project__pin u-margin-right-small' />
                    {offer.land_country && `${t(`api.countries.${offer.land_country}`)}, `}
                    {t(`api.continents.${offer.land_continent}`)}
                </p>
                {offer.funding_amount &&
                  <>
                  <h2 className='u-font-white u-margin-vertical-tiny'>
                    ${offer.funding_amount.toLocaleString()}
                  </h2>
                  <p className='u-font-primary u-margin-vertical-tiny'>{t('offer.amount')}</p>
                  </>
                }
                <p className="u-font-primary u-font-white u-margin-vertical-tiny u-text-bold u-text-uppercase u-text-spaced-small u-font-normal">
                  {t('common.status')}: {t(`api.visibilities.offer.${offer.visibility}`)}
                </p>
                {canRegisterInterest &&
                  <Link className="c-button c-button--is-link u-text-center c-button--alternative" to={`/registerInterest/funding/${offer.id}`}>
                  {t('match.interest.applyPitch')}
                  </Link>
                }
                {/* passing an object to "to" allows us to specify props which appear on location.<propkey> in the linked component */}
                {canUpdateFundingStatus &&
                  <Link className="c-button c-button--is-link u-text-center c-button--alternative" to={
                    {
                      pathname:`/profile/funding/updateStatus/${offer.id}`,
                      visibility: offer.visibility
                    }}
                  >
                    {t('project.updateStatus')}
                  </Link>
                }
                </div>
                <div className='c-section c-section--standard-width u-padding-top-huge u-padding-bottom-huge'>
                { organisationState.data && <ProfilePreviewCard item={organisationState.data} /> }
                </div>
            </section>
            <section className="c-section c-offer__tabs u-padding-none u-padding-bottom-large">
                {(isMyOrganisation && offer.visibility !== "archived") &&
                    <div className="c-organisation__controls">
                    {(!isEditing ?
                      <Button
                          className="c-button--small"
                          click={() => setIsEditing(true)}
                          variant="secondary">
                          {t('common.edit')}
                      </Button>
                    :
                      <>
                          <Button
                          className="c-button--small u-margin-right-small"
                          click={() => {
                              window.location.reload();
                          }}
                          variant="secondary"
                          >
                          {t("common.cancel")}
                          </Button>
                          <Button
                              className="c-button--small"
                              click={saveOffer}
                              disabled={updateOfferState.isFetching}>
                              {updateOfferState.isFetching ? t('common.saving') : t('common.finish')}
                          </Button>
                      </>
                    )}
                    </div>
                }
                <OfferTabs
                    isEditing={isEditing}
                    offer={offer}
                    offerUpdate={offerUpdate}
                    errors={errors}
                    organisation={organisationState.data}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    meState={meState}
                    compareProjectId={compareProjectId}
                />
            </section>
        </div>
    ) : (<LoadingScreen />)
};

export default Offer;
