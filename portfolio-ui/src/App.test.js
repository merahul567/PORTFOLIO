import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import { ThemeProvider } from "./theme/ThemeProvider";

test("renders platform wordmark", async () => {
  render(
    <HelmetProvider>
      <ThemeProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
  expect(await screen.findByRole("heading", { name: "KumarRahul.in" })).toBeInTheDocument();
});
