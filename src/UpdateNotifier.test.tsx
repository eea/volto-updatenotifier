import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import UpdateNotifier from './UpdateNotifier';
import { IntlProvider } from 'react-intl';

const mockStore = configureStore([]);

describe('UpdateNotifier', () => {
  it('renders without crashing', () => {
    const store = mockStore({
      userSession: { token: null },
    });
    render(
      <Provider store={store}>
        <IntlProvider locale="en">
          <UpdateNotifier />
        </IntlProvider>
      </Provider>,
    );
  });
});
