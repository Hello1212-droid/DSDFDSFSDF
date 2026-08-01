/**
 * Mutable, module-level state for the Indian language input feature.
 * The editor plugin reads this live so it can be toggled without recreating
 * the editor.
 */
import { getScript, type IndicScript } from "./scripts";

interface LangState {
  enabled: boolean;
  scriptId: string;
}

const state: LangState = {
  enabled: false,
  scriptId: "hi",
};

export function isLangEnabled(): boolean {
  return state.enabled;
}

export function setLangEnabled(v: boolean) {
  state.enabled = v;
}

export function getScriptId(): string {
  return state.scriptId;
}

export function setScriptId(id: string) {
  state.scriptId = id;
}

export function getActiveScript(): IndicScript {
  return getScript(state.scriptId);
}
