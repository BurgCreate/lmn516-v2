"use client";

import { useEffect, useRef } from "react";

type Daisy = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  angle: number;
  angularVelocity: number;
  settledFrames: number;
};

const MAX_DAISIES = 42;
const GRAVITY = 0.2;
const AIR_DRAG = 0.996;
const FLOOR_FRICTION = 0.94;
const BOUNCE = 0.38;

export default function DaisyCursorPhysics() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const precisePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    );

    if (!precisePointer.matches) return;

    const cursor = cursorRef.current;
    const canvas = canvasRef.current;
    if (!cursor || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    document.documentElement.classList.add("has-daisy-cursor");

    let width = window.innerWidth;
    let height = window.innerHeight;
    let pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    let pointerX = width / 2;
    let pointerY = height / 2;
    let animationFrame = 0;
    let lastTime = performance.now();
    let spinCount = 0;
    let recentClicks: number[] = [];
    const daisies: Daisy[] = [];

    const daisyImage = new Image();
    daisyImage.src = "/cursors/daisy-cursor.svg";

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    function moveCursor(event: PointerEvent) {
      pointerX = event.clientX;
      pointerY = event.clientY;
      cursor.style.setProperty("--daisy-x", `${pointerX}px`);
      cursor.style.setProperty("--daisy-y", `${pointerY}px`);
      cursor.classList.add("is-visible");
    }

    function hideCursor() {
      cursor.classList.remove("is-visible");
    }

    function spawnDaisy(x: number, y: number, burst = false) {
      const radius = burst
        ? 11 + Math.random() * 13
        : 13 + Math.random() * 8;
      const cornerDirection = x < width / 2 ? -1 : 1;
      const spread = burst ? 3.8 : 1.8;

      daisies.push({
        x,
        y,
        vx:
          cornerDirection * (0.7 + Math.random() * 1.8) +
          (Math.random() - 0.5) * spread,
        vy: -(burst ? 3.5 + Math.random() * 4.5 : 1.8 + Math.random() * 2.8),
        radius,
        angle: Math.random() * Math.PI * 2,
        angularVelocity: (Math.random() - 0.5) * 0.22,
        settledFrames: 0
      });

      if (daisies.length > MAX_DAISIES) {
        daisies.splice(0, daisies.length - MAX_DAISIES);
      }
    }

    function handleClick(event: MouseEvent) {
      if (event.button !== 0) return;

      spinCount += 1;
      cursor.style.setProperty("--daisy-spin", `${spinCount * 360}deg`);
      cursor.classList.remove("is-clicking");
      void cursor.offsetWidth;
      cursor.classList.add("is-clicking");

      const now = performance.now();
      recentClicks = recentClicks.filter((time) => now - time < 900);
      recentClicks.push(now);

      spawnDaisy(event.clientX, event.clientY);

      if (recentClicks.length >= 4) {
        const burstAmount = Math.min(7, recentClicks.length + 1);
        for (let index = 0; index < burstAmount; index += 1) {
          spawnDaisy(event.clientX, event.clientY, true);
        }
        recentClicks = [];
      }
    }

    function resolveCollisions() {
      for (let i = 0; i < daisies.length; i += 1) {
        for (let j = i + 1; j < daisies.length; j += 1) {
          const first = daisies[i];
          const second = daisies[j];
          const dx = second.x - first.x;
          const dy = second.y - first.y;
          const minDistance = first.radius + second.radius;
          const distanceSquared = dx * dx + dy * dy;

          if (distanceSquared === 0 || distanceSquared >= minDistance * minDistance) {
            continue;
          }

          const distance = Math.sqrt(distanceSquared);
          const nx = dx / distance;
          const ny = dy / distance;
          const overlap = minDistance - distance;
          const totalRadius = first.radius + second.radius;
          const firstShare = second.radius / totalRadius;
          const secondShare = first.radius / totalRadius;

          first.x -= nx * overlap * firstShare;
          first.y -= ny * overlap * firstShare;
          second.x += nx * overlap * secondShare;
          second.y += ny * overlap * secondShare;

          const relativeVelocityX = second.vx - first.vx;
          const relativeVelocityY = second.vy - first.vy;
          const speedAlongNormal =
            relativeVelocityX * nx + relativeVelocityY * ny;

          if (speedAlongNormal < 0) {
            const impulse = -(1 + BOUNCE) * speedAlongNormal * 0.5;
            first.vx -= impulse * nx;
            first.vy -= impulse * ny;
            second.vx += impulse * nx;
            second.vy += impulse * ny;
          }

          first.angularVelocity += (Math.random() - 0.5) * 0.015;
          second.angularVelocity += (Math.random() - 0.5) * 0.015;
        }
      }
    }

    function updateDaisies(step: number) {
      const floor = height - 5;

      for (const daisy of daisies) {
        daisy.vy += GRAVITY * step;
        daisy.vx *= Math.pow(AIR_DRAG, step);
        daisy.vy *= Math.pow(AIR_DRAG, step);
        daisy.x += daisy.vx * step;
        daisy.y += daisy.vy * step;
        daisy.angle += daisy.angularVelocity * step;

        if (daisy.x - daisy.radius < 0) {
          daisy.x = daisy.radius;
          daisy.vx = Math.abs(daisy.vx) * BOUNCE;
        } else if (daisy.x + daisy.radius > width) {
          daisy.x = width - daisy.radius;
          daisy.vx = -Math.abs(daisy.vx) * BOUNCE;
        }

        if (daisy.y + daisy.radius > floor) {
          daisy.y = floor - daisy.radius;
          daisy.vy = -Math.abs(daisy.vy) * BOUNCE;
          daisy.vx *= FLOOR_FRICTION;
          daisy.angularVelocity *= 0.9;

          if (Math.abs(daisy.vy) < 0.3 && Math.abs(daisy.vx) < 0.12) {
            daisy.vy = 0;
            daisy.vx = 0;
            daisy.angularVelocity *= 0.82;
            daisy.settledFrames += 1;
          }
        }
      }

      for (let pass = 0; pass < 4; pass += 1) {
        resolveCollisions();
      }
    }

    function drawDaisies() {
      context.clearRect(0, 0, width, height);

      for (const daisy of daisies) {
        context.save();
        context.translate(daisy.x, daisy.y);
        context.rotate(daisy.angle);
        const size = daisy.radius * 2;

        if (daisyImage.complete && daisyImage.naturalWidth > 0) {
          context.drawImage(
            daisyImage,
            -daisy.radius,
            -daisy.radius,
            size,
            size
          );
        } else {
          context.fillStyle = "#f4c95d";
          context.beginPath();
          context.arc(0, 0, daisy.radius * 0.28, 0, Math.PI * 2);
          context.fill();
        }

        context.restore();
      }
    }

    function animate(now: number) {
      const delta = Math.min(32, now - lastTime);
      lastTime = now;
      const step = delta / (1000 / 60);

      updateDaisies(step);
      drawDaisies();
      animationFrame = requestAnimationFrame(animate);
    }

    resizeCanvas();
    cursor.style.setProperty("--daisy-x", `${pointerX}px`);
    cursor.style.setProperty("--daisy-y", `${pointerY}px`);

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("pointermove", moveCursor, { passive: true });
    window.addEventListener("blur", hideCursor);
    document.addEventListener("mouseleave", hideCursor);
    document.addEventListener("click", handleClick, true);
    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", moveCursor);
      window.removeEventListener("blur", hideCursor);
      document.removeEventListener("mouseleave", hideCursor);
      document.removeEventListener("click", handleClick, true);
      document.documentElement.classList.remove("has-daisy-cursor");
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="daisy-physics-canvas"
        aria-hidden="true"
      />
      <div ref={cursorRef} className="daisy-cursor" aria-hidden="true">
        <img src="/cursors/daisy-cursor.svg" alt="" draggable="false" />
      </div>
    </>
  );
}
