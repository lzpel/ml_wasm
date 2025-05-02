import {Detection, yolov8} from "@/output";

export async function fetchArrayBuffer(url: string): Promise<ArrayBuffer> {
    return fetch(url)
        .then(res=>res.arrayBuffer())
        .then(res=> {
            console.log(`ダウンロード成功 ${url} ${res.byteLength}`)
            return res
        })
        .catch(error=> {
            console.error(`ダウンロード失敗 ${url}`, error)
            throw error
        })
}

export async function recognition(onnx: Promise<ArrayBuffer>, image: Promise<ArrayBuffer>): Promise<Detection[]>{
    return Promise.all([onnx, image])
        .then(([onnx, image])=>{
            const u8image=new Uint8Array(image)
            const u8onnx=new Uint8Array(onnx)
            return yolov8(u8image, u8onnx)
        })
        .catch((error) => {
            console.error("Download fail", error);
            return []
        })
}