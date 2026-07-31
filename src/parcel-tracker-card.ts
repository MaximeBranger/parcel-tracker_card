import { LitElement, css, html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import { DEFAULT_STATUS_META, ERROR_STATUS_META, STATUS_META } from "./status";
import { entriesByTranslationKey, translationKey } from "./hass-entities";
import type {
  HassEntity,
  HistoryEntry,
  HomeAssistantLike,
  ParcelAttributes,
  ParcelTrackerCardConfig,
} from "./types";
import "./upsert-dialog";
import type { ParcelTrackerUpsertDialog } from "./upsert-dialog";
import "./parcel-tracker-stats-card";

const PLATFORM = "parcel_tracker";
const PARCEL_TRANSLATION_KEY = "parcel";

interface PendingDelete {
  entityId: string;
  parcelId: string;
  name: string;
}

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
const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return dateFormatter.format(date);
}

function formatDateTime(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return dateTimeFormatter.format(date);
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
  @state() private _pendingDelete: PendingDelete | null = null;
  @state() private _deleteSubmitting = false;
  @state() private _deleteError: string | null = null;
  @state() private _historyInfo: { name: string; entries: HistoryEntry[] } | null = null;

  @query("parcel-tracker-upsert-dialog") private _upsertDialog?: ParcelTrackerUpsertDialog;

  setConfig(config: ParcelTrackerCardConfig): void {
    this._config = config;
  }

  private get _editable(): boolean {
    return this._config?.editable ?? true;
  }

  static getStubConfig(): ParcelTrackerCardConfig {
    return { type: "custom:parcel-tracker-card" };
  }

  getCardSize(): number {
    return 1 + this._parcelEntities().length;
  }

  private _parcelEntities(): HassEntity[] {
    const parcels = entriesByTranslationKey(this.hass, PLATFORM, new Set([PARCEL_TRANSLATION_KEY]));
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

  private _parcelId(stateObj: HassEntity): string {
    // hass.entities is the lightweight entity-registry-for-display object;
    // it doesn't carry unique_id, so parcel_id has to come from the state
    // attribute the integration exposes instead.
    return (stateObj.attributes as unknown as ParcelAttributes).parcel_id ?? "";
  }

  private _historyNewestFirst(attrs: ParcelAttributes): HistoryEntry[] {
    const history = attrs.history;
    if (!Array.isArray(history) || history.length === 0) return [];
    return [...history].reverse();
  }

  private _showHistoryInfo(name: string, entries: HistoryEntry[]): void {
    this._historyInfo = { name, entries };
  }

  private _openAdd(): void {
    this._upsertDialog?.openForAdd();
  }

  private _openEdit(stateObj: HassEntity): void {
    const attrs = stateObj.attributes as unknown as ParcelAttributes;
    // display_name (and thus friendly_name) falls back to the tracking
    // number when the parcel has no explicit name — an empty name can't be
    // told apart from a name that happens to equal the tracking number, but
    // that's an acceptable edge case for prefilling the edit form.
    const strippedName = stripDevicePrefix(String(stateObj.attributes.friendly_name ?? ""));
    const name = strippedName === attrs.tracking_number ? "" : strippedName;

    this._upsertDialog?.openForEdit({
      parcelId: this._parcelId(stateObj),
      trackingNumber: attrs.tracking_number,
      carrier: attrs.carrier,
      name,
      notes: attrs.notes,
      notifyTarget: attrs.notify_target,
    });
  }

  private async _archive(stateObj: HassEntity): Promise<void> {
    try {
      await this.hass?.callService(PLATFORM, "archive", {
        parcel_id: this._parcelId(stateObj),
      });
    } catch (err) {
      console.error("parcel_tracker.archive failed", err);
    }
  }

  private _confirmDelete(stateObj: HassEntity): void {
    const name = stripDevicePrefix(String(stateObj.attributes.friendly_name ?? stateObj.entity_id));
    this._deleteError = null;
    this._pendingDelete = {
      entityId: stateObj.entity_id,
      parcelId: this._parcelId(stateObj),
      name,
    };
  }

  private async _confirmedDelete(): Promise<void> {
    const pending = this._pendingDelete;
    if (!pending || this._deleteSubmitting) return;
    this._deleteSubmitting = true;
    this._deleteError = null;
    try {
      await this.hass?.callService(PLATFORM, "remove", { parcel_id: pending.parcelId });
      this._pendingDelete = null;
    } catch (err) {
      console.error("parcel_tracker.remove failed", err);
      this._deleteError = err instanceof Error ? err.message : String(err);
    } finally {
      this._deleteSubmitting = false;
    }
  }

  private async _refresh(): Promise<void> {
    try {
      await this.hass?.callService(PLATFORM, "refresh", {});
    } catch (err) {
      console.error("parcel_tracker.refresh failed", err);
    }
  }

  private _renderParcelRow(stateObj: HassEntity) {
    const attrs = stateObj.attributes as unknown as ParcelAttributes;
    const hasError = Boolean(attrs.last_error);
    const meta = hasError ? ERROR_STATUS_META : STATUS_META[stateObj.state] ?? DEFAULT_STATUS_META;
    const name = stripDevicePrefix(String(stateObj.attributes.friendly_name ?? stateObj.entity_id));

    let secondary = attrs.carrier;
    if (hasError) {
      secondary += ` · ${attrs.last_error}`;
    } else if (stateObj.state === "delivered") {
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

    const historyEntries = this._historyNewestFirst(attrs);

    return html`<div class="parcel">
      <div
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
          <span class="parcel-secondary" title=${hasError ? secondary : nothing}>${secondary}</span>
        </div>
        <span class="parcel-status" style="background: ${meta.color}">${this._formatState(stateObj)}</span>
        ${historyEntries.length > 0
          ? html`<button
              class="icon-button info-button"
              aria-label="Historique"
              title="Historique"
              @click=${(ev: Event) => {
                ev.stopPropagation();
                this._showHistoryInfo(name, historyEntries);
              }}
            >
              <ha-icon icon="mdi:information-outline"></ha-icon>
            </button>`
          : nothing}
        ${this._editable ? this._renderActionsMenu(stateObj) : nothing}
      </div>
    </div>`;
  }

  private _renderActionsMenu(stateObj: HassEntity) {
    return html`<ha-button-menu @click=${(ev: Event) => ev.stopPropagation()}>
      <button slot="trigger" class="icon-button" aria-label="Actions">
        <ha-icon icon="mdi:dots-vertical"></ha-icon>
      </button>
      <mwc-list-item
        graphic="icon"
        @click=${(ev: Event) => {
          ev.stopPropagation();
          this._openEdit(stateObj);
        }}
      >
        <ha-icon slot="graphic" icon="mdi:pencil-outline"></ha-icon>
        Modifier
      </mwc-list-item>
      ${stateObj.state === "delivered"
        ? html`<mwc-list-item
            graphic="icon"
            @click=${(ev: Event) => {
              ev.stopPropagation();
              this._archive(stateObj);
            }}
          >
            <ha-icon slot="graphic" icon="mdi:archive-outline"></ha-icon>
            Archiver
          </mwc-list-item>`
        : nothing}
      <mwc-list-item
        graphic="icon"
        class="danger"
        @click=${(ev: Event) => {
          ev.stopPropagation();
          this._confirmDelete(stateObj);
        }}
      >
        <ha-icon slot="graphic" icon="mdi:delete-outline" style="color: var(--error-color)"></ha-icon>
        Supprimer
      </mwc-list-item>
    </ha-button-menu>`;
  }

  render() {
    if (!this.hass || !this._config) return nothing;

    const parcels = this._parcelEntities();
    const editable = this._editable;

    return html`<ha-card>
      <div class="card-header">
        <div class="name">${this._config.title ?? "Parcel Tracker"}</div>
        ${editable
          ? html`<div class="header-actions">
              <button class="icon-button" title="Rafraîchir" @click=${() => this._refresh()}>
                <ha-icon icon="mdi:refresh"></ha-icon>
              </button>
              <button class="icon-button" title="Ajouter un colis" @click=${() => this._openAdd()}>
                <ha-icon icon="mdi:plus"></ha-icon>
              </button>
            </div>`
          : nothing}
      </div>
      <div class="card-content">
        ${parcels.length === 0
          ? html`<div class="empty">
              ${editable
                ? html`<button class="link-button" @click=${() => this._openAdd()}>
                    Aucun colis suivi. Ajouter un colis.
                  </button>`
                : "Aucun colis suivi."}
            </div>`
          : html`<div class="parcels">${parcels.map((p) => this._renderParcelRow(p))}</div>`}
      </div>
    </ha-card>
    ${editable ? html`<parcel-tracker-upsert-dialog .hass=${this.hass}></parcel-tracker-upsert-dialog>` : nothing}
    ${this._renderDeleteConfirm()}
    ${this._renderHistoryInfo()}`;
  }

  private _renderHistoryInfo() {
    const info = this._historyInfo;
    if (!info) return nothing;
    return html`<ha-dialog
      open
      .heading=${info.name}
      @closed=${() => {
        this._historyInfo = null;
      }}
    >
      <div class="history-list">
        ${info.entries.map((entry) => {
          const date = formatDateTime(entry.date);
          return html`<div class="history-entry">
            <p>${entry.label ?? "Aucun libellé disponible."}</p>
            ${date ? html`<p class="history-meta">${date}</p>` : nothing}
            ${entry.location ? html`<p class="history-meta">${entry.location}</p>` : nothing}
          </div>`;
        })}
      </div>
      <ha-dialog-footer slot="footer">
        <button slot="primaryAction" @click=${() => (this._historyInfo = null)}>Fermer</button>
      </ha-dialog-footer>
    </ha-dialog>`;
  }

  private _renderDeleteConfirm() {
    if (!this._pendingDelete) return nothing;
    return html`<ha-dialog
      open
      .heading=${"Supprimer ce colis ?"}
      @closed=${() => {
        this._pendingDelete = null;
        this._deleteError = null;
      }}
    >
      <p>
        Supprimer définitivement « ${this._pendingDelete.name} » ? Cette action efface aussi son
        historique et ne peut pas être annulée.
      </p>
      ${this._deleteError ? html`<p class="error">${this._deleteError}</p>` : nothing}
      <ha-dialog-footer slot="footer">
        <button
          slot="secondaryAction"
          ?disabled=${this._deleteSubmitting}
          @click=${() => (this._pendingDelete = null)}
        >
          Annuler
        </button>
        <button
          class="danger"
          slot="primaryAction"
          ?disabled=${this._deleteSubmitting}
          @click=${() => this._confirmedDelete()}
        >
          ${this._deleteSubmitting ? "…" : "Supprimer"}
        </button>
      </ha-dialog-footer>
    </ha-dialog>`;
  }

  static styles = css`
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 16px 0;
      font-size: 1.2em;
      font-weight: 400;
      color: var(--ha-card-header-color, var(--primary-text-color));
    }

    .header-actions {
      display: flex;
      gap: 4px;
    }

    .icon-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      background: none;
      color: var(--secondary-text-color);
      cursor: pointer;
    }

    .icon-button:hover {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    .link-button {
      font: inherit;
      background: none;
      border: none;
      padding: 0;
      color: var(--primary-color);
      cursor: pointer;
      text-align: left;
    }

    .card-content {
      padding: 0 0 8px;
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

    .info-button {
      width: 32px;
      height: 32px;
      flex: none;
    }

    .info-button ha-icon {
      --mdc-icon-size: 20px;
    }

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-height: 60vh;
      overflow-y: auto;
      min-width: 240px;
    }

    .history-entry {
      padding-bottom: 12px;
      border-bottom: 1px solid var(--divider-color, #ccc);
    }

    .history-entry:last-child {
      padding-bottom: 0;
      border-bottom: none;
    }

    .history-entry p {
      margin: 0;
    }

    ha-dialog p.history-meta {
      color: var(--secondary-text-color);
      font-size: 0.85em;
      margin-top: 4px;
    }

    mwc-list-item.danger {
      color: var(--error-color);
      --mdc-theme-text-primary-on-background: var(--error-color);
    }

    ha-dialog button {
      font: inherit;
      background: none;
      border: none;
      padding: 8px 12px;
      cursor: pointer;
      color: var(--primary-color);
    }

    ha-dialog button.danger {
      color: var(--error-color);
    }

    ha-dialog p.error {
      color: var(--error-color);
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
