use wasm_bindgen::prelude::wasm_bindgen;
pub mod yolov8;

#[wasm_bindgen]
pub struct Detection{
    pub x1: f32,
    pub y1: f32,
    pub x2: f32,
    pub y2: f32,
    pub probability: f32,
    pub class: usize,
}
impl From<yolov8::BBox> for Detection {
    fn from(x: yolov8::BBox) -> Self {
        Self{
            x1: x.x1,
            y1: x.y1,
            x2: x.x2,
            y2: x.y2,
            probability: x.probability,
            class: x.class,
        }
    }
}
#[wasm_bindgen]
pub fn yolov8(input_image: Vec<u8>, onnx_bytes: Vec<u8>) -> Result<Vec<Detection>, String>{
	console_error_panic_hook::set_once();
    let input_image=image::load_from_memory(input_image.as_slice()).map_err(|e| e.to_string())?;
    let onnx_file=std::io::Cursor::new(onnx_bytes);
    let out = yolov8::yolov8(onnx_file, &input_image, 0.5).expect("TODO: panic message");
    Ok(out.into_iter().map(Detection::from).collect())
}
#[wasm_bindgen]
pub fn yolov8_test(input_image: Vec<u8>) -> Result<Vec<u8>, String>{
	console_error_panic_hook::set_once();
    Ok(input_image)
}