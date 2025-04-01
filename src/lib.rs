use wasm_bindgen::prelude::wasm_bindgen;

pub mod yolov8;

fn main() {
    println!("Hello, world!");
}

#[wasm_bindgen]
pub fn yolov8(input_image: Vec<u8>) -> Result<Vec<u8>, String>{
    let input_image=image::load_from_memory(input_image.as_slice()).map_err(|e| e.to_string())?;
    let (img, out) = yolov8::yolov8("yolov8n.onnx", &input_image, 0.5).expect("TODO: panic message");
    let output_image=yolov8::image_with_bbox(&img, &out);
    Ok(output_image.into_bytes())
}