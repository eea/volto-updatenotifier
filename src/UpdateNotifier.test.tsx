import React from 'react';
import { render, act, fireEvent, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import UpdateNotifier from './UpdateNotifier';
import { IntlProvider } from 'react-intl';
import superagent from 'superagent';
import { toast } from 'react-toastify';

const mockStore = configureStore([]);

// Mock superagent
jest.mock('superagent', () => ({
  get: jest.fn(),
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    info: jest.fn(),
    isActive: jest.fn(),
  },
}));

// Mock Toast to be more flexible than the real one
jest.mock('@plone/volto/components', () => {
  const actual = jest.requireActual('@plone/volto/components');
  return {
    ...actual,
    Toast: ({ title, content }) => (
      <div className="toast">
        {title && <h1>{title}</h1>}
        <div className="content">{content}</div>
      </div>
    ),
  };
});

// Mock window.location.reload
const originalLocation = window.location;
beforeAll(() => {
  // @ts-ignore
  delete window.location;
  window.location = { ...originalLocation, reload: jest.fn() };
});

afterAll(() => {
  window.location = originalLocation;
});

describe('UpdateNotifier', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      userSession: { token: null },
    });
    jest.clearAllMocks();
    jest.useFakeTimers();
    (toast.isActive as jest.Mock).mockReturnValue(false);
  });

  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });

  it('calls superagent on mount and sets initial version without showing toast', async () => {
    const mockResponse = { text: 'v1' };
    (superagent.get as jest.Mock).mockReturnValue(Promise.resolve(mockResponse));

    await act(async () => {
      render(
        <Provider store={store}>
          <IntlProvider locale="en">
            <UpdateNotifier />
          </IntlProvider>
        </Provider>,
      );
    });

    expect(superagent.get).toHaveBeenCalledWith(
      expect.stringContaining('/__frontend-version'),
    );
    expect(toast.info).not.toHaveBeenCalled();
  });

  it('shows toast when version changes', async () => {
    let mockResponse = { text: 'v1' };
    (superagent.get as jest.Mock).mockReturnValue(Promise.resolve(mockResponse));

    let component;
    await act(async () => {
      component = render(
        <Provider store={store}>
          <IntlProvider locale="en">
            <UpdateNotifier interval={1000} />
          </IntlProvider>
        </Provider>,
      );
    });

    // Second call with different version
    mockResponse = { text: 'v2' };
    (superagent.get as jest.Mock).mockReturnValue(Promise.resolve(mockResponse));

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(toast.info).toHaveBeenCalled();
    expect(toast.info).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ toastId: 'update-notifier' }),
    );
    component.unmount();
  });

  it('includes authenticated warning when token is present', async () => {
    store = mockStore({
      userSession: { token: 'some-token' },
    });

    let mockResponse = { text: 'v1' };
    (superagent.get as jest.Mock).mockReturnValue(Promise.resolve(mockResponse));

    let component;
    await act(async () => {
      component = render(
        <Provider store={store}>
          <IntlProvider locale="en">
            <UpdateNotifier interval={1000} />
          </IntlProvider>
        </Provider>,
      );
    });

    mockResponse = { text: 'v2' };
    (superagent.get as jest.Mock).mockReturnValue(Promise.resolve(mockResponse));

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(toast.info).toHaveBeenCalled();
    const toastCall = (toast.info as jest.Mock).mock.calls[0][0];
    const { getByText } = render(<IntlProvider locale="en">{toastCall}</IntlProvider>);

    expect(
      getByText(/If you are currently editing a page, please save your changes/i),
    ).toBeDefined();
    component.unmount();
  });

  it('reloads the page when reload button is clicked', async () => {
    let mockResponse = { text: 'v1' };
    (superagent.get as jest.Mock).mockReturnValue(Promise.resolve(mockResponse));

    let component;
    await act(async () => {
      component = render(
        <Provider store={store}>
          <IntlProvider locale="en">
            <UpdateNotifier interval={1000} />
          </IntlProvider>
        </Provider>,
      );
    });

    mockResponse = { text: 'v2' };
    (superagent.get as jest.Mock).mockReturnValue(Promise.resolve(mockResponse));

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    const toastCall = (toast.info as jest.Mock).mock.calls[0][0];
    const { getByText } = render(<IntlProvider locale="en">{toastCall}</IntlProvider>);

    const reloadButton = getByText('Reload');
    fireEvent.click(reloadButton);

    expect(window.location.reload).toHaveBeenCalled();
    component.unmount();
  });

  it('does not show another toast if one is already active', async () => {
    let mockResponse = { text: 'v1' };
    (superagent.get as jest.Mock).mockReturnValue(Promise.resolve(mockResponse));

    let component;
    await act(async () => {
      component = render(
        <Provider store={store}>
          <IntlProvider locale="en">
            <UpdateNotifier interval={1000} />
          </IntlProvider>
        </Provider>,
      );
    });

    // Version changes, show first toast
    mockResponse = { text: 'v2' };
    (superagent.get as jest.Mock).mockReturnValue(Promise.resolve(mockResponse));
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    // It might be called twice if checkVersion runs on mount and then timer triggers.
    // We expect at least 1 call.
    expect(toast.info).toHaveBeenCalled();
    const initialCalls = (toast.info as jest.Mock).mock.calls.length;

    // Toast is now active
    (toast.isActive as jest.Mock).mockReturnValue(true);

    // Version changes again, should not show new toast
    mockResponse = { text: 'v3' };
    (superagent.get as jest.Mock).mockReturnValue(Promise.resolve(mockResponse));
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(toast.info).toHaveBeenCalledTimes(initialCalls);
    component.unmount();
  });
});
