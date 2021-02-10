import React from 'react';
import {render} from '@testing-library/react';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from '../../redux/configureStore';
import '../../i18n';

let store = null;

beforeEach(() => {
  store = configureStore({});
})

it.skip('App renders without crashing', () => {
  const {getByTestId} = render(
    <Provider store={store}>
      <Router>
        <App logout={() => {}}/>
      </Router>
    </Provider>
  );

  expect(getByTestId('test-app')).toBeTruthy();
});
