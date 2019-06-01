import { Test } from './../src/main'

declare const test: Function;
declare const expect: Function;
/// <reference types="jest" />

test('The test class exists', () => {
    expect(Test).toBeTruthy()
})