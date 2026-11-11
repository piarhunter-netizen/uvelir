"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { ProfileId } from "@/lib/data";
import { roundDiameter } from "@/lib/diamonds";

export type Ring3DProps = {
  color: string;
  profile: ProfileId;
  size: number;
  width: number;
  thickness: number;
  track?: { mode: "top" | "half" | "eternity"; count: number; stoneMm: number } | null;
  centerCarat?: number | null;
  halo?: { count: number; stoneMm: number } | null;
  autoRotate?: boolean;
  className?: string;
  label?: string;
};

type Scene = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  holder: THREE.Group;
  metal: THREE.MeshPhysicalMaterial;
  gem: THREE.MeshPhysicalMaterial;
};

// Сечение шинки как суперэллипс: показатель степени задаёт форму профиля
function bandProfile(kind: ProfileId, ri: number, t: number, b: number) {
  const exps: Record<ProfileId, [number, number]> = { flat: [9, 9], comfort: [4.5, 3.2], round: [2.1, 9] };
  const [nOut, nIn] = exps[kind];
  const cx = ri + t / 2;
  const pts: THREE.Vector2[] = [];
  const N = 120;
  for (let i = N; i >= 0; i--) {
    const phi = (i / N) * Math.PI * 2;
    const c = Math.cos(phi);
    const s = Math.sin(phi);
    const n = c >= 0 ? nOut : nIn;
    const x = cx + (t / 2) * Math.sign(c) * Math.pow(Math.abs(c), 2 / n);
    const y = (b / 2) * Math.sign(s) * Math.pow(Math.abs(s), 2 / n);
    pts.push(new THREE.Vector2(x, y));
  }
  return pts;
}

// Круглый бриллиант: корона, рундист, павильон; плоские грани дают игру света
function brilliantGeometry(d: number) {
  const pts = [
    new THREE.Vector2(0.0001, -0.43 * d),
    new THREE.Vector2(0.5 * d, -0.01 * d),
    new THREE.Vector2(0.5 * d, 0.015 * d),
    new THREE.Vector2(0.29 * d, 0.16 * d),
    new THREE.Vector2(0.0001, 0.16 * d),
  ];
  const g = new THREE.LatheGeometry(pts, 16);
  return g.toNonIndexed();
}

const UP = new THREE.Vector3(0, 1, 0);

function cylinderBetween(a: THREE.Vector3, b: THREE.Vector3, r: number, mat: THREE.Material) {
  const len = a.distanceTo(b);
  const geo = new THREE.CylinderGeometry(r * 0.8, r, len, 12);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(UP, b.clone().sub(a).normalize());
  const cap = new THREE.Mesh(new THREE.SphereGeometry(r * 0.85, 12, 8), mat);
  cap.position.copy(b);
  const g = new THREE.Group();
  g.add(mesh, cap);
  return g;
}

function buildRing(p: Ring3DProps, s: Scene) {
  const ri = p.size / 2;
  const ro = ri + p.thickness;
  const group = new THREE.Group();

  const band = new THREE.Mesh(new THREE.LatheGeometry(bandProfile(p.profile, ri, p.thickness, p.width), 160), s.metal);
  band.rotation.x = Math.PI / 2;
  group.add(band);

  // Дорожка камней по наружной поверхности
  if (p.track && p.track.count > 0) {
    const { stoneMm, count, mode } = p.track;
    const geo = brilliantGeometry(stoneMm);
    const step = (stoneMm + 0.2) / ro;
    const angles: number[] = [];
    if (mode === "eternity") {
      for (let i = 0; i < count; i++) angles.push((i / count) * Math.PI * 2);
    } else if (mode === "top") {
      for (let i = 0; i < count; i++) angles.push((i - (count - 1) / 2) * step);
    } else {
      const start = p.centerCarat ? (roundDiameter(p.centerCarat) * 0.45 + 0.9) / ro : step;
      const side = Math.floor(count / 2);
      for (let i = 0; i < side; i++) {
        angles.push(start + i * step, -(start + i * step));
      }
    }
    for (const a of angles) {
      const dir = new THREE.Vector3(Math.sin(a), Math.cos(a), 0);
      const gem = new THREE.Mesh(geo, s.gem);
      gem.position.copy(dir).multiplyScalar(ro - stoneMm * 0.1);
      gem.quaternion.setFromUnitVectors(UP, dir);
      group.add(gem);
    }
  }

  // Центральный камень в крапанах
  if (p.centerCarat) {
    const d = roundDiameter(p.centerCarat);
    const girdleY = ro + 0.43 * d + 0.35;
    const stone = new THREE.Mesh(brilliantGeometry(d), s.gem);
    stone.position.set(0, girdleY, 0);
    group.add(stone);

    const prongR = 0.045 * d + 0.22;
    for (let i = 0; i < 4; i++) {
      const ang = Math.PI / 4 + (i * Math.PI) / 2;
      const base = new THREE.Vector3(Math.cos(ang) * 0.22 * d, ro - 0.25, Math.sin(ang) * 0.22 * d);
      const top = new THREE.Vector3(Math.cos(ang) * 0.5 * d, girdleY + 0.1 * d, Math.sin(ang) * 0.5 * d);
      group.add(cylinderBetween(base, top, prongR, s.metal));
    }
    const gallery = new THREE.Mesh(new THREE.TorusGeometry(0.36 * d, 0.05 * d + 0.12, 10, 48), s.metal);
    gallery.rotation.x = Math.PI / 2;
    gallery.position.y = girdleY - 0.24 * d;
    group.add(gallery);

    if (p.halo && p.halo.count > 0) {
      const hr = 0.5 * d + p.halo.stoneMm / 2 + 0.15;
      const hgeo = brilliantGeometry(p.halo.stoneMm);
      for (let i = 0; i < p.halo.count; i++) {
        const ang = (i / p.halo.count) * Math.PI * 2;
        const gem = new THREE.Mesh(hgeo, s.gem);
        gem.position.set(Math.cos(ang) * hr, girdleY - 0.08 * d, Math.sin(ang) * hr);
        group.add(gem);
      }
      const seat = new THREE.Mesh(new THREE.TorusGeometry(hr, p.halo.stoneMm * 0.42, 10, 64), s.metal);
      seat.rotation.x = Math.PI / 2;
      seat.position.y = girdleY - 0.08 * d - p.halo.stoneMm * 0.42;
      group.add(seat);
    }
  }
  return group;
}

