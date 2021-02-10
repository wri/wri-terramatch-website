import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import Navbar from './NavBar';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from '../../redux/configureStore';
import '../../i18n';

let store = null;

beforeEach(() => {
  store = configureStore({});
})

it.skip('Shows logout button if isAuthenticated and fires logout event on click', () => {
  const mockFunc = jest.fn();

  const {getByTestId} = render(
    <Provider store={store}>
      <Router>
        <Navbar logout={mockFunc} isAuthenticated={true}/>
      </Router>
    </Provider>
  );
  const button = getByTestId('test-navbar-logout');

  expect(button).toBeTruthy();

  fireEvent(
    button,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  );

  expect(mockFunc.mock.calls.length).toBe(1);
});

it.skip('Shows signin link if not isAuthenticated', () => {
  const mockFunc = jest.fn();

  const {getByText} = render(
    <Provider store={store}>
      <Router>
        <Navbar logout={mockFunc} isAuthenticated={false}/>
      </Router>
    </Provider>
  );

  const signinForm = getByText('Sign in');
  expect(signinForm).toBeTruthy();

});
