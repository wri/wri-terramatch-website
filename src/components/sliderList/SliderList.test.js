import React from 'react';
import {render} from '@testing-library/react';
import SliderList from './SliderList';
import '../../i18n';
import { BrowserRouter as Router } from 'react-router-dom';

const newsItemsArr = [
  {
    new_item_name: "another-example",
    new_item_title: "[:en-us]Another example[:es]Otro ejemplo[:]",
    head_image: "https://wri-rm-wp-staging.cube-sites.com/wp-content/uploads/2019/09/absolutvision-WYd_PkCa1BY-unsplash-1.jpg",
    header_image_alt_text: "Paper",
    new_item_id: 10,
    subtitle: "subtitle",
    main_text: "<p>Blah blach</p>↵",
    preview_text: "Here is some preview text and some information about what could be in the case study"
  },
  {
    new_item_name: "another-example-2",
    new_item_title: "[:en-us]Another example[:es]Otro ejemplo[:]",
    head_image: "https://wri-rm-wp-staging.cube-sites.com/wp-content/uploads/2019/09/absolutvision-WYd_PkCa1BY-unsplash-1.jpg",
    header_image_alt_text: "Paper",
    new_item_id: 11,
    main_text: "<p>Blah blach</p>↵",
    subtitle: "subtitle",
    preview_text: "Here is some preview text and some information about what could be in the case study"
  },
  {
    new_item_name: "another-example-3",
    new_item_title: "[:en-us]Another example[:es]Otro ejemplo[:]",
    head_image: "https://wri-rm-wp-staging.cube-sites.com/wp-content/uploads/2019/09/absolutvision-WYd_PkCa1BY-unsplash-1.jpg",
    header_image_alt_text: "Paper",
    new_item_id: 12,
    main_text: "<p>Blah blach</p>↵",
    subtitle: "subtitle",
    preview_text: "Here is some preview text and some information about what could be in the case study"
  }
];

const caseStudyArr = [
  {
    case_study_name: "another-example",
    case_study_title: "[:en-us]Another example[:es]Otro ejemplo[:]",
    head_image: "https://wri-rm-wp-staging.cube-sites.com/wp-content/uploads/2019/09/absolutvision-WYd_PkCa1BY-unsplash-1.jpg",
    header_image_alt_text: "Paper",
    case_study_id: 10,
    main_text: "<p>Blah blach</p>↵",
    preview_text: "Here is some preview text and some information about what could be in the case study"
  },
  {
    case_study_name: "another-example-2",
    case_study_title: "[:en-us]Another example[:es]Otro ejemplo[:]",
    head_image: "https://wri-rm-wp-staging.cube-sites.com/wp-content/uploads/2019/09/absolutvision-WYd_PkCa1BY-unsplash-1.jpg",
    header_image_alt_text: "Paper",
    case_study_id: 11,
    main_text: "<p>Blah blach</p>↵",
    preview_text: "Here is some preview text and some information about what could be in the case study"
  },
  {
    case_study_name: "another-example-3",
    case_study_title: "[:en-us]Another example[:es]Otro ejemplo[:]",
    head_image: "https://wri-rm-wp-staging.cube-sites.com/wp-content/uploads/2019/09/absolutvision-WYd_PkCa1BY-unsplash-1.jpg",
    header_image_alt_text: "Paper",
    case_study_id: 12,
    main_text: "<p>Blah blach</p>↵",
    preview_text: "Here is some preview text and some information about what could be in the case study"
  }
]

const partnerArr = [
  {
    link: 'https://www.google.com',
    image: 'abc.png',
    imageAlt: 'Lorem ipsum dolor sit amet',
    id: '21e23'
  },
  {
    link: 'https://www.google.com',
    image: 'aduna.png',
    imageAlt: 'Lorem ipsum dolor sit amet',
    id: 'erds'
  },
  {
    link: 'https://www.google.com',
    image: 'arcos.png',
    imageAlt: 'Lorem ipsum dolor sit amet',
    id: 'ef32'
  },
  {
    link: 'https://www.google.com',
    image: 'gfg.png',
    imageAlt: 'Lorem ipsum dolor sit amet',
    id: 'dsvgt54'
  }
]

