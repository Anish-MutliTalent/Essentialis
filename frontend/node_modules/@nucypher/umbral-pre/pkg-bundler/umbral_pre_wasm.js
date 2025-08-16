import * as wasm from "./umbral_pre_wasm_bg.wasm";
import { __wbg_set_wasm } from "./umbral_pre_wasm_bg.js";
__wbg_set_wasm(wasm);
export * from "./umbral_pre_wasm_bg.js";
