import './polyfill';
import { resetContainer } from './container';

beforeEach(() => {
    resetContainer();
    jest.resetAllMocks();
});