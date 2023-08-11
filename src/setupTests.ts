// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import mapboxgl from "mapbox-gl";

jest.mock("mapbox-gl", () => ({
    Map: jest.fn(),
    Popup: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
mapboxgl.Map.prototype = {
    on: jest.fn(),
    remove: jest.fn(),
    off: jest.fn(),
    getCanvas: jest.fn(),
};
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
mapboxgl.Popup.prototype = {
    remove: jest.fn(),
};

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
        return;
    });
});