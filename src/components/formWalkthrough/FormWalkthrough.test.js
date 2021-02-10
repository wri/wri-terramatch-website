import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import FormWalkthrough from './FormWalkthrough';
import '../../i18n';

const exampleSteps = [
    {
      title: 'signup.title',
      subtext: 'signup.subtext',
      nextSubmitButton: 'next',
      fields: [
        {
          modelKey: 'first_name',
          label: 'signup.firstName',
          type: 'text',
          required: true
        },
        {
          modelKey: 'last_name',
          label: 'signup.lastName',
          type: 'text',
          required: true
        },
        {
          modelKey: 'email_address',
          label: 'signup.emailAddress',
          type: 'email',
          required: true
        },
        {
          modelKey: 'password',
          label: 'signup.password',
          type: 'newPassword',
          required: true
        }
      ]
    },
    {
      title: 'signup.title',
      subtext: 'signup.subtext',
      nextSubmitButton: 'signup.title',
      fields: [
        {
          modelKey: 'first_name',
          label: 'signup.firstName',
          type: 'text',
          required: true
        },
        {
          modelKey: 'last_name',
          label: 'signup.lastName',
          type: 'text',
          required: true
        },
        {
          modelKey: 'email_address',
          label: 'signup.emailAddress',
          type: 'email',
          required: true
        },
        {
          modelKey: 'password',
          label: 'signup.password',
          type: 'newPassword',
          required: true
        }
      ]
    }
  ];

it('FormElement Renders', () => {
  const {getByTestId} = render(
    <FormWalkthrough
      modelName="UserCreate"
      steps={exampleSteps}
    />
  );

  expect(getByTestId('next-button')).toBeTruthy();
});

it('FormElement changes pages okay', () => {
  const {getByTestId} = render(
    <FormWalkthrough
      modelName="UserCreate"
      steps={exampleSteps}
    />
  );
  let button = getByTestId('next-button');
  expect(button).toBeTruthy();

  expect(() => {
    getByTestId('submit-button');
  }).toThrow();

  fireEvent.click(button);

  button = getByTestId('submit-button');
  expect(button).toBeTruthy();

  expect(() => {
    getByTestId('next-button');
  }).toThrow();

});
