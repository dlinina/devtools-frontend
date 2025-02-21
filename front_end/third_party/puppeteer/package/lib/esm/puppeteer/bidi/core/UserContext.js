/**
 * @license
 * Copyright 2024 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
import { EventEmitter } from '../../common/EventEmitter.js';
import { assert } from '../../util/assert.js';
import { inertIfDisposed, throwIfDisposed } from '../../util/decorators.js';
import { DisposableStack, disposeSymbol } from '../../util/disposable.js';
import { BrowsingContext } from './BrowsingContext.js';
/**
 * @internal
 */
let UserContext = (() => {
    let _classSuper = EventEmitter;
    let _instanceExtraInitializers = [];
    let _dispose_decorators;
    let _createBrowsingContext_decorators;
    let _remove_decorators;
    return class UserContext extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(this, null, _dispose_decorators, { kind: "method", name: "dispose", static: false, private: false, access: { has: obj => "dispose" in obj, get: obj => obj.dispose }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _createBrowsingContext_decorators, { kind: "method", name: "createBrowsingContext", static: false, private: false, access: { has: obj => "createBrowsingContext" in obj, get: obj => obj.createBrowsingContext }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: obj => "remove" in obj, get: obj => obj.remove }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static DEFAULT = 'default';
        static create(browser, id) {
            const context = new UserContext(browser, id);
            context.#initialize();
            return context;
        }
        // keep-sorted start
        #reason = (__runInitializers(this, _instanceExtraInitializers), void 0);
        // Note these are only top-level contexts.
        #browsingContexts = new Map();
        #disposables = new DisposableStack();
        #id;
        browser;
        // keep-sorted end
        constructor(browser, id) {
            super();
            // keep-sorted start
            this.#id = id;
            this.browser = browser;
            // keep-sorted end
        }
        #initialize() {
            const browserEmitter = this.#disposables.use(new EventEmitter(this.browser));
            browserEmitter.once('closed', ({ reason }) => {
                this.dispose(`User context already closed: ${reason}`);
            });
            const sessionEmitter = this.#disposables.use(new EventEmitter(this.#session));
            sessionEmitter.on('browsingContext.contextCreated', info => {
                if (info.parent) {
                    return;
                }
                const browsingContext = BrowsingContext.from(this, undefined, info.context, info.url);
                this.#browsingContexts.set(browsingContext.id, browsingContext);
                const browsingContextEmitter = this.#disposables.use(new EventEmitter(browsingContext));
                browsingContextEmitter.on('closed', () => {
                    browsingContextEmitter.removeAllListeners();
                    this.#browsingContexts.delete(browsingContext.id);
                });
                this.emit('browsingcontext', { browsingContext });
            });
        }
        // keep-sorted start block=yes
        get #session() {
            return this.browser.session;
        }
        get browsingContexts() {
            return this.#browsingContexts.values();
        }
        get closed() {
            return this.#reason !== undefined;
        }
        get disposed() {
            return this.closed;
        }
        get id() {
            return this.#id;
        }
        // keep-sorted end
        dispose(reason) {
            this.#reason = reason;
            this[disposeSymbol]();
        }
        async createBrowsingContext(type, options = {}) {
            const { result: { context: contextId }, } = await this.#session.send('browsingContext.create', {
                type,
                ...options,
                referenceContext: options.referenceContext?.id,
            });
            const browsingContext = this.#browsingContexts.get(contextId);
            assert(browsingContext, 'The WebDriver BiDi implementation is failing to create a browsing context correctly.');
            // We use an array to avoid the promise from being awaited.
            return browsingContext;
        }
        async remove() {
            try {
                // TODO: Call `removeUserContext` once available.
            }
            finally {
                this.dispose('User context already closed.');
            }
        }
        [(_dispose_decorators = [inertIfDisposed], _createBrowsingContext_decorators = [throwIfDisposed(context => {
                // SAFETY: Disposal implies this exists.
                return context.#reason;
            })], _remove_decorators = [throwIfDisposed(context => {
                // SAFETY: Disposal implies this exists.
                return context.#reason;
            })], disposeSymbol)]() {
            this.#reason ??=
                'User context already closed, probably because the browser disconnected/closed.';
            this.emit('closed', { reason: this.#reason });
            this.#disposables.dispose();
            super[disposeSymbol]();
        }
    };
})();
export { UserContext };
//# sourceMappingURL=UserContext.js.map