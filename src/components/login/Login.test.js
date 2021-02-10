import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import Login from './Login';
import '../../i18n';
import { initialAsyncState } from '../../redux/asyncActionReducer';

const getLoginSuccessFunction = () => jest.fn(() => {
  return new Promise((resolve) => {
    resolve();
  })
})

const requestResetSuccessFunction = () => jest.fn(() => {
  return new Promise((resolve) => {
    resolve();
  })
})

const getHistory = () => {
  return {
    push: jest.fn()
  }
}

const getMe = () => {}
const hideHeaderFooter = () => {}


it('Login renders', () => {
  const {getByText} = render(
    <Login
      loginState={initialAsyncState}
      meState={initialAsyncState}
      requestResetState={initialAsyncState}
      loginRedirect='/'
      history={getHistory()}
      hideLoginModal={() => {}}
      login={getLoginSuccessFunction()}
      requestReset={requestResetSuccessFunction()}
      getMe={getMe}
      hideHeaderFooter={hideHeaderFooter}/>
  );

  expect(getByText('Sign in')).toBeTruthy();
});

it('Login shows form on sign in click', () => {
  const {getByText, getByTestId} = render(
    <Login
      loginState={initialAsyncState}
      meState={initialAsyncState}
      requestResetState={initialAsyncState}
      loginRedirect='/'
      history={getHistory()}
      hideLoginModal={() => {}}
      login={getLoginSuccessFunction()}
      requestReset={requestResetSuccessFunction()}
      getMe={getMe}
      hideHeaderFooter={hideHeaderFooter}/>
  );
  fireEvent.click(getByText('Sign in'));

  expect(getByTestId('test-login-form')).toBeTruthy();
});
