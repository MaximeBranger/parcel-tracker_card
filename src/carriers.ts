export interface CarrierOption {
  value: string;
  label: string;
}

// Mirrors ALL_CARRIERS / CARRIER_LABELS in the parcel_tracker integration's const.py.
export const CARRIERS: CarrierOption[] = [
  { value: "laposte", label: "La Poste" },
  { value: "fedex", label: "FedEx" },
  { value: "dhl", label: "DHL" },
  { value: "ups", label: "UPS" },
  { value: "mondial_relay", label: "Mondial Relay" },
  { value: "postnord", label: "PostNord" },
  { value: "dpd", label: "DPD" },
];
