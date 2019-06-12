import './polyfill'; // tslint:disable-line:no-import-side-effect
import { resetContainer } from './container';

beforeEach(() => {
    resetContainer();
    jest.resetAllMocks();
});
