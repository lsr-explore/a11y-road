/**
 * Validates that the Vitest + React Testing Library + jsdom toolchain
 * is wired up correctly. This test exercises:
 *   - JSX compilation (@vitejs/plugin-react)
 *   - jsdom environment (DOM APIs)
 *   - @testing-library/react (render, screen, user queries)
 *   - @testing-library/jest-dom matchers (toBeInTheDocument, etc.)
 *   - Coverage instrumentation (@vitest/coverage-v8)
 */
import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

function Counter({ initial = 0 }: { initial?: number }) {
  const [count, setCount] = useState(initial);
  return (
    <div>
      <p>
        Count: <span data-testid="count">{count}</span>
      </p>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Increment
      </button>
    </div>
  );
}

describe("Test toolchain validation", () => {
  it("renders a React component in jsdom", () => {
    render(<Counter />);
    expect(screen.getByText("Count:")).toBeInTheDocument();
  });

  it("supports jest-dom matchers", () => {
    render(<Counter />);
    const button = screen.getByRole("button", { name: "Increment" });
    expect(button).toBeVisible();
    expect(button).toHaveTextContent("Increment");
  });

  it("handles state updates and re-renders", () => {
    render(<Counter initial={5} />);
    expect(screen.getByTestId("count")).toHaveTextContent("5");

    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByTestId("count")).toHaveTextContent("6");
  });
});
