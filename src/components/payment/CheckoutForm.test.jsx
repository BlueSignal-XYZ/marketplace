import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';

// Mock all external dependencies before importing the component
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() =>
    Promise.resolve({
      elements: vi.fn(),
      confirmPayment: vi.fn(),
    })
  ),
}));

vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }) => <div data-testid="stripe-elements">{children}</div>,
  PaymentElement: () => <div data-testid="payment-element">PaymentElement</div>,
  useStripe: () => null,
  useElements: () => null,
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

vi.mock('./Spinner', () => ({ default: () => <span>Loading...</span> }));
vi.mock('./OrderConfirmation', () => ({ unitToString: (v) => `$${(v / 100).toFixed(2)}` }));
vi.mock('./data', () => ({
  presaleProducer: { producer: 'prod1', verifier: 'ver1', type: 'nitrogen' },
}));
vi.mock('../shared/button/Button', () => ({
  ButtonPrimary: ({ children, disabled, ...props }) => (
    <button data-testid="pay-button" disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));
vi.mock('../../scripts/back_door', () => ({
  NPCCreditsAPI: { buyCredits: vi.fn() },
}));
vi.mock('../../context/AppContext', () => ({
  useAppContext: () => ({
    STATES: { user: { uid: 'test-uid' } },
    ACTIONS: {},
  }),
}));
// Mock fetchWithTimeout for the outer CheckoutForm component
const mockFetchWithTimeout = vi.fn();
vi.mock('../../utils/fetchWithTimeout', () => ({
  fetchWithTimeout: (...args) => mockFetchWithTimeout(...args),
}));

vi.mock('../../../configs', () => ({
  default: { server_url: 'http://localhost:5001' },
}));

import CheckoutForm from './CheckoutForm';
import { loadStripe } from '@stripe/stripe-js';
import { ThemeProvider } from 'styled-components';

const theme = {
  colors: {
    ui800: '#1F2937',
    primary600: '#0E8D8F',
  },
};

const renderWithTheme = (ui) => render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('CheckoutForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchWithTimeout.mockResolvedValue({
      json: () => Promise.resolve({ publishableKey: 'pk_test_123' }),
    });
  });

  it('should render nothing when item is null', () => {
    const { container } = renderWithTheme(<CheckoutForm item={null} />);
    // Only the ThemeProvider wrapper should be present
    expect(container.querySelector('[data-testid="stripe-elements"]')).toBeNull();
  });

  it('should render nothing when item is undefined', () => {
    const { container } = renderWithTheme(<CheckoutForm item={undefined} />);
    expect(container.querySelector('[data-testid="stripe-elements"]')).toBeNull();
  });

  it('should fetch stripe config on mount', async () => {
    renderWithTheme(<CheckoutForm item={{ payAmount: 100, item: { currency: 'usd' } }} />);

    await vi.waitFor(() => {
      expect(mockFetchWithTimeout).toHaveBeenCalledWith(
        'http://localhost:5001/stripe/config',
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  it('should call loadStripe with the publishable key', async () => {
    renderWithTheme(<CheckoutForm item={{ payAmount: 5000, item: { currency: 'usd' } }} />);

    await vi.waitFor(() => {
      expect(loadStripe).toHaveBeenCalledWith('pk_test_123');
    });
  });

  it('should create payment intent when stripe is loaded and amount >= 50', async () => {
    mockFetchWithTimeout
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ publishableKey: 'pk_test_123' }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ payment_intent: { clientSecret: 'cs_test_secret' } }),
      });

    renderWithTheme(<CheckoutForm item={{ payAmount: 5000, item: { currency: 'usd' } }} />);

    await vi.waitFor(() => {
      expect(mockFetchWithTimeout).toHaveBeenCalledTimes(2);
    });

    expect(mockFetchWithTimeout).toHaveBeenCalledWith(
      'http://localhost:5001/stripe/create/payment_intent',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"amount":5000'),
      })
    );
  });

  it('should not create payment intent when amount < 50', async () => {
    mockFetchWithTimeout.mockResolvedValueOnce({
      json: () => Promise.resolve({ publishableKey: 'pk_test_123' }),
    });

    renderWithTheme(<CheckoutForm item={{ payAmount: 30, item: { currency: 'usd' } }} />);

    await vi.waitFor(() => {
      expect(mockFetchWithTimeout).toHaveBeenCalledTimes(1);
    });

    await new Promise((r) => setTimeout(r, 100));
    expect(mockFetchWithTimeout).toHaveBeenCalledTimes(1);
  });

  it('should include correct content-type header in payment intent request', async () => {
    mockFetchWithTimeout
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ publishableKey: 'pk_test_123' }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ payment_intent: { clientSecret: 'cs_test' } }),
      });

    renderWithTheme(<CheckoutForm item={{ payAmount: 5000, item: { currency: 'usd' } }} />);

    await vi.waitFor(() => {
      expect(mockFetchWithTimeout).toHaveBeenCalledTimes(2);
    });

    const paymentIntentCall = mockFetchWithTimeout.mock.calls[1];
    expect(paymentIntentCall[1].headers).toEqual(
      expect.objectContaining({ 'Content-Type': 'application/json' })
    );
  });
});
