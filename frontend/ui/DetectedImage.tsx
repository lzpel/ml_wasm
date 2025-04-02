"use client"
import React from "react";
import {yolov8, yolov8_test} from "@/output";

export default function DetectedImage(props: { src: Uint8Array, onnx: Uint8Array; }) {
	const [imageUrl, setImageUrl] = React.useState<string | null>(null);

	React.useEffect(() => {
		// Uint8Array -> Blob -> Object URL
		const data = yolov8(props.src, props.onnx)
		const blob = new Blob([data], {type: "image/png"}); // または image/jpeg 等
		const url = URL.createObjectURL(blob);
		setImageUrl(url);
		// クリーンアップでURL開放
		return () => {
			URL.revokeObjectURL(url);
		};
	}, [props.src]);

	if (!imageUrl) return <div>ML Running...</div>;

	return <img src={imageUrl} alt="From Uint8Array"/>;
}