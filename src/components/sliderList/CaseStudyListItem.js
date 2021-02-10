import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardHeader, CardContent, Button } from 'tsc-chameleon-component-library';
import { getTranslation } from '../../helpers/wp';
import { Link } from 'react-router-dom';

const CaseStudyListItem = (props) => {
  const { item, buttonText, langCode } = props;

  if (item.fetchSlide) {
    return (
      <div className="c-case-study u-margin-small" data-testid="test-casestudy">
        <Card>
          <CardContent></CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="c-case-study u-margin-small" data-testid="test-casestudy">
      <Card>
        <CardHeader
          image={item.head_image}
          imageAlt={item.header_image_alt_text}
        ></CardHeader>
        <CardContent>
          <h3 className="u-text-uppercase u-text-bold u-width-75 u-margin-bottom-small">{getTranslation(langCode, item.case_study_title)}</h3>
          <p className="u-font-primary">{item.preview_text}</p>
          <Link to={`/case-study/${item.case_study_name}`}>
            <Button
              variant="secondary"
              className="c-button--small u-margin-top-tiny u-margin-bottom-small c-case-study__read-more"
              icon
              iconName="arrow-right">
              {buttonText}
            </Button>
        </Link>
        </CardContent>
      </Card>
    </div>
  )
};

CaseStudyListItem.propTypes = {
  item: PropTypes.object.isRequired,
  buttonText: PropTypes.string.isRequired,
  langCode: PropTypes.string.isRequired
};

export default CaseStudyListItem;
