import type { HassEntity, HomeAssistantLike } from "./types";

export function translationKey(hass: HomeAssistantLike | undefined, stateObj: HassEntity): string {
  return hass?.entities[stateObj.entity_id]?.translation_key ?? "";
}

export function entriesByTranslationKey(
  hass: HomeAssistantLike | undefined,
  platform: string,
  keys: Set<string> | null,
): HassEntity[] {
  if (!hass) return [];
  const result: HassEntity[] = [];
  for (const entry of Object.values(hass.entities)) {
    if (entry.platform !== platform) continue;
    if (keys && !keys.has(entry.translation_key ?? "")) continue;
    const stateObj = hass.states[entry.entity_id];
    if (stateObj) result.push(stateObj);
  }
  return result;
}
