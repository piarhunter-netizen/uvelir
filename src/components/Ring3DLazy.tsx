"use client";

import dynamic from "next/dynamic";
import type { Ring3DProps } from "./Ring3D";

// three.js грузится только в браузере и только там, где нужен 3D
const Ring3D = dynamic(() => import("./Ring3D"), {
  ssr: false,
  loading: () => <div className="ring3d" aria-hidden="true" />,
});

export default function Ring3DLazy(props: Ring3DProps) {
  return <Ring3D {...props} />;
}
