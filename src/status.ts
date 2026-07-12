export interface StatusMeta {
  icon: string;
  color: string;
}

export const STATUS_META: Record<string, StatusMeta> = {
  created: { icon: "mdi:package-variant-closed", color: "var(--disabled-text-color)" },
  taken_in_charge: { icon: "mdi:hand-back-right-outline", color: "var(--info-color)" },
  in_transit: { icon: "mdi:truck-fast-outline", color: "var(--info-color)" },
  at_sorting_center: { icon: "mdi:warehouse", color: "var(--info-color)" },
  out_for_delivery: { icon: "mdi:truck-delivery-outline", color: "var(--info-color)" },
  delivered: { icon: "mdi:package-variant-closed-check", color: "var(--success-color)" },
  delayed: { icon: "mdi:clock-alert-outline", color: "var(--warning-color)" },
  incident: { icon: "mdi:alert-circle-outline", color: "var(--error-color)" },
  returned_to_sender: { icon: "mdi:keyboard-return", color: "var(--error-color)" },
};

export const DEFAULT_STATUS_META: StatusMeta = {
  icon: "mdi:package-variant",
  color: "var(--disabled-text-color)",
};

const GLOBAL_COUNTER_ICONS: Record<string, string> = {
  parcels_active: "mdi:truck-fast-outline",
  parcels_delivered: "mdi:package-variant-closed-check",
  parcels_waiting: "mdi:package-variant-closed",
  parcels_today: "mdi:calendar-check-outline",
  parcels_late: "mdi:clock-alert-outline",
};

const GLOBAL_COUNTER_COLORS: Record<string, string> = {
  parcels_active: "var(--info-color)",
  parcels_delivered: "var(--success-color)",
  parcels_waiting: "var(--disabled-text-color)",
  parcels_today: "var(--success-color)",
  parcels_late: "var(--warning-color)",
};

export const GLOBAL_COUNTER_TRANSLATION_KEYS = Object.keys(GLOBAL_COUNTER_ICONS);

export function globalCounterIcon(translationKey: string): string {
  return GLOBAL_COUNTER_ICONS[translationKey] ?? "mdi:counter";
}

export function globalCounterColor(translationKey: string): string {
  return GLOBAL_COUNTER_COLORS[translationKey] ?? "var(--disabled-text-color)";
}
