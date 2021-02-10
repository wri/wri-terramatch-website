import React from 'react'
import PropTypes from 'prop-types'

const PartnerListItem = (props) => {
  const { item } = props;

  const imageUrl = require(`../../assets/images/partners/${item.image}`);

  return (
    <a className="c-partner-item u-margin-small"
      data-testid="test-partner"
      href={item.link}
      target="_blank"
      rel="noopener noreferrer">
      <img className="c-partner-item__logo" src={imageUrl} alt={item.imageAlt} />
    </a>
  )
};

PartnerListItem.propTypes = {
  item: PropTypes.object.isRequired
};

export default PartnerListItem;