function disposeGroup(g: THREE.Object3D) {
  g.traverse((o) => {
    if (o instanceof THREE.Mesh) o.geometry.dispose();
  });
}

export default function Ring3D(props: Ring3DProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Scene | null>(null);

  // Сцена создаётся один раз
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.035).texture;
    scene.environment = envTex;

    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(20, 30, 25);
    scene.add(key);
    scene.add(new THREE.AmbientLight(0xffffff, 0.15));

    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 500);
    camera.position.set(0, 14, 52);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    controls.autoRotate = (props.autoRotate ?? true) && !reduce;
    controls.autoRotateSpeed = 1.6;
    // На телефоне палец прокручивает страницу, а кольцо вращается само
    if (window.matchMedia("(pointer: coarse)").matches) {
      controls.enableRotate = false;
      renderer.domElement.style.touchAction = "pan-y";
    }

    const holder = new THREE.Group();
    holder.rotation.x = -0.18;
    scene.add(holder);

    const metal = new THREE.MeshPhysicalMaterial({ color: props.color, metalness: 1, roughness: 0.17, clearcoat: 0.25, clearcoatRoughness: 0.1 });
    const gem = new THREE.MeshPhysicalMaterial({ color: 0xdfe7f0, metalness: 0.55, roughness: 0.02, flatShading: true, envMapIntensity: 2.6, clearcoat: 1, ior: 2.42 });

    sceneRef.current = { renderer, scene, camera, controls, holder, metal, gem };

    const resize = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      controls.update();
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      controls.dispose();
      disposeGroup(holder);
      metal.dispose();
      gem.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      sceneRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const trackKey = props.track ? `${props.track.mode}-${props.track.count}-${props.track.stoneMm}` : "none";
  const haloKey = props.halo ? `${props.halo.count}-${props.halo.stoneMm}` : "none";

  // Модель перестраивается при изменении параметров
  useEffect(() => {
    const s = sceneRef.current;
    if (!s) return;
    s.metal.color.set(props.color);
    for (const child of [...s.holder.children]) {
      s.holder.remove(child);
      disposeGroup(child);
    }
    const ring = buildRing(props, s);
    s.holder.add(ring);

    // Камера отъезжает так, чтобы кольцо целиком помещалось в кадр
    const box = new THREE.Box3().setFromObject(ring);
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    s.controls.target.copy(sphere.center);
    const dist = sphere.radius / Math.sin(THREE.MathUtils.degToRad(s.camera.fov / 2)) * 1.08;
    const dir = s.camera.position.clone().sub(s.controls.target).normalize();
    s.camera.position.copy(sphere.center).add(dir.multiplyScalar(dist));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.color, props.profile, props.size, props.width, props.thickness, trackKey, props.centerCarat, haloKey]);

  return (
    <div
      ref={wrap}
      className={props.className}
      role="img"
      aria-label={props.label ?? "3D-модель кольца. Потяните, чтобы повернуть."}
    />
  );
}
