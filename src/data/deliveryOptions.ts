export interface DeliveryOption {
  id: 'lagos_doorstep' | 'interstate_hub' | 'interstate_doorstep';
  title: string;
  price: number;
  minPrice: number;
  maxPrice: number;
  carrierText: string;
  badge: string;
  isLagosOnly?: boolean;
  isInterstateOnly?: boolean;
}

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: 'lagos_doorstep',
    title: 'Door step delivery within Lagos',
    price: 2500, // Midpoint for N2,000 to N3,000 range
    minPrice: 2000,
    maxPrice: 3000,
    carrierText: 'Registered dispatch riders',
    badge: 'Lagos Only',
    isLagosOnly: true,
  },
  {
    id: 'interstate_hub',
    title: 'Interstate delivery (Hub to Hub)',
    price: 5000, // Midpoint for N4,000 to N6,000 range
    minPrice: 4000,
    maxPrice: 6000,
    carrierText: 'Registered waybill with Interstate transporter',
    badge: 'Hub to Hub',
    isInterstateOnly: true,
  },
  {
    id: 'interstate_doorstep',
    title: 'Interstate + Door step delivery',
    price: 6500, // Midpoint for N5,500 to N8,000 range
    minPrice: 5500,
    maxPrice: 8000,
    carrierText: 'Registered Waybill with Interstate transporter + dispatch rider',
    badge: 'Interstate + Doorstep',
    isInterstateOnly: true,
  },
];

export const getDeliveryOptionsForState = (stateName: string): DeliveryOption[] => {
  const isLagos = stateName.trim().toLowerCase() === 'lagos';
  if (isLagos) {
    return DELIVERY_OPTIONS.filter((opt) => opt.isLagosOnly || (!opt.isLagosOnly && !opt.isInterstateOnly));
  }
  return DELIVERY_OPTIONS.filter((opt) => opt.isInterstateOnly || (!opt.isLagosOnly && !opt.isInterstateOnly));
};
