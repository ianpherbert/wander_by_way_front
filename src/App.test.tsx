import {render, screen} from "@testing-library/react";
import App from "./App";

describe("Render application", () => {
    test("App renders without error", () => {
        render(
            <App></App>
        );
        const text = screen.getAllByText(/wander by way/i);
        expect(text).not.toBeNull();
    });
});