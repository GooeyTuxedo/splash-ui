export type OfferHash = string;

export interface OfferHashRequest {
  offer: OfferHash;
}

export interface OfferData {
  isValid: boolean;
  offered: Record<string, number>;
  fees: number;
  requested: Record<string, number>;
  offerHash: OfferHash;
}
