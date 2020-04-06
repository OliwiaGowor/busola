import React from 'react';
import { render, wait } from '@testing-library/react';

import {
  withApolloMockProvider,
  lambdaMock,
} from 'components/Lambdas/helpers/testing';
import { createSubscriberRef } from 'components/Lambdas/helpers/eventTriggers';
import {
  GET_EVENT_ACTIVATIONS_ERROR_MOCK,
  GET_EVENT_ACTIVATIONS_DATA_MOCK,
  GET_EVENT_TRIGGERS_ERROR_MOCK,
  GET_EVENT_TRIGGERS_DATA_MOCK,
  EVENT_TRIGGER_EVENT_SUBSCRIPTION_MOCK,
} from 'components/Lambdas/gql/hooks/queries/testMocks';
import { ERRORS, EVENT_TRIGGERS_PANEL } from 'components/Lambdas/constants';

import EventTriggersWrapper from '../EventTriggersWrapper';

jest.mock('@kyma-project/luigi-client', () => {
  return {
    linkManager: () => ({
      navigate: () => {},
    }),
    uxManager: () => ({
      addBackdrop: () => {},
      removeBackdrop: () => {},
    }),
  };
});

describe('EventTriggersWrapper + EventTriggers', () => {
  const eventTriggersVariables = {
    subscriber: createSubscriberRef(lambdaMock),
    namespace: lambdaMock.namespace,
  };
  const eventActivationsVariables = {
    namespace: lambdaMock.namespace,
  };
  const subscriptionMock = EVENT_TRIGGER_EVENT_SUBSCRIPTION_MOCK(
    eventTriggersVariables,
  );

  it('should render Spinner', async () => {
    const { getByLabelText } = render(
      withApolloMockProvider({
        component: <EventTriggersWrapper lambda={lambdaMock} />,
        mocks: [subscriptionMock],
      }),
    );

    expect(getByLabelText('Loading')).toBeInTheDocument();
    await wait();
  });

  // TODO: Investigate why it fails on CI, but locally always passes
  // it('should render server error message - by eventActivations query', async () => {
  //   const { getByText } = render(
  //     withApolloMockProvider({
  //       component: <EventTriggersWrapper lambda={lambdaMock} />,
  //       mocks: [
  //         subscriptionMock,
  //         GET_EVENT_ACTIVATIONS_ERROR_MOCK(eventActivationsVariables),
  //         GET_EVENT_TRIGGERS_DATA_MOCK(eventTriggersVariables),
  //       ],
  //     }),
  //   );

  //   await wait(() => {
  //     expect(getByText(ERRORS.SERVER)).toBeInTheDocument();
  //   });
  // });

  // TODO: Investigate why it fails on CI, but locally always passes
  // it('should render server error message - by eventTriggers query', async () => {
  //   const { getByText } = render(
  //     withApolloMockProvider({
  //       component: <EventTriggersWrapper lambda={lambdaMock} />,
  //       mocks: [
  //         subscriptionMock,
  //         GET_EVENT_ACTIVATIONS_DATA_MOCK(eventActivationsVariables),
  //         GET_EVENT_TRIGGERS_ERROR_MOCK(eventTriggersVariables),
  //       ],
  //     }),
  //   );

  //   await wait(() => {
  //     expect(getByText(ERRORS.SERVER)).toBeInTheDocument();
  //   });
  // });

  it('should render table', async () => {
    const { getByText, queryByRole, queryAllByRole } = render(
      withApolloMockProvider({
        component: <EventTriggersWrapper lambda={lambdaMock} />,
        mocks: [
          subscriptionMock,
          GET_EVENT_ACTIVATIONS_DATA_MOCK(eventActivationsVariables),
          GET_EVENT_TRIGGERS_DATA_MOCK(eventTriggersVariables),
        ],
      }),
    );

    await wait(() => {
      expect(getByText(EVENT_TRIGGERS_PANEL.LIST.TITLE)).toBeInTheDocument();
      const table = queryByRole('table');
      expect(table).toBeInTheDocument();
      expect(queryAllByRole('row')).toHaveLength(2); // header + 1 element;
    });
  });
});