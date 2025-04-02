use std::io::Read;
use image::{DynamicImage, GenericImageView, Pixel};
use tract_onnx::prelude::*;
use tract_onnx::tract_core::ndarray::Axis;

pub fn yolov8(mut model_file: impl Read, original_img: &image::DynamicImage, confidence: f32) -> TractResult<(DynamicImage, Vec<BBox>)> {
    let size = 640usize;
    let model = tract_onnx::onnx()
        // load the model
        .model_for_read(&mut model_file)?
        // optimize the model
        .into_optimized()?;
    //モデル構造の可視化
    for input in model.input_outlets()? {
        println!("Input: {:?}, Shape: {:?}", input, model.outlet_fact(*input)?);
    }
    for output in model.output_outlets()? {
        println!("Output: {:?}, Shape: {:?}", output, model.outlet_fact(*output)?);
    }
    // make the model runnable and fix its inputs and outputs
    let model_runnable=model.into_runnable()?;
    let img = resize_with_padding(size, original_img);
    //https://github.com/pykeio/ort/blob/main/examples/yolov8/examples/yolov8.rs
    //let input: Vec<f32> = [0, 1, 2].into_iter().map(|v| img.pixels().map(move |(_x, _y, c)| c.channels()[v] as f32 / 255.)).flatten().collect();
    let image: Tensor = tract_ndarray::Array4::from_shape_fn((1, 3, size, size), |(_, c, y, x)| {
        img.get_pixel(x as _, y as _).channels()[c as usize] as f32 / 255.
    }).into();
    let results = model_runnable.run(tvec!(image.into()))?;
    let result = &results[0];
    let output_tensor = result.to_array_view::<f32>()?;
    let output_tensor_0=output_tensor.index_axis(Axis(0), 0);
    //println!("{:?}", result.shape());
    let mut boxes: Vec<BBox> = Default::default();
    for row in output_tensor_0.axis_iter(Axis(1)){
        let mut i =row.iter();
        let x_center_y_center_w_h:[f32;4]= std::array::from_fn(|_| *i.next().unwrap()/size as f32);
        let (class, prob) = i.enumerate()
            .reduce(|accum, row| if row.1 > accum.1 { row } else { accum })
            .unwrap();
        if *prob > confidence {
            boxes.push(BBox::new(x_center_y_center_w_h, *prob, class));
        }
    }
    Ok((img, BBox::nms(boxes, 0.45)))
}
#[derive(Debug, Clone, Copy)]
pub struct BBox {
    pub x1: f32,
    pub y1: f32,
    pub x2: f32,
    pub y2: f32,
    pub probability: f32,
    pub class: usize,
}
impl BBox {
    pub fn new([xc, yc, w, h]: [f32; 4], probability: f32, class: usize) -> Self {
        Self {
            x1: xc - w / 2.,
            y1: yc - h / 2.,
            x2: xc + w / 2.,
            y2: yc + h / 2.,
            probability,
            class,
        }
    }
    pub fn intersection(&self, other: &Self) -> f32 {
        (self.x2.min(other.x2) - self.x1.max(other.x1)).max(0.0) * (self.y2.min(other.y2) - self.y1.max(other.y1)).max(0.0)
    }
    pub fn union(&self, other: &Self) -> f32 {
        ((self.x2 - self.x1) * (self.y2 - self.y1)) + ((other.x2 - other.x1) * (other.y2 - other.y1)) - self.intersection(other)
    }
    pub fn iou(&self, other: &Self) -> f32 {
        self.intersection(other) / self.union(other)
    }
    pub fn quantized_box(&self, width: usize, height: usize) -> [usize; 4] {
        [(self.x1, width), (self.y1, height), (self.x2, width), (self.y2, height)].map(|v| ((v.0 * v.1 as f32) as usize).min(v.1 - 1).max(0))
    }
    pub fn nms(boxes: Vec<Self>, iou_threshold: f32) -> Vec<Self> {
        let mut sorted_boxes = boxes.clone();
        sorted_boxes.sort_by(|a, b| a.probability.partial_cmp(&b.probability).unwrap());
        let mut result = Vec::new();
        while let Some(best_box) = sorted_boxes.pop() {
            result.push(best_box);
            sorted_boxes.retain(|bbox| best_box.iou(&bbox) < iou_threshold);
        }
        result
    }
}
pub fn resize_with_padding(size: usize, src: &image::DynamicImage) -> image::DynamicImage {
    let mut dst = image::ImageBuffer::from_pixel(size as u32, size as u32, image::Rgb([255, 255, 255]));
    let resized = src.resize(size as u32, size as u32, image::imageops::CatmullRom);
    let (x_offset, y_offset) = ((dst.width() - resized.width()) / 2, (dst.height() - resized.height()) / 2);
    resized.pixels().for_each(|(x, y, pixel)| dst.put_pixel(x + x_offset, y + y_offset, pixel.to_rgb()));
    image::DynamicImage::from(dst)
}
pub fn image_with_bbox(src: &image::DynamicImage, bbox: &Vec<BBox>) -> image::DynamicImage {
    let mut dst = src.clone().into_rgb8();
    for i in bbox {
        let [x1, y1, x2, y2] = i.quantized_box(src.width() as usize, src.height() as usize);
        let color = image::Rgb([0, 1, 2].map(|v| ((i.class + 1) >> v) & 1 != 0).map(|v| if v { 255 } else { 50 }));
        for x in x1..x2 {
            dst.put_pixel(x as u32, y1 as u32, color);
            dst.put_pixel(x as u32, y2 as u32, color);
        }
        for y in y1..y2 {
            dst.put_pixel(x1 as u32, y as u32, color);
            dst.put_pixel(x2 as u32, y as u32, color);
        }
    }
    dst.into()
}

#[cfg(test)]
mod tests {
    use std::{fs, io};
    use std::path::Path;
    use super::*;
    #[test]
    fn test_resize_with_padding() {
        let output = resize_with_padding(320, &load_image());
        output.save("test_resize_with_padding.out.png").unwrap();
    }
    #[test]
    fn test_yolov8n() {
        let (img, out) = yolov8(open("onnx/yolov8n.onnx").unwrap(), &load_image(), 0.5).unwrap();
        image_with_bbox(&img, &out).save("test_yolov8n.out.png").unwrap();
    }
    fn load_image() -> DynamicImage {
        image::open(r"input/baseball.jpg").unwrap()
    }
    fn open<P: AsRef<Path>>(path: P) -> io::Result<io::BufReader<fs::File>> {
        Ok(io::BufReader::new(fs::File::open(path)?))
    }
}