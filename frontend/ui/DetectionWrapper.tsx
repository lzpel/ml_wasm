"use client"
import React from "react";
import {Detection} from "@/output";
const DetectionWrapper = (props:{children?:React.ReactNode, detections?: Detection[]|Promise<Detection[]>}) => {
    // children
    // example <video src="/sample.mp4" controls style={{width: "100%", height: "auto", display: "block"}}/>
    const children=props.children
    // detections
    const [detections, setDetections] = React.useState<Detection[]>(isArray(props.detections)?props.detections:[]);
    React.useEffect(() => {
        if(isPromise(props.detections))props.detections.then(value => setDetections(value));
    }, [props.detections]);
    const detection=detections.map((v,i)=> {
        const style: React.CSSProperties = {
            boxSizing: "border-box",
            position: "absolute" as const,
            left: `${v.x1 * 100}%`,
            top: `${v.y1 * 100}%`,
            right: `${(1-v.x2) * 100}%`,
            bottom: `${(1-v.y2) * 100}%`,
            border: "2px solid",
            borderColor: `rgb(${v.class&1?255:0},${v.class&2?255:0},${v.class&4?255:0})`,
            pointerEvents: "none", // 動画操作を邪魔しない
        };
        return <div key={i} style={style}></div>
    })
    return (
        <div style={{
            position: "relative",
            boxSizing: "border-box",
            width: "100%",
            height: "auto"
        }}>
            {children}
            {detection}
        </div>
    );
};
function isArray(data: unknown): data is unknown[] {
    return Array.isArray(data);
}
function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
    return typeof (value as any)?.then === "function";
}
export default DetectionWrapper;