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

export interface HassEvent<T = Record<string, unknown>> {
  event_type: string;
  data: T;
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
  connection: {
    subscribeEvents: <T = Record<string, unknown>>(
      callback: (event: HassEvent<T>) => void,
      eventType: string,
    ) => Promise<() => void>;
  };
}

export interface ParcelAttributes {
  tracking_number: string;
  carrier: string;
  notes: string;
  history: unknown[];
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
