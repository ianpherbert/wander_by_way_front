import {MockedProvider} from "@apollo/client/testing";
import {mocks} from "testUtils/mocks";
import {Provider} from "react-redux";
import {ThemeProvider} from "@mui/material";
import React from "react";
import {configureStore} from "@reduxjs/toolkit";
import rootReducer from "reducers";
import {render as rtlRender} from "@testing-library/react";
import {theme} from "styles/themeProvider/theme";

const mockStore = configureStore({
    reducer: rootReducer,
    middleware: [],
});

// Define your default options here.
const defaultStore = mockStore;
const defaultTheme = theme;

const customRender = (ui, {store = defaultStore, theme = defaultTheme, ...options} = {}) => {
    // eslint-disable-next-line react/prop-types
    function Wrapper({children}) {
        return (
            <MockedProvider mocks={mocks}>
                <Provider store={store}>
                    <ThemeProvider theme={theme}>
                        {children}
                    </ThemeProvider>
                </Provider>
            </MockedProvider>
        );
    }

    return rtlRender(ui, {wrapper: Wrapper, ...options});
};

export * from '@testing-library/react';
export {customRender as render};