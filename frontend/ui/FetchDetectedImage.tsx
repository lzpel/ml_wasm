"use client"
import React from "react";
import {fetchArrayBuffer} from "@/utils";
import {Detection, yolov8} from "@/output";
import DetectionOverlay from "@/ui/DetectionOverlay";

export async function recognition(onnx: Promise<ArrayBuffer>, image: Promise<ArrayBuffer>): Promise<Detection[]>{
	return Promise.all([onnx, image])
		.then(([onnx, image])=>yolov8(new Uint8Array(image), new Uint8Array(onnx)))
		.catch((error) => {
			console.error("Download fail", error);
			return []
		})
}

export default function FetchDetectedImage(props: { children?: React.ReactNode, src: string,  onnx: string }) {
	const result=recognition(fetchArrayBuffer(props.onnx), fetchArrayBuffer(props.src))

	return <DetectionOverlay detections={result}>
		<img src={props.src} width="100%" height={"auto"}/>
	</DetectionOverlay>
}