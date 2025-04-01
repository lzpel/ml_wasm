"use client"
import React from "react";
import DetectedImage from "@/ui/DetectedImage";
import {arrayBuffer} from "node:stream/consumers";

export default function FetchDetectedImage(props: { src: string; }) {
	const [data, setData] = React.useState<ArrayBuffer | string>("now loading");

	React.useEffect(() => {
		fetch(props.src)
			.then(res=>res.arrayBuffer())
			.then(res=> {
				const mes=`画像のダウンロードに成功: ${res.byteLength}`
				console.log(mes)
				setData(res)
			})
			.catch(error=> {
				const mes=`画像のダウンロードに失敗: ${error}`
				console.log(mes)
				setData(mes)
			})
	}, [props.src]);
	if (typeof data === "string") {
		return <div>Loading image...</div>;
	} else {
		return <DetectedImage u8array={new Uint8Array(data)}/>
	}
}