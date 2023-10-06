import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import {Provider} from "react-redux";
import store from "./store";
import {ThemeProvider} from "@mui/material";
import {theme} from "./styles/themeProvider/theme";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import App from "./App";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import SignUpPage from "./pages/signup";
import RouteFinder from "./pages/routeFinder";
import ErrorElement from "./components/common/error";
import TestMap from "./components/map/TestMap";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
});

const routes = {
    main: [
        {
            path: "",
            element: <HomePage/>,
        },
        {
            path: "/home",
            element: <HomePage/>,
        },
        {
            path: "/login",
            element: <LoginPage/>,
        },
        {
            path: "/signup",
            element: <SignUpPage/>,
        },
        {
            path: "/routeFinder/:fromId/:toId",
            element: <RouteFinder/>,
        },
        {
            path: "/test",
            element: <TestMap/>,
        },
    ]
};

const router = createBrowserRouter([
    {
        path: "",
        element: <App/>,
        errorElement: <ErrorElement/>,
        children: routes.main
    },
]);

root.render(
    <ApolloProvider client={client}>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <RouterProvider router={router}/>
            </ThemeProvider>
        </Provider>;
    </ApolloProvider>
);

reportWebVitals();
