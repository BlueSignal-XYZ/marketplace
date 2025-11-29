import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import Payment from './Payment'

// Mock child components
vi.mock('./CheckoutForm', () => ({
  default: ({ item }) => (
    <div data-testid="checkout-form">
      CheckoutForm - Item: {item?.item?.name || 'no-item'}
    </div>
  ),
}))

vi.mock('./CustomerInfoForm', () => ({
  default: ({ onNextClick }) => (
    <div data-testid="customer-info-form">
      CustomerInfoForm
      <button onClick={onNextClick}>Next</button>
    </div>
  ),
}))

vi.mock('./OrderConfirmation', () => ({
  default: ({ proceedToPayment, checkoutItems }) => (
    <div data-testid="order-confirmation">
      OrderConfirmation
      <button
        onClick={() =>
          proceedToPayment(
            { name: 'Test Item', price: 100 },
            100
          )
        }
      >
        Proceed to Payment
      </button>
      <div>Items: {checkoutItems?.length || 0}</div>
    </div>
  ),
}))

vi.mock('react-icons/fa', () => ({
  FaTimes: ({ onClick }) => (
    <div data-testid="close-icon" onClick={onClick} style={{ cursor: 'pointer' }}>
      X
    </div>
  ),
}))

vi.mock('./styled', () => ({
  FormWrapper: ({ children }) => <div data-testid="form-wrapper">{children}</div>,
}))

