import apiClient from './apiClient'

export async function createRazorpayOrder(bookingId) {
  const { data } = await apiClient.post('/api/payments/razorpay/create-order', { bookingId })
  return data // { paymentId, razorpayOrderId, amountInPaise, currency, keyId, bookingId, hallName, customerName, customerEmail, customerPhone }
}

export async function verifyRazorpayPayment({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  const { data } = await apiClient.post('/api/payments/razorpay/verify', {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  })
  return data // { payment, otp, otpValidityMinutes }
}

export async function confirmPaymentOtp(paymentId, otp) {
  const { data } = await apiClient.post(`/api/payments/${paymentId}/confirm-otp`, { otp })
  return data
}

// Opens Razorpay's hosted checkout modal (UPI/GPay/PayTM/cards/netbanking all
// built in). Resolves with the gateway's response on success, rejects on
// cancel/failure. Assumes checkout.js is loaded via a <script> tag in index.html.
export function openRazorpayCheckout(order) {
  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error('Payment gateway failed to load. Please refresh and try again.'))
      return
    }

    const options = {
      key: order.keyId,
      amount: order.amountInPaise,
      currency: order.currency,
      name: 'Mangala Arangam',
      description: `Booking for ${order.hallName}`,
      order_id: order.razorpayOrderId,
      prefill: {
        name: order.customerName,
        email: order.customerEmail,
        contact: order.customerPhone,
      },
      theme: { color: '#7A1B3D' },
      handler: (response) => resolve(response),
      modal: {
        ondismiss: () => reject(new Error('Payment was cancelled.')),
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', (response) => reject(new Error(response.error?.description || 'Payment failed.')))
    rzp.open()
  })
}
