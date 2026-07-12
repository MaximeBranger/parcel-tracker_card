import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import {
  DEFAULT_STATUS_META,
  GLOBAL_COUNTER_TRANSLATION_KEYS,
  STATUS_META,
  globalCounterColor,
  globalCounterIcon,
} from "./status";
import type {
  HassEntity,
  HomeAssistantLike,
  ParcelAttributes,
  ParcelTrackerCardConfig,
} from "./types";

const PLATFORM = "parcel_tracker";
const PARCEL_TRANSLATION_KEY = "parcel";

declare global {
  interface HTMLElementTagNameMap {
    "parcel-tracker-card": ParcelTrackerCard;
  }
  interface Window {
    customCards: { type: string; name: string; description: string }[];
  }
}

function fireEvent(target: EventTarget, type: string, detail: unknown): void {
  target.dispatchEvent(
    new CustomEvent(type, { detail, bubbles: true, composed: true }),
  );
}

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return dateFormatter.format(date);
}

// Parcel entities aren't `has_entity_name`, but HA still prefixes the hub
// device's name onto their friendly_name. Strip it back off for display —
// the parcel's own name (e.g. "Leroy") is more useful here than "Parcel
// Tracker Leroy".
const DEVICE_NAME_PREFIX = "Parcel Tracker ";

function stripDevicePrefix(name: string): string {
  return name.startsWith(DEVICE_NAME_PREFIX) ? name.slice(DEVICE_NAME_PREFIX.length) : name;
}