const projectArr = [
  {
    header: 'Reforestation in Uganda',
    imageAlt: 'Some alternative text',
    image: 'https://images.unsplash.com/photo-1542815760-9558be153655?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    logo: 'https://pbs.twimg.com/profile_images/985203440153395200/G5ldXwPQ.jpg',
    logoAlt: 'Greening Uganda Logo',
    text: 'We aim to plant 10,000 new trees surrounding the farm lands of Kikajjo, Uganda.',
    link: '',
    location: 'Kikajjo Uganda',
    award: 'Comprehensive overview',
    fundingAmount: 24000,
    compatibility: 0.72,
    id: 'efhjbkjew8'
  },
  {
    header: 'Reforestation in Uganda',
    imageAlt: 'Some alternative text',
    image: 'https://images.unsplash.com/photo-1546954552-eb2ada4a3654?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60',
    logo: 'https://pbs.twimg.com/profile_images/985203440153395200/G5ldXwPQ.jpg',
    logoAlt: 'Greening Uganda Logo',
    text: 'We aim to plant 10,000 new trees surrounding the farm lands of Kikajjo, Uganda.',
    link: '',
    location: 'Kikajjo Uganda',
    award: 'Comprehensive overview',
    fundingAmount: 24000,
    compatibility: 0.72,
    id: 'dwehdbss'
  },
  {
    header: 'Reforestation in Uganda',
    imageAlt: 'Some alternative text',
    image: 'https://images.unsplash.com/photo-1509099646481-33260a1c97a4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60',
    logo: 'https://pbs.twimg.com/profile_images/985203440153395200/G5ldXwPQ.jpg',
    logoAlt: 'Greening Uganda Logo',
    text: 'We aim to plant 10,000 new trees surrounding the farm lands of Kikajjo, Uganda.',
    link: '',
    location: 'Kikajjo Uganda',
    fundingAmount: 24000,
    compatibility: 0.72,
    id: '27812hdd'
  },
  {
    header: 'Reforestation in Uganda',
    imageAlt: 'Some alternative text',
    image: 'https://images.unsplash.com/photo-1473090928358-00fcead4f08c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60',
    logo: 'https://pbs.twimg.com/profile_images/985203440153395200/G5ldXwPQ.jpg',
    logoAlt: 'Greening Uganda Logo',
    text: 'We aim to plant 10,000 new trees surrounding the farm lands of Kikajjo, Uganda.',
    link: '',
    location: 'Kikajjo Uganda',
    fundingAmount: 24000,
    compatibility: 0.72,
    id: '3892hiue'
  }
]

it('Slider Renders with News Items', () => {
  const {getAllByTestId} = render(
    <Router>
      <SliderList items={newsItemsArr} variant="News"/>
    </Router>
  );

  const matched = getAllByTestId('test-news');

  expect(matched.length).toBeGreaterThanOrEqual(newsItemsArr.length);
  // toBeGreaterThanOrEqual because slick renders an infinite carouse so must be atleast the matched length
});

it('Slider Renders with Case Study Items', () => {
  const {getAllByTestId} = render(
    <Router>
      <SliderList items={caseStudyArr} variant="CaseStudy"/>
    </Router>
  );

  const matched = getAllByTestId('test-casestudy');

  expect(matched.length).toBeGreaterThanOrEqual(caseStudyArr.length);
});

it('Slider Renders correct case study button', () => {
  const buttonText = "Button text";

  const items = [
    {
      case_study_name: "another-example",
      case_study_title: "[:en-us]Another example[:es]Otro ejemplo[:]",
      head_image: "https://wri-rm-wp-staging.cube-sites.com/wp-content/uploads/2019/09/absolutvision-WYd_PkCa1BY-unsplash-1.jpg",
      header_image_alt_text: "Paper",
      case_study_id: 10,
      main_text: "<p>Blah blach</p>↵",
      preview_text: "Here is some preview text and some information about what could be in the case study"
    }
  ]

  const {getByText} = render(
    <Router>
      <SliderList items={items} itemProps={{ buttonText }} variant="CaseStudy"/>
    </Router>
  );


  expect(getByText(buttonText)).toBeTruthy();
});

it('Slider Renders with Partner Items', () => {
  const {getAllByTestId} = render(
    <Router>
      <SliderList items={partnerArr} variant="Partner"/>
    </Router>
  );

  const matched = getAllByTestId('test-partner');

  expect(matched.length).toBeGreaterThanOrEqual(partnerArr.length);
});

it('Slider Renders with Project Items', () => {
  const {getAllByTestId} = render(
    <Router>
      <SliderList items={projectArr} variant="Project"/>
    </Router>
  );

  const matched = getAllByTestId('test-project');

  expect(matched.length).toBeGreaterThanOrEqual(projectArr.length);
});
