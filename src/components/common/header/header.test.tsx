import {render, screen} from "@testing-library/react";
import Header from "./index";
import {Languages} from "../../../utils/Languages";

describe("Render header", () => {
    test("header renders without error English", () => {
        render(<Header connected={false} language={Languages.EN}/>);
        const text = screen.getByText(/wander by way/i);
        expect(text).toBeVisible();
    });
});