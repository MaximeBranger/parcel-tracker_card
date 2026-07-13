import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { CARRIERS, type CarrierOption } from "./carriers";
import type { HomeAssistantLike } from "./types";

const DOMAIN = "parcel_tracker";
// add/update (when tracking_number or carrier change) trigger a synchronous
// carrier lookup on the backend, but a bad tracking number doesn't reject the
// service call — it's reported asynchronously via the parcel_error event
// instead. Give it a few seconds to show up before assuming success.
const ERROR_LISTEN_MS = 5000;

export interface UpsertTarget {
  parcelId: string;
  trackingNumber: string;
  carrier: string;
  name: string;
  notes: string;
}

declare global {
  interface HTMLElementTagNameMap {
    "parcel-tracker-upsert-dialog": ParcelTrackerUpsertDialog;
  }
}

@customElement("parcel-tracker-upsert-dialog")
export class ParcelTrackerUpsertDialog extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistantLike;

  @state() private _open = false;
  @state() private _parcelId: string | null = null;
  @state() private _trackingNumber = "";
  @state() private _carrier = CARRIERS[0].value;
  @state() private _name = "";
  @state() private _notes = "";
  @state() private _submitting = false;
  @state() private _error: string | null = null;
  @state() private _availableCarriers: CarrierOption[] = CARRIERS;

  private _originalTrackingNumber = "";
  private _originalCarrier = CARRIERS[0].value;
  private _unsubscribeError: (() => void) | null = null;
  private _errorTimeout?: number;

  openForAdd(): void {
    this._parcelId = null;
    this._trackingNumber = "";
    this._originalTrackingNumber = "";
    this._carrier = CARRIERS[0].value;
    this._originalCarrier = CARRIERS[0].value;
    this._name = "";
    this._notes = "";
    this._error = null;
    this._availableCarriers = CARRIERS;
    this._open = true;
    void this._loadAvailableCarriers();
  }

  openForEdit(target: UpsertTarget): void {
    this._parcelId = target.parcelId;
    this._trackingNumber = target.trackingNumber;
    this._originalTrackingNumber = target.trackingNumber;
    this._carrier = target.carrier;
    this._originalCarrier = target.carrier;
    this._name = target.name;
    this._notes = target.notes;
    this._error = null;
    this._availableCarriers = CARRIERS;
    this._open = true;
    void this._loadAvailableCarriers();
  }

  private async _loadAvailableCarriers(): Promise<void> {
    if (!this.hass) return;
    const openedFor = this._parcelId;

    let configured = CARRIERS.map((carrier) => carrier.value);
    try {
      const result = await this.hass.callService<{ carriers: string[] }>(
        DOMAIN,
        "get_configured_carriers",
        {},
        undefined,
        true,
        true,
      );
      if (result?.response?.carriers) configured = result.response.carriers;
    } catch (err) {
      console.error("parcel_tracker.get_configured_carriers failed", err);
    }

    // The dialog may have been closed and reopened for a different parcel
    // (or for add) while this call was in flight.
    if (!this._open || this._parcelId !== openedFor) return;

    const carriers = CARRIERS.filter((carrier) => configured.includes(carrier.value));

    if (this._parcelId !== null && !carriers.some((carrier) => carrier.value === this._carrier)) {
      // Editing a parcel whose carrier's credentials were since removed must
      // still offer that carrier, so saving unrelated fields doesn't force
      // an unwanted carrier change (mirrors
      // ParcelTrackerOptionsFlow.async_step_edit_parcel in the backend).
      const current = CARRIERS.find((carrier) => carrier.value === this._carrier);
      if (current) carriers.unshift(current);
    } else if (
      this._parcelId === null &&
      carriers.length > 0 &&
      !carriers.some((carrier) => carrier.value === this._carrier)
    ) {
      this._carrier = carriers[0].value;
    }

    this._availableCarriers = carriers.length > 0 ? carriers : CARRIERS;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._cleanupErrorListener();
  }

  private _cleanupErrorListener(): void {
    if (this._errorTimeout !== undefined) {
      window.clearTimeout(this._errorTimeout);
      this._errorTimeout = undefined;
    }
    this._unsubscribeError?.();
    this._unsubscribeError = null;
  }

  private _close(): void {
    this._open = false;
    this._submitting = false;
    this._cleanupErrorListener();
  }

  private async _submit(): Promise<void> {
    if (this._submitting) return;
    if (!this._trackingNumber.trim()) {
      this._error = "Le numéro de suivi est requis.";
      return;
    }
    if (!this.hass) return;

    this._submitting = true;
    this._error = null;

    const isEdit = this._parcelId !== null;
    const willRefresh =
      !isEdit ||
      this._trackingNumber !== this._originalTrackingNumber ||
      this._carrier !== this._originalCarrier;

    try {
      if (isEdit) {
        await this.hass.callService(DOMAIN, "update", {
          parcel_id: this._parcelId,
          tracking_number: this._trackingNumber,
          carrier: this._carrier,
          name: this._name,
          notes: this._notes,
        });
      } else {
        await this.hass.callService(DOMAIN, "add", {
          tracking_number: this._trackingNumber,
          carrier: this._carrier,
          name: this._name,
          notes: this._notes,
        });
      }
    } catch (err) {
      this._submitting = false;
      this._error = err instanceof Error ? err.message : String(err);
      return;
    }

    if (!willRefresh) {
      this._close();
      return;
    }

    this._waitForErrorThenClose();
  }

  private _waitForErrorThenClose(): void {
    const trackingNumber = this._trackingNumber;
    let settled = false;

    const onSettled = () => {
      if (settled) return;
      settled = true;
      this._cleanupErrorListener();
    };

    this.hass!.connection
      .subscribeEvents<{ tracking_number?: string; error?: string }>((event) => {
        if (event.data.tracking_number !== trackingNumber) return;
        this._submitting = false;
        this._error = event.data.error ?? "Erreur lors du suivi de ce colis.";
        onSettled();
      }, "parcel_error")
      .then((unsubscribe) => {
        if (settled) {
          unsubscribe();
          return;
        }
        this._unsubscribeError = unsubscribe;
      });

    this._errorTimeout = window.setTimeout(() => {
      if (settled) return;
      onSettled();
      this._close();
    }, ERROR_LISTEN_MS);
  }

  private _renderField(
    id: string,
    label: string,
    value: string,
    onInput: (value: string) => void,
    required = false,
  ) {
    return html`<div class="field">
      <label for=${id}>${label}${required ? " *" : ""}</label>
      <input
        id=${id}
        .value=${value}
        ?required=${required}
        @input=${(ev: Event) => onInput((ev.target as HTMLInputElement).value)}
      />
    </div>`;
  }

  render() {
    const isEdit = this._parcelId !== null;
    return html`<ha-dialog
      .open=${this._open}
      .heading=${isEdit ? "Modifier le colis" : "Ajouter un colis"}
      @closed=${() => this._close()}
    >
      <div class="fields">
        ${this._renderField(
          "tracking_number",
          "Numéro de suivi",
          this._trackingNumber,
          (v) => (this._trackingNumber = v),
          true,
        )}
        <div class="field">
          <label for="carrier">Transporteur</label>
          <select
            id="carrier"
            .value=${this._carrier}
            @change=${(ev: Event) => (this._carrier = (ev.target as HTMLSelectElement).value)}
          >
            ${this._availableCarriers.map(
              (carrier) =>
                html`<option value=${carrier.value} ?selected=${carrier.value === this._carrier}>
                  ${carrier.label}
                </option>`,
            )}
          </select>
        </div>
        ${this._renderField("name", "Nom", this._name, (v) => (this._name = v))}
        ${this._renderField("notes", "Notes", this._notes, (v) => (this._notes = v))}
        ${this._error ? html`<p class="error">${this._error}</p>` : nothing}
      </div>
      <ha-dialog-footer slot="footer">
        <button slot="secondaryAction" ?disabled=${this._submitting} @click=${() => this._close()}>
          Annuler
        </button>
        <button slot="primaryAction" ?disabled=${this._submitting} @click=${() => this._submit()}>
          ${this._submitting ? "…" : isEdit ? "Enregistrer" : "Ajouter"}
        </button>
      </ha-dialog-footer>
    </ha-dialog>`;
  }

  static styles = css`
    .fields {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 280px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    label {
      font-size: 0.85em;
      color: var(--secondary-text-color);
    }

    input,
    select {
      font: inherit;
      color: var(--primary-text-color);
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      padding: 8px;
    }

    .error {
      color: var(--error-color);
      margin: 0;
    }

    button[slot="primaryAction"] {
      color: var(--primary-color);
    }

    button {
      font: inherit;
      background: none;
      border: none;
      padding: 8px 12px;
      cursor: pointer;
    }

    button[disabled] {
      opacity: 0.5;
      cursor: default;
    }
  `;
}
