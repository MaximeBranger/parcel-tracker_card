import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

interface ParcelTrackerCardConfig {
  type: string;
  title?: string;
}

declare global {
  interface HTMLElementTagNameMap {
    "parcel-tracker-card": ParcelTrackerCard;
  }
  interface Window {
    customCards: { type: string; name: string; description: string }[];
  }
}

@customElement("parcel-tracker-card")
export class ParcelTrackerCard extends LitElement {
  @property({ attribute: false }) hass?: unknown;

  @state() private _config?: ParcelTrackerCardConfig;

  setConfig(config: ParcelTrackerCardConfig): void {
    this._config = config;
  }

  static getStubConfig(): ParcelTrackerCardConfig {
    return { type: "custom:parcel-tracker-card" };
  }

  render() {
    return html`<ha-card header=${this._config?.title ?? "Parcel Tracker"}>
      <div class="card-content">Coming soon.</div>
    </ha-card>`;
  }

  static styles = css`
    .card-content {
      padding: 16px;
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
