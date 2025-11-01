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

  // Payment discounts by event type (in cents)
  discounts: {
    wedding: {
      ach: 10000, // $100 discount for ACH payment on weddings
      affirm: 0, // No discount for Affirm payment
      echeck: 10000, // $100 discount for E-Check payment on weddings
      paypal: 0, // No discount for PayPal payment
      venmo: 0, // No discount for Venmo payment
    },
    elopement: {
      ach: 3000, // $30 discount for ACH payment on elopements/vow renewals
      affirm: 0, // No discount for Affirm payment
      echeck: 3000, // $30 discount for E-Check payment on elopements/vow renewals
      paypal: 0, // No discount for PayPal payment
      venmo: 0, // No discount for Venmo payment
    },
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

// Helper function to get payment discount based on event type and payment method
export function getPaymentDiscount(paymentMethod: string, eventType: string): number {
  // Determine if it's a wedding or elopement/vow renewal
  const isWedding = eventType === 'modest-wedding' || eventType === 'other';
  const discountCategory = isWedding ? PRICING.discounts.wedding : PRICING.discounts.elopement;
  
  if (paymentMethod === 'ach') return discountCategory.ach;
  if (paymentMethod === 'affirm') return discountCategory.affirm;
  if (paymentMethod === 'echeck') return discountCategory.echeck;
  if (paymentMethod === 'paypal') return discountCategory.paypal;
  if (paymentMethod === 'venmo') return discountCategory.venmo;
  return 0;
}
