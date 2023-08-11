import {act, screen} from "@testing-library/react";
import {render} from "testUtils/utilsTest.js";
import HomePage from "./index";
import HomePageMap from "./HomePageMap";
import userEvent from "@testing-library/user-event";

describe("test homepage renders correctly", () => {
    test("render correctly", () => {
        render(<HomePage/>);
        const text = screen.getByText(/Where do you want to wander?/i);
        expect(text).toBeVisible();
    });
});

describe("test homepage map", () => {
    test("Test search, swap", async () => {
        render(<HomePageMap/>);
        const fromBox = screen.getByRole("combobox", {name: "From"});
        const toBox = screen.getByRole("combobox", {name: "To"});
        const swapButton = screen.getByRole("button", {name: /swap/i});
        const searchButton = screen.getByRole("button", {name: /let's go/i});

        expect(fromBox).toBeVisible();
        expect(toBox).toBeVisible();
        expect(swapButton).toBeVisible();
        expect(searchButton).toBeVisible();
        expect(swapButton).toBeDisabled();
        expect(searchButton).toBeDisabled();

        await act(async () => {
            await userEvent.type(fromBox, "na");

        });
        const nantesOption = await screen.findByText(/nantes/i);
        userEvent.click(nantesOption);

        await act(async () => {
            await userEvent.type(toBox, "na");

        });

        const poznanOption = await screen.findByText(/poznan/i);
        userEvent.click(poznanOption);

        expect(swapButton).toBeEnabled();
        expect(searchButton).toBeEnabled();
        expect(fromBox).toHaveValue("Nantes, France");
        expect(toBox).toHaveValue("Poznan, Poland");

        act(() => {
            userEvent.click(swapButton);
        });

        expect(fromBox).toHaveValue("Poznan, Poland");
        expect(toBox).toHaveValue("Nantes, France");

    });
});


export {};