export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

export interface HassEntityRegistryEntry {
  entity_id: string;
  platform: string;
  translation_key?: string;
}

export interface HomeAssistantLike {
  states: Record<string, HassEntity>;
  entities: Record<string, HassEntityRegistryEntry>;
  formatEntityState?: (stateObj: HassEntity) => string;
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
}

export interface ParcelTrackerCardConfig {
  type: string;
  title?: string;
}
