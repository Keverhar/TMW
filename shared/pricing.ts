// Centralized pricing configuration for Wedding Composer
// All prices are in cents

export const PRICING = {
  // Base package prices by event type
  basePackages: {
    'modest-wedding': 500000, // $5,000
    'modest-elopement': 100000, // $1,000
    'vow-renewal': 100000, // $1,000
    'other': 500000, // $5,000
  },

  // Add-on prices
  addons: {
    photoBook: 30000, // $300 per book
    extraTime: 100000, // $1,000
    byobBar: 40000, // $400
    rehearsal: 15000, // $150
  },

  // Payment discounts (in cents)
  discounts: {
    ach: 5000, // $50 discount for ACH payment
    affirm: 0, // No discount for Affirm payment
    echeck: 5000, // $50 discount for E-Check payment
    paypal: 0, // No discount for PayPal payment
    venmo: 0, // No discount for Venmo payment
  },
} as const;

// Helper function to get base package price
export function getBasePackagePrice(eventType: string): number {
  return PRICING.basePackages[eventType as keyof typeof PRICING.basePackages] || PRICING.basePackages['modest-wedding'];
}

// Helper function to get addon price
export function getAddonPrice(addonType: 'photoBook' | 'extraTime' | 'byobBar' | 'rehearsal'): number {
  return PRICING.addons[addonType];
}

// Helper function to get payment discount
export function getPaymentDiscount(paymentMethod: string): number {
  if (paymentMethod === 'ach') return PRICING.discounts.ach;
  if (paymentMethod === 'affirm') return PRICING.discounts.affirm;
  if (paymentMethod === 'echeck') return PRICING.discounts.echeck;
  if (paymentMethod === 'paypal') return PRICING.discounts.paypal;
  if (paymentMethod === 'venmo') return PRICING.discounts.venmo;
  return 0;
}
