"use strict";
/**
 * @license
 * Copyright 2021 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.networkConditions = exports.PredefinedNetworkConditions = void 0;
/**
 * A list of network conditions to be used with
 * {@link Page.emulateNetworkConditions}.
 *
 * @example
 *
 * ```ts
 * import {PredefinedNetworkConditions} from 'puppeteer';
 * const slow3G = PredefinedNetworkConditions['Slow 3G'];
 *
 * (async () => {
 *   const browser = await puppeteer.launch();
 *   const page = await browser.newPage();
 *   await page.emulateNetworkConditions(slow3G);
 *   await page.goto('https://www.google.com');
 *   // other actions...
 *   await browser.close();
 * })();
 * ```
 *
 * @public
 */
exports.PredefinedNetworkConditions = Object.freeze({
    'Slow 3G': {
        download: ((500 * 1000) / 8) * 0.8,
        upload: ((500 * 1000) / 8) * 0.8,
        latency: 400 * 5,
    },
    'Fast 3G': {
        download: ((1.6 * 1000 * 1000) / 8) * 0.9,
        upload: ((750 * 1000) / 8) * 0.9,
        latency: 150 * 3.75,
    },
});
/**
 * @deprecated Import {@link PredefinedNetworkConditions}.
 *
 * @public
 */
exports.networkConditions = exports.PredefinedNetworkConditions;
//# sourceMappingURL=PredefinedNetworkConditions.js.map