"use client"
import React from "react";
import {fetchArrayBuffer, recognition} from "@/utils";
import {Detection, yolov8} from "@/output";
import DetectionWrapper from "@/ui/DetectionWrapper";

export default function FetchDetectedImage(props: { children?: React.ReactNode, src: string,  onnx: string }) {
	const result=recognition(fetchArrayBuffer(props.onnx), fetchArrayBuffer(props.src))

	return <DetectionWrapper detections={result}>
		<img src={props.src} width="100%" height={"auto"} alt={"image src"}/>
	</DetectionWrapper>
}