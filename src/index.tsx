import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
});

root.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);

reportWebVitals();
