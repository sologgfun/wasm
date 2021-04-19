use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn digest(str: &str) -> String {
    let digest = md5::compute(str);
    let res = format!("{:x}", digest);
    return res;
}
