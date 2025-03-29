// Mock implementation for msal-react
import jest from 'jest-mock';

const msalReactMock = {
  useMsal: () => ({
    instance: {
      loginPopup: jest.fn(),
      logout: jest.fn(),
      acquireTokenSilent: jest.fn(),
    },
    accounts: [{ username: 'test' }],
    inProgress: false,
  }),
  useAccount: jest.fn(),
  useIsAuthenticated: jest.fn(() => true),
};

export default msalReactMock;
