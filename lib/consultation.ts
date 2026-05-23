/** Cross-component hook for opening the consultation modal (modal lives on homepage). */

export const OPEN_CONSULT_EVENT = "bwi:open-consult";

export function dispatchOpenConsult(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_CONSULT_EVENT));
}