@customElement("parcel-tracker-card")
export class ParcelTrackerCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistantLike;

  @state() private _config?: ParcelTrackerCardConfig;

  setConfig(config: ParcelTrackerCardConfig): void {
    this._config = config;
  }

  static getStubConfig(): ParcelTrackerCardConfig {
    return { type: "custom:parcel-tracker-card" };
  }

  getCardSize(): number {
    return 1 + this._parcelEntities().length;
  }

  private _entriesByTranslationKey(keys: Set<string> | null): HassEntity[] {
    const hass = this.hass;
    if (!hass) return [];
    const result: HassEntity[] = [];
    for (const entry of Object.values(hass.entities)) {
      if (entry.platform !== PLATFORM) continue;
      if (keys && !keys.has(entry.translation_key ?? "")) continue;
      const stateObj = hass.states[entry.entity_id];
      if (stateObj) result.push(stateObj);
    }
    return result;
  }

  private _globalCounters(): HassEntity[] {
    const keys = new Set(GLOBAL_COUNTER_TRANSLATION_KEYS);
    return this._entriesByTranslationKey(keys).sort(
      (a, b) => GLOBAL_COUNTER_TRANSLATION_KEYS.indexOf(this._translationKey(a)) -
        GLOBAL_COUNTER_TRANSLATION_KEYS.indexOf(this._translationKey(b)),
    );
  }

  private _translationKey(stateObj: HassEntity): string {
    return this.hass?.entities[stateObj.entity_id]?.translation_key ?? "";
  }

  private _parcelEntities(): HassEntity[] {
    const parcels = this._entriesByTranslationKey(new Set([PARCEL_TRANSLATION_KEY]));
    return parcels.sort((a, b) => {
      const aDelivered = a.state === "delivered";
      const bDelivered = b.state === "delivered";
      if (aDelivered !== bDelivered) return aDelivered ? 1 : -1;

      const aEta = (a.attributes as unknown as ParcelAttributes).estimated_delivery;
      const bEta = (b.attributes as unknown as ParcelAttributes).estimated_delivery;
      if (aEta && bEta && aEta !== bEta) return aEta < bEta ? -1 : 1;
      if (aEta && !bEta) return -1;
      if (!aEta && bEta) return 1;

      const aName = String(a.attributes.friendly_name ?? "");
      const bName = String(b.attributes.friendly_name ?? "");
      return aName.localeCompare(bName);
    });
  }

  private _formatState(stateObj: HassEntity): string {
    if (this.hass?.formatEntityState) {
      return this.hass.formatEntityState(stateObj);
    }
    return stateObj.state;
  }

  private _openMoreInfo(entityId: string): void {
    fireEvent(this, "hass-more-info", { entityId });
  }

  private _counterLabel(stateObj: HassEntity): string {
    const translationKey = this._translationKey(stateObj);
    const localized = this.hass?.localize?.(
      `component.${PLATFORM}.entity.sensor.${translationKey}.name`,
    );
    return localized || String(stateObj.attributes.friendly_name ?? stateObj.entity_id);
  }

  private _renderCounters() {
    const counters = this._globalCounters();
    if (counters.length === 0) return nothing;
    return html`<div class="counters">
      ${counters.map((stateObj) => {
        const color = globalCounterColor(this._translationKey(stateObj));
        return html`<div class="counter-tile">
          <div class="counter-icon" style="background: ${color}">
            <ha-icon icon=${globalCounterIcon(this._translationKey(stateObj))}></ha-icon>
          </div>
          <span class="counter-value">${stateObj.state}</span>
          <span class="counter-label">${this._counterLabel(stateObj)}</span>
        </div>`;
      })}
    </div>`;
  }

  private _renderParcelRow(stateObj: HassEntity) {
    const attrs = stateObj.attributes as unknown as ParcelAttributes;
    const meta = STATUS_META[stateObj.state] ?? DEFAULT_STATUS_META;
    const name = stripDevicePrefix(String(stateObj.attributes.friendly_name ?? stateObj.entity_id));

    let secondary = attrs.carrier;
    if (stateObj.state === "delivered") {
      const delivered = formatDate(attrs.last_update);
      if (delivered) secondary += ` · Livré le ${delivered}`;
    } else {
      const eta = formatDate(attrs.estimated_delivery);
      if (eta) {
        secondary += ` · Livraison estimée le ${eta}`;
      } else if (attrs.days_since_shipping !== null) {
        secondary += ` · Depuis ${attrs.days_since_shipping} j.`;
      }
    }

    return html`<div
      class="parcel-row"
      role="button"
      tabindex="0"
      @click=${() => this._openMoreInfo(stateObj.entity_id)}
      @keydown=${(ev: KeyboardEvent) => {
        if (ev.key === "Enter" || ev.key === " ") this._openMoreInfo(stateObj.entity_id);
      }}
    >
      <ha-icon icon=${meta.icon} style="color: ${meta.color}"></ha-icon>
      <div class="parcel-info">
        <span class="parcel-name">${name}</span>
        <span class="parcel-secondary">${secondary}</span>
      </div>
      <span class="parcel-status" style="background: ${meta.color}">${this._formatState(stateObj)}</span>
    </div>`;
  }

  render() {
    if (!this.hass || !this._config) return nothing;

    const parcels = this._parcelEntities();

    return html`<ha-card header=${this._config.title ?? "Parcel Tracker"}>
      <div class="card-content">
        ${this._renderCounters()}
        ${parcels.length === 0
          ? html`<div class="empty">Aucun colis suivi.</div>`
          : html`<div class="parcels">${parcels.map((p) => this._renderParcelRow(p))}</div>`}
      </div>
    </ha-card>`;
  }

  static styles = css`
    .card-content {
      padding: 0 0 8px;
    }

    .counters {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
      gap: 8px;
      padding: 12px 16px 16px;
    }

    .counter-tile {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 12px 4px;
      border-radius: 12px;
      background: var(--secondary-background-color);
      text-align: center;
    }

    .counter-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      color: var(--card-background-color, #fff);
    }

    .counter-icon ha-icon {
      --mdc-icon-size: 18px;
    }

    .counter-value {
      font-size: 1.3em;
      font-weight: 600;
      color: var(--primary-text-color);
    }

    .counter-label {
      font-size: 0.75em;
      color: var(--secondary-text-color);
      line-height: 1.2;
    }

    .empty {
      padding: 8px 16px 16px;
      color: var(--secondary-text-color);
    }

    .parcels {
      display: flex;
      flex-direction: column;
    }

    .parcel-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 8px 16px;
      cursor: pointer;
    }

    .parcel-row:hover {
      background: var(--secondary-background-color);
    }

    .parcel-info {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }

    .parcel-name {
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .parcel-secondary {
      font-size: 0.85em;
      color: var(--secondary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .parcel-status {
      font-size: 0.8em;
      font-weight: 500;
      white-space: nowrap;
      color: var(--card-background-color, #fff);
      padding: 3px 10px;
      border-radius: 999px;
    }
  `;
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "parcel-tracker-card",
  name: "Parcel Tracker Card",
  description:
    "Display and manage parcels tracked by the Parcel Tracker integration.",
});
