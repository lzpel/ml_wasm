use image::ImageResult;
use wasm_bindgen::prelude::wasm_bindgen;
use std::io::Read;

pub mod yolov8;

#[wasm_bindgen]
pub fn yolov8(input_image: Vec<u8>, onnx_bytes: Vec<u8>) -> Result<Vec<u8>, String>{
	console_error_panic_hook::set_once();
    let onnx_file=std::io::Cursor::new(onnx_bytes);
    fn inner(onnx_file: impl Read, input_image: Vec<u8>)->ImageResult<Vec<u8>>{
        let input_image=image::load_from_memory(input_image.as_slice())?;
        let (img, out) = yolov8::yolov8(onnx_file, &input_image, 0.5).expect("TODO: panic message");
        let output_image=yolov8::image_with_bbox(&img, &out);
        let mut buffer = std::io::Cursor::new(Vec::new());
        output_image.write_to(&mut buffer, image::ImageFormat::Png)?;
        Ok(buffer.into_inner())
    }
    inner(onnx_file, input_image).map_err(|v| v.to_string())
}
#[wasm_bindgen]
pub fn yolov8_test(input_image: Vec<u8>) -> Result<Vec<u8>, String>{
	console_error_panic_hook::set_once();
    Ok(input_image)
}