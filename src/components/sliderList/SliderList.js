import React from 'react';
import Slider from "react-slick";
import NewsListItem from './NewsListItem';
import CaseStudyListItem from './CaseStudyListItem';
import PartnerListItem from './PartnerListItem';
import ProjectListItem from './ProjectListItem';
import TestimonialListItem from './TestimonialListItem';
import FeaturedListItem from './FeaturedListItem';
import PropTypes from 'prop-types';

const SliderList = (props) => {
  const { items, variant, itemProps, slickConfig, className, isFetching, langCode } = props;

  let Element = null;
  let idKey = 'id';

  const fetchingSlides = [
    {
      id: 1,
      fetchSlide: true
    },
    {
      id: 2,
      fetchSlide: true
    },
    {
      id: 3,
      fetchSlide: true
    }
  ];

  switch (variant) {
    case 'News':
    default:
      Element = NewsListItem;
      idKey = 'new_item_id';
      break;
    case 'CaseStudy':
      Element = CaseStudyListItem;
      idKey = 'case_study_id';
      break;
    case 'Testimonial':
      Element = TestimonialListItem;
      idKey = 'name';
      break;
    case 'Partner':
      Element = PartnerListItem;
      break;
    case 'Project':
      Element = ProjectListItem;
      break;
    case 'Featured':
      Element = FeaturedListItem;
      idKey = 'project_name';
      break;
  }

  if (isFetching) {
    idKey = 'id';
  }

  const slides = isFetching ? fetchingSlides : items;

  const itemsElement = slides.map(item => <Element item={item} key={item[idKey]} {...itemProps} langCode={langCode}/>);

  let config = slickConfig;
  let classes = className;
  if (isFetching) {
    config = {
      ...slickConfig,
      dots: false,
      arrows: false,
      draggable: false,
      swipe: false
    };
    classes += ' slick-slider--isFetching';
  }

  return (
    <Slider {...config} className={classes}>
      {itemsElement}
    </Slider>
  );
};

SliderList.propTypes = {
  items: PropTypes.array.isRequired,
  variant: PropTypes.oneOf(['News', 'CaseStudy', 'Partner', 'Project', 'Testimonial', 'Featured']).isRequired,
  itemProps: PropTypes.object,
  slickConfig: PropTypes.object,
  className: PropTypes.string,
  isFetching: PropTypes.bool,
  langCode: PropTypes.string
};

SliderList.defaultProps = {
  itemProps: { buttonText: 'Read More' },
  slickConfig: {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    centerMode: true,
    slidesToScroll: 1,
    variableWidth: true
  },
  className: '',
  isFetching: false,
  langCode: 'en-US'
}

export default SliderList;
