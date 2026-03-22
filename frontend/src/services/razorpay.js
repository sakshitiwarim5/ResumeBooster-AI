import { createPaymentOrder, verifyPayment } from './api'
import toast from 'react-hot-toast'

/**
 * Launches Razorpay checkout and verifies payment on success.
 * @param {string} analysisId
 * @param {function} onSuccess - called with updated analysis data
 */
export async function initiatePayment(analysisId, onSuccess) {
  let orderData
  try {
    orderData = await createPaymentOrder(analysisId)
  } catch (err) {
    toast.error(err.message || 'Could not create payment order.')
    return
  }

  const options = {
    key:         orderData.key_id,
    amount:      orderData.amount,
    currency:    orderData.currency,
    name:        'ResumeBooster',
    description: 'Unlock Full Resume Report',
    order_id:    orderData.order_id,
    theme:       { color: '#6366f1' },
    prefill: {
      name:  '',
      email: '',
    },
    handler: async (response) => {
      const toastId = toast.loading('Verifying payment…')
      try {
        const result = await verifyPayment({
          analysis_id:          analysisId,
          razorpay_order_id:    response.razorpay_order_id,
          razorpay_payment_id:  response.razorpay_payment_id,
          razorpay_signature:   response.razorpay_signature,
        })
        toast.success('Premium unlocked! 🎉', { id: toastId })
        onSuccess(result.data)
      } catch (err) {
        toast.error(err.message || 'Payment verification failed.', { id: toastId })
      }
    },
    modal: {
      ondismiss: () => toast('Payment cancelled.', { icon: '👋' }),
    },
  }

  if (!window.Razorpay) {
    toast.error('Razorpay SDK not loaded. Check your internet connection.')
    return
  }

  const rzp = new window.Razorpay(options)
  rzp.on('payment.failed', (response) => {
    toast.error(`Payment failed: ${response.error.description}`)
  })
  rzp.open()
}
