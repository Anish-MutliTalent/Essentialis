let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

let WASM_VECTOR_LEN = 0;

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedFloat64Memory0 = null;

function getFloat64Memory0() {
    if (cachedFloat64Memory0 === null || cachedFloat64Memory0.byteLength === 0) {
        cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64Memory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1) >>> 0;
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}
/**
* @param {PublicKey} delegating_pk
* @param {Uint8Array} plaintext
* @returns {[Capsule, Uint8Array]}
*/
export function encrypt(delegating_pk, plaintext) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(delegating_pk, PublicKey);
        const ptr0 = passArray8ToWasm0(plaintext, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.encrypt(retptr, delegating_pk.__wbg_ptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {SecretKey} delegating_sk
* @param {Capsule} capsule
* @param {Uint8Array} ciphertext
* @returns {Uint8Array}
*/
export function decryptOriginal(delegating_sk, capsule, ciphertext) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(delegating_sk, SecretKey);
        _assertClass(capsule, Capsule);
        const ptr0 = passArray8ToWasm0(ciphertext, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.decryptOriginal(retptr, delegating_sk.__wbg_ptr, capsule.__wbg_ptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        if (r3) {
            throw takeObject(r2);
        }
        var v2 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

let stack_pointer = 128;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}
/**
* @param {SecretKey} receiving_sk
* @param {PublicKey} delegating_pk
* @param {Capsule} capsule
* @param {VerifiedCapsuleFrag[]} vcfrags
* @param {Uint8Array} ciphertext
* @returns {Uint8Array}
*/
export function decryptReencrypted(receiving_sk, delegating_pk, capsule, vcfrags, ciphertext) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(receiving_sk, SecretKey);
        _assertClass(delegating_pk, PublicKey);
        _assertClass(capsule, Capsule);
        const ptr0 = passArray8ToWasm0(ciphertext, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.decryptReencrypted(retptr, receiving_sk.__wbg_ptr, delegating_pk.__wbg_ptr, capsule.__wbg_ptr, addBorrowedObject(vcfrags), ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        if (r3) {
            throw takeObject(r2);
        }
        var v2 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
* @param {SecretKey} delegating_sk
* @param {PublicKey} receiving_pk
* @param {Signer} signer
* @param {number} threshold
* @param {number} shares
* @param {boolean} sign_delegating_key
* @param {boolean} sign_receiving_key
* @returns {VerifiedKeyFrag[]}
*/
export function generateKFrags(delegating_sk, receiving_pk, signer, threshold, shares, sign_delegating_key, sign_receiving_key) {
    _assertClass(delegating_sk, SecretKey);
    _assertClass(receiving_pk, PublicKey);
    _assertClass(signer, Signer);
    const ret = wasm.generateKFrags(delegating_sk.__wbg_ptr, receiving_pk.__wbg_ptr, signer.__wbg_ptr, threshold, shares, sign_delegating_key, sign_receiving_key);
    return takeObject(ret);
}

/**
* @param {Capsule} capsule
* @param {VerifiedKeyFrag} kfrag
* @returns {VerifiedCapsuleFrag}
*/
export function reencrypt(capsule, kfrag) {
    _assertClass(capsule, Capsule);
    _assertClass(kfrag, VerifiedKeyFrag);
    const ret = wasm.reencrypt(capsule.__wbg_ptr, kfrag.__wbg_ptr);
    return VerifiedCapsuleFrag.__wrap(ret);
}

/**
*/
export class Capsule {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Capsule.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_capsule_free(ptr);
    }
    /**
    * @returns {string}
    */
    __getClassname() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.capsule___getClassname(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.capsule_toBytes(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytesSimple() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.capsule_toBytesSimple(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {Capsule}
    */
    static fromBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.capsule_fromBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return Capsule.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {string}
    */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.capsule_toString(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1);
        }
    }
    /**
    * @param {Capsule} other
    * @returns {boolean}
    */
    equals(other) {
        _assertClass(other, Capsule);
        const ret = wasm.capsule_equals(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
}
/**
*/
export class CapsuleFrag {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CapsuleFrag.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_capsulefrag_free(ptr);
    }
    /**
    * @param {Capsule} capsule
    * @param {PublicKey} verifying_pk
    * @param {PublicKey} delegating_pk
    * @param {PublicKey} receiving_pk
    * @returns {VerifiedCapsuleFrag}
    */
    verify(capsule, verifying_pk, delegating_pk, receiving_pk) {
        try {
            const ptr = this.__destroy_into_raw();
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(capsule, Capsule);
            _assertClass(verifying_pk, PublicKey);
            _assertClass(delegating_pk, PublicKey);
            _assertClass(receiving_pk, PublicKey);
            wasm.capsulefrag_verify(retptr, ptr, capsule.__wbg_ptr, verifying_pk.__wbg_ptr, delegating_pk.__wbg_ptr, receiving_pk.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return VerifiedCapsuleFrag.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.capsulefrag_toBytes(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytesSimple() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.capsulefrag_toBytesSimple(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {CapsuleFrag}
    */
    static fromBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.capsulefrag_fromBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CapsuleFrag.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {string}
    */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.capsulefrag_toString(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1);
        }
    }
    /**
    * @returns {VerifiedCapsuleFrag}
    */
    skipVerification() {
        const ret = wasm.capsulefrag_skipVerification(this.__wbg_ptr);
        return VerifiedCapsuleFrag.__wrap(ret);
    }
    /**
    * @param {CapsuleFrag} other
    * @returns {boolean}
    */
    equals(other) {
        _assertClass(other, CapsuleFrag);
        const ret = wasm.capsulefrag_equals(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
}
/**
*/
export class CurvePoint {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CurvePoint.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_curvepoint_free(ptr);
    }
    /**
    * @returns {[Uint8Array, Uint8Array] | undefined}
    */
    coordinates() {
        const ret = wasm.curvepoint_coordinates(this.__wbg_ptr);
        return takeObject(ret);
    }
}
/**
*/
export class KeyFrag {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(KeyFrag.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_keyfrag_free(ptr);
    }
    /**
    * @param {PublicKey} verifying_pk
    * @param {PublicKey | null} delegating_pk
    * @param {PublicKey | null} receiving_pk
    * @returns {VerifiedKeyFrag}
    */
    verify(verifying_pk, delegating_pk, receiving_pk) {
        try {
            const ptr = this.__destroy_into_raw();
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(verifying_pk, PublicKey);
            wasm.keyfrag_verify(retptr, ptr, verifying_pk.__wbg_ptr, addBorrowedObject(delegating_pk), addBorrowedObject(receiving_pk));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return VerifiedKeyFrag.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.keyfrag_toBytes(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {KeyFrag}
    */
    static fromBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.keyfrag_fromBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return KeyFrag.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {string}
    */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.keyfrag_toString(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1);
        }
    }
    /**
    * @returns {VerifiedKeyFrag}
    */
    skipVerification() {
        const ret = wasm.keyfrag_skipVerification(this.__wbg_ptr);
        return VerifiedKeyFrag.__wrap(ret);
    }
    /**
    * @param {KeyFrag} other
    * @returns {boolean}
    */
    equals(other) {
        _assertClass(other, KeyFrag);
        const ret = wasm.keyfrag_equals(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
}
/**
*/
export class Parameters {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Parameters.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_parameters_free(ptr);
    }
    /**
    */
    constructor() {
        const ret = wasm.parameters_new();
        return Parameters.__wrap(ret);
    }
    /**
    * @returns {CurvePoint}
    */
    get u() {
        const ret = wasm.parameters_u(this.__wbg_ptr);
        return CurvePoint.__wrap(ret);
    }
}
/**
*/
export class PublicKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PublicKey.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_publickey_free(ptr);
    }
    /**
    * @returns {string}
    */
    __getClassname() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickey___getClassname(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toCompressedBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickey_toCompressedBytes(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {PublicKey}
    */
    static fromCompressedBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.publickey_fromCompressedBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return PublicKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} prehash
    * @param {RecoverableSignature} signature
    * @returns {PublicKey}
    */
    static recoverFromPrehash(prehash, signature) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(prehash, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            _assertClass(signature, RecoverableSignature);
            wasm.publickey_recoverFromPrehash(retptr, ptr0, len0, signature.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return PublicKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {string}
    */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickey_toString(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1);
        }
    }
    /**
    * @param {PublicKey} other
    * @returns {boolean}
    */
    equals(other) {
        _assertClass(other, PublicKey);
        const ret = wasm.publickey_equals(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
}
/**
*/
export class RecoverableSignature {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RecoverableSignature.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_recoverablesignature_free(ptr);
    }
    /**
    * @returns {Uint8Array}
    */
    toBEBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.recoverablesignature_toBEBytes(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {RecoverableSignature}
    */
    static fromBEBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.recoverablesignature_fromBEBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return RecoverableSignature.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {string}
    */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.recoverablesignature_toString(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1);
        }
    }
    /**
    * @param {RecoverableSignature} other
    * @returns {boolean}
    */
    equals(other) {
        _assertClass(other, RecoverableSignature);
        const ret = wasm.recoverablesignature_equals(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
}
/**
*/
export class ReencryptionEvidence {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ReencryptionEvidence.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_reencryptionevidence_free(ptr);
    }
    /**
    * @param {Capsule} capsule
    * @param {VerifiedCapsuleFrag} vcfrag
    * @param {PublicKey} verifying_pk
    * @param {PublicKey} delegating_pk
    * @param {PublicKey} receiving_pk
    */
    constructor(capsule, vcfrag, verifying_pk, delegating_pk, receiving_pk) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(capsule, Capsule);
            _assertClass(vcfrag, VerifiedCapsuleFrag);
            _assertClass(verifying_pk, PublicKey);
            _assertClass(delegating_pk, PublicKey);
            _assertClass(receiving_pk, PublicKey);
            wasm.reencryptionevidence_new(retptr, capsule.__wbg_ptr, vcfrag.__wbg_ptr, verifying_pk.__wbg_ptr, delegating_pk.__wbg_ptr, receiving_pk.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return ReencryptionEvidence.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.reencryptionevidence_toBytes(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {ReencryptionEvidence}
    */
    static fromBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.reencryptionevidence_fromBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return ReencryptionEvidence.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {CurvePoint}
    */
    get e() {
        const ret = wasm.reencryptionevidence_e(this.__wbg_ptr);
        return CurvePoint.__wrap(ret);
    }
    /**
    * @returns {CurvePoint}
    */
    get ez() {
        const ret = wasm.reencryptionevidence_ez(this.__wbg_ptr);
        return CurvePoint.__wrap(ret);
    }
    /**
    * @returns {CurvePoint}
    */
    get e1() {
        const ret = wasm.reencryptionevidence_e1(this.__wbg_ptr);
        return CurvePoint.__wrap(ret);
    }
    /**
    * @returns {CurvePoint}
    */
    get e1h() {
        const ret = wasm.reencryptionevidence_e1h(this.__wbg_ptr);
        return CurvePoint.__wrap(ret);
    }
    /**
    * @returns {CurvePoint}
    */
    get e2() {
        const ret = wasm.reencryptionevidence_e2(this.__wbg_ptr);
        return CurvePoint.__wrap(ret);
    }
    /**
    * @returns {CurvePoint}
    */
    get v() {
        const ret = wasm.reencryptionevidence_v(this.__wbg_ptr);
        return CurvePoint.__wrap(ret);
    }
    /**
    * @returns {CurvePoint}
    */
    get vz() {
        const ret = wasm.reencryptionevidence_vz(this.__wbg_ptr);
        return CurvePoint.__wrap(ret);
    }
    /**
    * @returns {CurvePoint}
    */
    get v1() {
        const ret = wasm.reencryptionevidence_v1(this.__wbg_ptr);
        return CurvePoint.__wrap(ret);
    }
    /**
    * @returns {CurvePoint}
    */
    get v1h() {
        const ret = wasm.reencryptionevidence_v1h(this.__wbg_ptr);
        return CurvePoint.__wrap(ret);
    }
    /**
    * @returns {CurvePoint}
    */
    get v2() {
        const ret = wasm.reencryptionevidence_v2(this.__wbg_ptr);
        return CurvePoint.__wrap(ret);
    }
    /**
    * @returns {CurvePoint}
    */
    get uz() {
        const ret = wasm.reencryptionevidence_uz(this.__wbg_ptr);
        return CurvePoint.__wrap(ret);
    }
    /**
    * @returns {CurvePoint}
    */
    get u1() {
        const ret = wasm.reencryptionevidence_u1(this.__wbg_ptr);
        return CurvePoint.__wrap(ret);
    }
    /**
    * @returns {CurvePoint}
    */
    get u1h() {
        const ret = wasm.reencryptionevidence_u1h(this.__wbg_ptr);
        return CurvePoint.__wrap(ret);
    }
    /**
    * @returns {CurvePoint}
    */
    get u2() {
        const ret = wasm.reencryptionevidence_u2(this.__wbg_ptr);
        return CurvePoint.__wrap(ret);
    }
    /**
    * @returns {Uint8Array}
    */
    get kfragValidityMessageHash() {
        const ret = wasm.reencryptionevidence_kfragValidityMessageHash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
    * @returns {boolean}
    */
    get kfragSignatureV() {
        const ret = wasm.reencryptionevidence_kfragSignatureV(this.__wbg_ptr);
        return ret !== 0;
    }
}
/**
*/
export class SecretKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SecretKey.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_secretkey_free(ptr);
    }
    /**
    * Generates a secret key using the default RNG and returns it.
    * @returns {SecretKey}
    */
    static random() {
        const ret = wasm.secretkey_random();
        return SecretKey.__wrap(ret);
    }
    /**
    * @returns {Uint8Array}
    */
    toBEBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.secretkey_toBEBytes(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {SecretKey}
    */
    static fromBEBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.secretkey_fromBEBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return SecretKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Generates a secret key using the default RNG and returns it.
    * @returns {PublicKey}
    */
    publicKey() {
        const ret = wasm.secretkey_publicKey(this.__wbg_ptr);
        return PublicKey.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.secretkey_toString(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1);
        }
    }
}
/**
*/
export class SecretKeyFactory {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SecretKeyFactory.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_secretkeyfactory_free(ptr);
    }
    /**
    * Generates a secret key factory using the default RNG and returns it.
    * @returns {SecretKeyFactory}
    */
    static random() {
        const ret = wasm.secretkeyfactory_random();
        return SecretKeyFactory.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    static seedSize() {
        const ret = wasm.secretkeyfactory_seedSize();
        return ret >>> 0;
    }
    /**
    * @param {Uint8Array} seed
    * @returns {SecretKeyFactory}
    */
    static fromSecureRandomness(seed) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(seed, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.secretkeyfactory_fromSecureRandomness(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return SecretKeyFactory.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} label
    * @returns {Uint8Array}
    */
    makeSecret(label) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(label, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.secretkeyfactory_makeSecret(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v2 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} label
    * @returns {SecretKey}
    */
    makeKey(label) {
        const ptr0 = passArray8ToWasm0(label, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.secretkeyfactory_makeKey(this.__wbg_ptr, ptr0, len0);
        return SecretKey.__wrap(ret);
    }
    /**
    * @param {Uint8Array} label
    * @returns {SecretKeyFactory}
    */
    makeFactory(label) {
        const ptr0 = passArray8ToWasm0(label, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.secretkeyfactory_makeFactory(this.__wbg_ptr, ptr0, len0);
        return SecretKeyFactory.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.secretkeyfactory_toString(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1);
        }
    }
}
/**
*/
export class Signature {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Signature.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_signature_free(ptr);
    }
    /**
    * @param {PublicKey} verifying_pk
    * @param {Uint8Array} message
    * @returns {boolean}
    */
    verify(verifying_pk, message) {
        _assertClass(verifying_pk, PublicKey);
        const ptr0 = passArray8ToWasm0(message, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.signature_verify(this.__wbg_ptr, verifying_pk.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
    * @returns {Uint8Array}
    */
    toDerBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.signature_toDerBytes(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {Signature}
    */
    static fromDerBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.signature_fromDerBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return Signature.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBEBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.signature_toBEBytes(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {Signature}
    */
    static fromBEBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.signature_fromBEBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return Signature.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {string}
    */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.signature_toString(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1);
        }
    }
    /**
    * @param {Signature} other
    * @returns {boolean}
    */
    equals(other) {
        _assertClass(other, Signature);
        const ret = wasm.signature_equals(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
}
/**
*/
export class Signer {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Signer.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_signer_free(ptr);
    }
    /**
    * @param {SecretKey} secret_key
    */
    constructor(secret_key) {
        _assertClass(secret_key, SecretKey);
        const ret = wasm.signer_new(secret_key.__wbg_ptr);
        return Signer.__wrap(ret);
    }
    /**
    * @param {Uint8Array} message
    * @returns {Signature}
    */
    sign(message) {
        const ptr0 = passArray8ToWasm0(message, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.signer_sign(this.__wbg_ptr, ptr0, len0);
        return Signature.__wrap(ret);
    }
    /**
    * @returns {PublicKey}
    */
    verifyingKey() {
        const ret = wasm.signer_verifyingKey(this.__wbg_ptr);
        return PublicKey.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.signer_toString(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1);
        }
    }
}
/**
*/
export class VerifiedCapsuleFrag {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifiedCapsuleFrag.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifiedcapsulefrag_free(ptr);
    }
    /**
    * @returns {string}
    */
    __getClassname() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.verifiedcapsulefrag___getClassname(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1);
        }
    }
    /**
    * @returns {CapsuleFrag}
    */
    unverify() {
        const ret = wasm.capsulefrag_skipVerification(this.__wbg_ptr);
        return CapsuleFrag.__wrap(ret);
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.verifiedcapsulefrag_toBytes(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytesSimple() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.capsulefrag_toBytesSimple(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {string}
    */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.verifiedcapsulefrag_toString(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1);
        }
    }
    /**
    * @param {VerifiedCapsuleFrag} other
    * @returns {boolean}
    */
    equals(other) {
        _assertClass(other, VerifiedCapsuleFrag);
        const ret = wasm.capsulefrag_equals(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
}
/**
*/
export class VerifiedKeyFrag {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifiedKeyFrag.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifiedkeyfrag_free(ptr);
    }
    /**
    * @returns {string}
    */
    __getClassname() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.verifiedkeyfrag___getClassname(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.verifiedkeyfrag_toBytes(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {string}
    */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.verifiedkeyfrag_toString(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1);
        }
    }
    /**
    * @param {VerifiedKeyFrag} other
    * @returns {boolean}
    */
    equals(other) {
        _assertClass(other, VerifiedKeyFrag);
        const ret = wasm.keyfrag_equals(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
}

export function __wbindgen_debug_string(arg0, arg1) {
    const ret = debugString(getObject(arg1));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export function __wbindgen_memory() {
    const ret = wasm.memory;
    return addHeapObject(ret);
};

export function __wbg_get_7303ed2ef026b2f5(arg0, arg1) {
    const ret = getObject(arg0)[arg1 >>> 0];
    return addHeapObject(ret);
};

export function __wbg_length_820c786973abdd8a(arg0) {
    const ret = getObject(arg0).length;
    return ret;
};

export function __wbg_new_0394642eae39db16() {
    const ret = new Array();
    return addHeapObject(ret);
};

export function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
};

export function __wbindgen_is_function(arg0) {
    const ret = typeof(getObject(arg0)) === 'function';
    return ret;
};

export function __wbg_newnoargs_c9e6043b8ad84109(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export function __wbindgen_is_object(arg0) {
    const val = getObject(arg0);
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
};

export function __wbg_get_f53c921291c381bd() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_call_557a2f2deacc4912() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbindgen_is_string(arg0) {
    const ret = typeof(getObject(arg0)) === 'string';
    return ret;
};

export function __wbindgen_number_get(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'number' ? obj : undefined;
    getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
    getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
};

export function __wbindgen_string_get(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};

export function __wbindgen_string_new(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export function __wbindgen_object_clone_ref(arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
};

export function __wbg_self_742dd6eab3e9211e() { return handleError(function () {
    const ret = self.self;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_window_c409e731db53a0e2() { return handleError(function () {
    const ret = window.window;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_globalThis_b70c095388441f2d() { return handleError(function () {
    const ret = globalThis.globalThis;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_global_1c72617491ed7194() { return handleError(function () {
    const ret = global.global;
    return addHeapObject(ret);
}, arguments) };

export function __wbindgen_is_undefined(arg0) {
    const ret = getObject(arg0) === undefined;
    return ret;
};

export function __wbg_isArray_04e59fb73f78ab5b(arg0) {
    const ret = Array.isArray(getObject(arg0));
    return ret;
};

export function __wbg_push_109cfc26d02582dd(arg0, arg1) {
    const ret = getObject(arg0).push(getObject(arg1));
    return ret;
};

export function __wbg_new_87297f22973157c8(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export function __wbg_call_587b30eea3e09332() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_buffer_55ba7a6b1b92e2ac(arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};

export function __wbg_newwithbyteoffsetandlength_88d1d8be5df94b9b(arg0, arg1, arg2) {
    const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

export function __wbg_new_09938a7d020f049b(arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
};

export function __wbg_set_3698e3ca519b3c3c(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};

export function __wbg_length_0aab7ffd65ad19ed(arg0) {
    const ret = getObject(arg0).length;
    return ret;
};

export function __wbg_newwithlength_89eeca401d8918c2(arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return addHeapObject(ret);
};

export function __wbg_subarray_d82be056deb4ad27(arg0, arg1, arg2) {
    const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

export function __wbindgen_is_null(arg0) {
    const ret = getObject(arg0) === null;
    return ret;
};

export function __wbg_capsule_new(arg0) {
    const ret = Capsule.__wrap(arg0);
    return addHeapObject(ret);
};

export function __wbg_verifiedkeyfrag_new(arg0) {
    const ret = VerifiedKeyFrag.__wrap(arg0);
    return addHeapObject(ret);
};

export function __wbg_randomFillSync_6894564c2c334c42() { return handleError(function (arg0, arg1, arg2) {
    getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
}, arguments) };

export function __wbg_getRandomValues_805f1c3d65988a5a() { return handleError(function (arg0, arg1) {
    getObject(arg0).getRandomValues(getObject(arg1));
}, arguments) };

export function __wbg_crypto_e1d53a1d73fb10b8(arg0) {
    const ret = getObject(arg0).crypto;
    return addHeapObject(ret);
};

export function __wbg_process_038c26bf42b093f8(arg0) {
    const ret = getObject(arg0).process;
    return addHeapObject(ret);
};

export function __wbg_versions_ab37218d2f0b24a8(arg0) {
    const ret = getObject(arg0).versions;
    return addHeapObject(ret);
};

export function __wbg_node_080f4b19d15bc1fe(arg0) {
    const ret = getObject(arg0).node;
    return addHeapObject(ret);
};

export function __wbg_msCrypto_6e7d3e1f92610cbb(arg0) {
    const ret = getObject(arg0).msCrypto;
    return addHeapObject(ret);
};

export function __wbg_require_78a3dcfbdba9cbce() { return handleError(function () {
    const ret = module.require;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_apply_46ea2bb0ad750196() { return handleError(function (arg0, arg1, arg2) {
    const ret = Reflect.apply(getObject(arg0), getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

