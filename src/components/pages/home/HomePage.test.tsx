import {screen} from "@testing-library/react";
import {render} from "testUtils/utilsTest.js";
import HomePage from "./index";

describe("test homepage renders correctly", () => {
    test("render correctly", () => {
        render(<HomePage/>);
        const text = screen.getByText(/Where do you want to wander?/i);
        expect(text).toBeVisible();
    });
});


export {};