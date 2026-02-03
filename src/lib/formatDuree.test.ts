import { describe, it, expect } from "vitest";
import { formatDuree } from "./formatDuree";

describe("formatDuree", () => {
  it("affiche les minutes pour une durée inférieure à 1 heure", () => {
    expect(formatDuree(45)).toBe("45 min");
  });

  it("affiche les heures sans minutes quand la durée est exacte", () => {
    expect(formatDuree(120)).toBe("2h");
  });

  it("affiche les heures et minutes pour une durée mixte", () => {
    expect(formatDuree(90)).toBe("1h30");
  });

  it("ajoute un zéro devant les minutes inférieures à 10", () => {
    expect(formatDuree(65)).toBe("1h05");
  });
});
