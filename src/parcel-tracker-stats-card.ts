import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { GLOBAL_COUNTER_TRANSLATION_KEYS, globalCounterColor, globalCounterIcon } from "./status";
import { entriesByTranslationKey, translationKey } from "./hass-entities";
import type { HassEntity, HomeAssistantLike, ParcelTrackerStatsCardConfig } from "./types";

const PLATFORM = "parcel_tracker";

declare global {
  interface HTMLElementTagNameMap {
    "parcel-tracker-stats-card": ParcelTrackerStatsCard;
  }
}

@customElement("parcel-tracker-stats-card")
export class ParcelTrackerStatsCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistantLike;

  @state() private _config?: ParcelTrackerStatsCardConfig;

  setConfig(config: ParcelTrackerStatsCardConfig): void {
    this._config = config;
  }

  static getStubConfig(): ParcelTrackerStatsCardConfig {
    return { type: "custom:parcel-tracker-stats-card" };
  }

  getCardSize(): number {
    return 1;
  }

  private _counters(): HassEntity[] {
    const keys = new Set(GLOBAL_COUNTER_TRANSLATION_KEYS);
    return entriesByTranslationKey(this.hass, PLATFORM, keys).sort(
      (a, b) => GLOBAL_COUNTER_TRANSLATION_KEYS.indexOf(translationKey(this.hass, a)) -
        GLOBAL_COUNTER_TRANSLATION_KEYS.indexOf(translationKey(this.hass, b)),
    );
  }

  private _counterLabel(stateObj: HassEntity): string {
    const key = translationKey(this.hass, stateObj);
    const localized = this.hass?.localize?.(
      `component.${PLATFORM}.entity.sensor.${key}.name`,
    );
    return localized || String(stateObj.attributes.friendly_name ?? stateObj.entity_id);
  }

  render() {
    if (!this.hass || !this._config) return nothing;

    const counters = this._counters();

    return html`<ha-card>
      ${this._config.title
        ? html`<div class="card-header">${this._config.title}</div>`
        : nothing}
      <div class="card-content">
        ${counters.length === 0
          ? html`<div class="empty">Aucun compteur disponible.</div>`
          : html`<div class="counters">
              ${counters.map((stateObj) => {
                const color = globalCounterColor(translationKey(this.hass, stateObj));
                return html`<div class="counter-tile">
                  <div class="counter-icon" style="background: ${color}">
                    <ha-icon icon=${globalCounterIcon(translationKey(this.hass, stateObj))}></ha-icon>
                  </div>
                  <span class="counter-value">${stateObj.state}</span>
                  <span class="counter-label">${this._counterLabel(stateObj)}</span>
                </div>`;
              })}
            </div>`}
      </div>
    </ha-card>`;
  }

  static styles = css`
    .card-header {
      padding: 16px 16px 0;
      font-size: 1.2em;
      font-weight: 400;
      color: var(--ha-card-header-color, var(--primary-text-color));
    }

    .card-content {
      padding: 8px 0;
    }

    .empty {
      padding: 8px 16px 16px;
      color: var(--secondary-text-color);
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
  `;
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "parcel-tracker-stats-card",
  name: "Parcel Tracker Stats Card",
  description: "Display global parcel counters exposed by the Parcel Tracker integration.",
});
