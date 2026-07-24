export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

export interface HassEntityRegistryEntry {
  entity_id: string;
  platform: string;
  translation_key?: string;
  unique_id: string;
}

export interface HomeAssistantLike {
  states: Record<string, HassEntity>;
  entities: Record<string, HassEntityRegistryEntry>;
  formatEntityState?: (stateObj: HassEntity) => string;
  localize?: (key: string) => string;
  callService: <T = unknown>(
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: undefined,
    notifyOnError?: boolean,
    returnResponse?: boolean,
  ) => Promise<{ response?: T } | undefined>;
}

export interface HistoryEntry {
  date: string | null;
  label: string | null;
  location: string | null;
}

export interface ParcelAttributes {
  parcel_id: string;
  tracking_number: string;
  carrier: string;
  notes: string;
  notify_target: string;
  history: HistoryEntry[];
  estimated_delivery: string | null;
  last_location: string | null;
  last_update: string | null;
  tracking_url: string | null;
  days_since_shipping: number | null;
  last_error: string | null;
}

export interface ParcelTrackerCardConfig {
  type: string;
  title?: string;
  editable?: boolean;
}