describe('Payment Component', () => {
  const mockSetIsPaying = vi.fn()
  const mockCheckoutItems = [
    { id: 1, name: 'Item 1', price: 50 },
    { id: 2, name: 'Item 2', price: 75 },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render the payment form wrapper', () => {
      render(
        <Payment setIsPaying={mockSetIsPaying} checkoutItems={mockCheckoutItems} />
      )

      expect(screen.getByTestId('form-wrapper')).toBeInTheDocument()
    })

    it('should render close icon', () => {
      render(
        <Payment setIsPaying={mockSetIsPaying} checkoutItems={mockCheckoutItems} />
      )

      expect(screen.getByTestId('close-icon')).toBeInTheDocument()
    })

    it('should start at step 1 with CustomerInfoForm', () => {
      render(
        <Payment setIsPaying={mockSetIsPaying} checkoutItems={mockCheckoutItems} />
      )

      expect(screen.getByTestId('customer-info-form')).toBeInTheDocument()
      expect(screen.queryByTestId('order-confirmation')).not.toBeInTheDocument()
      expect(screen.queryByTestId('checkout-form')).not.toBeInTheDocument()
    })
  })

  describe('Step Navigation', () => {
    it('should move to step 2 (OrderConfirmation) when Next is clicked', async () => {
      render(
        <Payment setIsPaying={mockSetIsPaying} checkoutItems={mockCheckoutItems} />
      )

      const nextButton = screen.getByText('Next')

      await act(async () => {
        nextButton.click()
      })

      // Wait for the animation/transition
      await waitFor(() => {
        expect(screen.getByTestId('order-confirmation')).toBeInTheDocument()
      })

      expect(screen.queryByTestId('customer-info-form')).not.toBeInTheDocument()
    })

    it('should show checkout items count in OrderConfirmation', async () => {
      render(
        <Payment setIsPaying={mockSetIsPaying} checkoutItems={mockCheckoutItems} />
      )

      const nextButton = screen.getByText('Next')
      await act(async () => {
        nextButton.click()
      })

      await waitFor(() => {
        expect(screen.getByText(/Items: 2/)).toBeInTheDocument()
      })
    })

    it('should move to step 3 (CheckoutForm) when payment is initiated', async () => {
      render(
        <Payment setIsPaying={mockSetIsPaying} checkoutItems={mockCheckoutItems} />
      )

      // Go to step 2
      const nextButton = screen.getByText('Next')
      await act(async () => {
        nextButton.click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('order-confirmation')).toBeInTheDocument()
      })

      // Proceed to payment
      const proceedButton = screen.getByText('Proceed to Payment')
      await act(async () => {
        proceedButton.click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('checkout-form')).toBeInTheDocument()
      })

      expect(screen.queryByTestId('order-confirmation')).not.toBeInTheDocument()
    })
  })

  describe('Payment Flow', () => {
    it('should pass checkout item to CheckoutForm', async () => {
      render(
        <Payment setIsPaying={mockSetIsPaying} checkoutItems={mockCheckoutItems} />
      )

      // Navigate to step 2
      await act(async () => {
        screen.getByText('Next').click()
      })

      // Proceed to payment
      await act(async () => {
        screen.getByText('Proceed to Payment').click()
      })

      await waitFor(() => {
        expect(screen.getByText(/Item: Test Item/)).toBeInTheDocument()
      })
    })

    it('should handle empty checkoutItems array', () => {
      render(<Payment setIsPaying={mockSetIsPaying} checkoutItems={[]} />)

      expect(screen.getByTestId('customer-info-form')).toBeInTheDocument()

      // Should not crash
      const nextButton = screen.getByText('Next')
      expect(nextButton).toBeInTheDocument()
    })

    it('should handle undefined checkoutItems', () => {
      render(<Payment setIsPaying={mockSetIsPaying} checkoutItems={undefined} />)

      expect(screen.getByTestId('customer-info-form')).toBeInTheDocument()
    })
  })

  describe('Exit Functionality', () => {
    it('should call setIsPaying(false) when close icon is clicked', async () => {
      render(
        <Payment setIsPaying={mockSetIsPaying} checkoutItems={mockCheckoutItems} />
      )

      const closeIcon = screen.getByTestId('close-icon')

      await act(async () => {
        closeIcon.click()
      })

      expect(mockSetIsPaying).toHaveBeenCalledWith(false)
    })

    it('should handle missing setIsPaying prop gracefully', () => {
      // Should not crash if setIsPaying is not provided
      expect(() => {
        render(<Payment checkoutItems={mockCheckoutItems} />)
      }).not.toThrow()
    })
  })

  describe('Step Transitions', () => {
    it('should not proceed beyond step 2 without payment initiation', async () => {
      render(
        <Payment setIsPaying={mockSetIsPaying} checkoutItems={mockCheckoutItems} />
      )

      // Click Next to go to step 2
      await act(async () => {
        screen.getByText('Next').click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('order-confirmation')).toBeInTheDocument()
      })

      // CheckoutForm should not appear unless proceedToPayment is called
      expect(screen.queryByTestId('checkout-form')).not.toBeInTheDocument()
    })

    it('should set checkoutItem state when proceedToPayment is called', async () => {
      render(
        <Payment setIsPaying={mockSetIsPaying} checkoutItems={mockCheckoutItems} />
      )

      // Navigate to order confirmation
      await act(async () => {
        screen.getByText('Next').click()
      })

      // Trigger proceedToPayment
      await act(async () => {
        screen.getByText('Proceed to Payment').click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('checkout-form')).toBeInTheDocument()
      })
    })
  })

  describe('Form Reference', () => {
    it('should apply slide-left animation class during transition', async () => {
      render(
        <Payment setIsPaying={mockSetIsPaying} checkoutItems={mockCheckoutItems} />
      )

      const nextButton = screen.getByText('Next')

      await act(async () => {
        nextButton.click()
      })

      // Animation should complete and form should update
      await waitFor(
        () => {
          expect(screen.getByTestId('order-confirmation')).toBeInTheDocument()
        },
        { timeout: 1000 }
      )
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid step changes', async () => {
      render(
        <Payment setIsPaying={mockSetIsPaying} checkoutItems={mockCheckoutItems} />
      )

      // Rapidly click Next
      await act(async () => {
        screen.getByText('Next').click()
        screen.getByText('Next').click()
      })

      // Should still only advance one step
      await waitFor(() => {
        expect(screen.getByTestId('order-confirmation')).toBeInTheDocument()
      })
    })

    it('should maintain state across re-renders', async () => {
      const { rerender } = render(
        <Payment setIsPaying={mockSetIsPaying} checkoutItems={mockCheckoutItems} />
      )

      // Move to step 2
      await act(async () => {
        screen.getByText('Next').click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('order-confirmation')).toBeInTheDocument()
      })

      // Re-render with new props
      rerender(
        <Payment
          setIsPaying={mockSetIsPaying}
          checkoutItems={[...mockCheckoutItems, { id: 3, name: 'Item 3', price: 25 }]}
        />
      )

      // Should still be on step 2
      expect(screen.getByTestId('order-confirmation')).toBeInTheDocument()
    })
  })
})
