import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "./page";
import { Provider } from "@/components/ui/provider";

describe("Home", () => {
  it("affiche le titre de l'application", () => {
    render(
      <Provider>
        <Home />
      </Provider>
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Ma Petite Compagnie");
  });
});
