import {render} from "@testing-library/react";
import {AppProviders} from "index";


const renderWithProviders = (ui, options) => render(ui, {wrapper: AppProviders, ...options});

export * from '@testing-library/react';
export {renderWithProviders as render};