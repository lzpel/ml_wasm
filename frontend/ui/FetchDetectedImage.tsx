"use client"
import React from "react";
import DetectedImage from "@/ui/DetectedImage";

export default function FetchDetectedImage(props: { src: string,  onnx: string }) {
	const [src, setSrc] = React.useState<ArrayBuffer|undefined>();
	const [onnx, setOnnx] = React.useState<ArrayBuffer|undefined>();

	React.useEffect(() => {
		fetch(props.src)
			.then(res=>res.arrayBuffer())
			.then(res=> {
				const mes=`画像のダウンロードに成功: ${res.byteLength}`
				console.log(mes)
				setSrc(res)
			})
			.catch(error=> {
				const mes=`画像のダウンロードに失敗: ${error}`
				console.log(mes)
				setSrc(undefined)
			})
	}, [props.src]);
	React.useEffect(() => {
		fetch(props.onnx)
			.then(res=>res.arrayBuffer())
			.then(res=> {
				const mes=`モデルのダウンロードに成功: ${res.byteLength}`
				console.log(mes)
				setOnnx(res)
			})
			.catch(error=> {
				const mes=`モデルのダウンロードに失敗: ${error}`
				console.log(mes)
				setOnnx(undefined)
			})
	}, [props.onnx]);
	if (src && onnx) {
		return <DetectedImage src={new Uint8Array(src)} onnx={new Uint8Array(onnx)}/>
	} else {
		return <div>Loading image...</div>;
	}
}