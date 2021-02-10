import React from 'react';
import PropTypes from 'prop-types';

const SocialMediaList = (props) => {
  const {organisation, className} = props;

  return (
    <ul className={`c-social-media-list u-list-unstyled ${className}`}>
        {organisation.facebook &&
            <li className="c-social-media-list__item u-margin-vertical-tiny">
                <a href={organisation.facebook} target="_blank" rel="noreferrer noopener">
                    <div role="img" alt="facebook link" className="c-social-media-list__icon c-social-media-list__icon--facebook" />
                </a>
            </li>
        }

        {organisation.instagram &&
            <li className="c-social-media-list__item u-margin-vertical-tiny">
                <a href={organisation.instagram} target="_blank" rel="noreferrer noopener">
                    <div role="img"  alt="instagram link" className="c-social-media-list__icon c-social-media-list__icon--instagram" />
                </a>
            </li>
        }

        {organisation.twitter &&
            <li className="c-social-media-list__item u-margin-vertical-tiny">
                <a href={organisation.twitter} target="_blank" rel="noreferrer noopener">
                    <div role="img" alt="twitter link" className="c-social-media-list__icon c-social-media-list__icon--twitter" />
                </a>
            </li>
        }

        {organisation.linkedin &&
            <li className="c-social-media-list__item u-margin-vertical-tiny">
                <a href={organisation.linkedin} target="_blank" rel="noreferrer noopener">
                    <div role="img" alt="linkedin link" className="c-social-media-list__icon c-social-media-list__icon--linkedin" />
                </a>
            </li>
        }

        {organisation.website &&
            <li className="c-social-media-list__item u-margin-vertical-tiny">
                <a href={organisation.website} target="_blank" rel="noreferrer noopener">
                    <div role="img" alt="website link" className="c-social-media-list__icon c-social-media-list__icon--website" />
                </a>
            </li>
        }
    </ul>
  );
};

SocialMediaList.propTypes = {
  organisation: PropTypes.object.isRequired,
  className: PropTypes.string
};

SocialMediaList.defaultProps = {
  className: ''
};

export default SocialMediaList;
