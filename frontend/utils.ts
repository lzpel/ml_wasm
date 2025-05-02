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