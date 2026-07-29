"use client";

import { useEffect, useRef } from "react";

type Daisy = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  angle: number;
  angularVelocity: number;
  settledFrames: number;
  sleeping: boolean;
};

const MAX_DAISIES = 100;
const MAX_ACTIVE_DAISIES = 45;
const GRAVITY = 0.2;
const AIR_DRAG = 0.996;
const FLOOR_FRICTION = 0.94;
const BOUNCE = 0.34;
const ANGULAR_DRAG = 0.982;
const MAX_ANGULAR_SPEED = 0.07;
const SETTLED_ANGULAR_SPEED = 0.0035;
const SLEEP_AFTER_FRAMES = 50;
const SLEEP_LINEAR_SPEED = 0.16;
const WAKE_IMPACT_SPEED = 1.35;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.max(minimum, Math.min(maximum, value));
}

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

    const cursorElement: HTMLDivElement = cursor;
    const canvasElement: HTMLCanvasElement = canvas;
    const drawingContext: CanvasRenderingContext2D = context;

    document.documentElement.classList.add("has-daisy-cursor");

    let width = window.innerWidth;
    let height = window.innerHeight;
    let pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    let pointerX = width / 2;
    let pointerY = height / 2;
    let animationFrame = 0;
    let lastTime = performance.now();
    let spinCount = 0;
    let nextDaisyId = 1;
    let recentClicks: number[] = [];
    const daisies: Daisy[] = [];

    const daisyImage = new Image();
    daisyImage.src = "/cursors/daisy-cursor.svg";

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvasElement.width = Math.round(width * pixelRatio);
      canvasElement.height = Math.round(height * pixelRatio);
      canvasElement.style.width = `${width}px`;
      canvasElement.style.height = `${height}px`;
      drawingContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const floor = height - 5;
      for (const daisy of daisies) {
        daisy.x = clamp(daisy.x, daisy.radius, width - daisy.radius);
        daisy.y = Math.min(daisy.y, floor - daisy.radius);
      }
    }

    function moveCursor(event: PointerEvent) {
      pointerX = event.clientX;
      pointerY = event.clientY;
      cursorElement.style.setProperty("--daisy-x", `${pointerX}px`);
      cursorElement.style.setProperty("--daisy-y", `${pointerY}px`);

      const target = event.target;
      const targetElement = target instanceof Element ? target : null;
      const usesNativeCursor = Boolean(
        targetElement?.closest(
          [
            "a",
            "button",
            "input",
            "textarea",
            "select",
            "option",
            "label[for]",
            "[role='button']",
            "[role='link']",
            "[contenteditable='true']",
            "[data-native-cursor]",
            "p",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "li",
            "blockquote",
            "pre",
            "code"
          ].join(",")
        )
      );

      cursorElement.classList.toggle("is-native-zone", usesNativeCursor);
      cursorElement.classList.add("is-visible");
    }

    function hideCursor() {
      cursorElement.classList.remove("is-visible");
    }

    function sleepDaisy(daisy: Daisy) {
      daisy.sleeping = true;
      daisy.vx = 0;
      daisy.vy = 0;
      daisy.angularVelocity = 0;
      daisy.settledFrames = SLEEP_AFTER_FRAMES;
    }

    function wakeDaisy(daisy: Daisy, impulseX = 0, impulseY = 0) {
      daisy.sleeping = false;
      daisy.settledFrames = 0;
      daisy.vx += impulseX;
      daisy.vy += impulseY;
    }

    function limitActiveDaisies() {
      let activeCount = daisies.reduce(
        (count, daisy) => count + (daisy.sleeping ? 0 : 1),
        0
      );

      if (activeCount <= MAX_ACTIVE_DAISIES) return;

      const candidates = daisies
        .filter((daisy) => !daisy.sleeping)
        .sort((first, second) => {
          const firstSpeed = Math.hypot(first.vx, first.vy);
          const secondSpeed = Math.hypot(second.vx, second.vy);

          if (second.settledFrames !== first.settledFrames) {
            return second.settledFrames - first.settledFrames;
          }

          return firstSpeed - secondSpeed;
        });

      for (const daisy of candidates) {
        if (activeCount <= MAX_ACTIVE_DAISIES) break;

        const speed = Math.hypot(daisy.vx, daisy.vy);
        const calmEnough =
          speed < 0.55 && Math.abs(daisy.angularVelocity) < 0.02;

        if (calmEnough || daisy.settledFrames > 12) {
          sleepDaisy(daisy);
          activeCount -= 1;
        }
      }
    }

    function spawnDaisy(x: number, y: number, burst = false) {
      const radius = burst
        ? 11 + Math.random() * 13
        : 13 + Math.random() * 8;
      const cornerDirection = x < width / 2 ? -1 : 1;
      const spread = burst ? 3.8 : 1.8;

      daisies.push({
        id: nextDaisyId,
        x,
        y,
        vx:
          cornerDirection * (0.7 + Math.random() * 1.8) +
          (Math.random() - 0.5) * spread,
        vy: -(burst ? 3.5 + Math.random() * 4.5 : 1.8 + Math.random() * 2.8),
        radius,
        angle: Math.random() * Math.PI * 2,
        angularVelocity: (Math.random() - 0.5) * 0.055,
        settledFrames: 0,
        sleeping: false
      });

      nextDaisyId += 1;

      if (daisies.length > MAX_DAISIES) {
        const excess = daisies.length - MAX_DAISIES;
        const sleepingIndexes: number[] = [];

        for (let index = 0; index < daisies.length; index += 1) {
          if (daisies[index].sleeping) sleepingIndexes.push(index);
          if (sleepingIndexes.length >= excess) break;
        }

        for (let index = sleepingIndexes.length - 1; index >= 0; index -= 1) {
          daisies.splice(sleepingIndexes[index], 1);
        }

        if (daisies.length > MAX_DAISIES) {
          daisies.splice(0, daisies.length - MAX_DAISIES);
        }
      }

      limitActiveDaisies();
    }

    function handleClick(event: MouseEvent) {
      if (event.button !== 0) return;

      spinCount += 1;
      cursorElement.style.setProperty("--daisy-spin", `${spinCount * 360}deg`);
      cursorElement.classList.remove("is-clicking");
      void cursorElement.offsetWidth;
      cursorElement.classList.add("is-clicking");

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

          if (first.sleeping && second.sleeping) continue;

          const dx = second.x - first.x;
          const dy = second.y - first.y;
          const minDistance = first.radius + second.radius;
          const distanceSquared = dx * dx + dy * dy;

          if (
            distanceSquared === 0 ||
            distanceSquared >= minDistance * minDistance
          ) {
            continue;
          }

          const distance = Math.sqrt(distanceSquared);
          const nx = dx / distance;
          const ny = dy / distance;
          const overlap = minDistance - distance;
          const relativeVelocityX = second.vx - first.vx;
          const relativeVelocityY = second.vy - first.vy;
          const speedAlongNormal =
            relativeVelocityX * nx + relativeVelocityY * ny;
          const impactSpeed = Math.abs(speedAlongNormal);

          if (first.sleeping && !second.sleeping) {
            second.x += nx * overlap;
            second.y += ny * overlap;

            if (impactSpeed > WAKE_IMPACT_SPEED) {
              wakeDaisy(
                first,
                -nx * impactSpeed * 0.16,
                -ny * impactSpeed * 0.16
              );
            }
          } else if (!first.sleeping && second.sleeping) {
            first.x -= nx * overlap;
            first.y -= ny * overlap;

            if (impactSpeed > WAKE_IMPACT_SPEED) {
              wakeDaisy(
                second,
                nx * impactSpeed * 0.16,
                ny * impactSpeed * 0.16
              );
            }
          } else {
            const totalRadius = first.radius + second.radius;
            const firstShare = second.radius / totalRadius;
            const secondShare = first.radius / totalRadius;

            first.x -= nx * overlap * firstShare;
            first.y -= ny * overlap * firstShare;
            second.x += nx * overlap * secondShare;
            second.y += ny * overlap * secondShare;
          }

          if (speedAlongNormal < 0) {
            if (first.sleeping && !second.sleeping) {
              second.vx -= (1 + BOUNCE) * speedAlongNormal * nx;
              second.vy -= (1 + BOUNCE) * speedAlongNormal * ny;
            } else if (!first.sleeping && second.sleeping) {
              first.vx += (1 + BOUNCE) * speedAlongNormal * nx;
              first.vy += (1 + BOUNCE) * speedAlongNormal * ny;
            } else {
              const impulse = -(1 + BOUNCE) * speedAlongNormal * 0.5;
              first.vx -= impulse * nx;
              first.vy -= impulse * ny;
              second.vx += impulse * nx;
              second.vy += impulse * ny;
            }
          }

          const tangentialImpact =
            relativeVelocityX * -ny + relativeVelocityY * nx;
          const collisionSpin = clamp(tangentialImpact * 0.0012, -0.005, 0.005);

          if (!first.sleeping) {
            first.angularVelocity = clamp(
              first.angularVelocity - collisionSpin,
              -MAX_ANGULAR_SPEED,
              MAX_ANGULAR_SPEED
            );
            first.settledFrames = 0;
          }

          if (!second.sleeping) {
            second.angularVelocity = clamp(
              second.angularVelocity + collisionSpin,
              -MAX_ANGULAR_SPEED,
              MAX_ANGULAR_SPEED
            );
            second.settledFrames = 0;
          }
        }
      }
    }

    function updateDaisies(step: number) {
      const floor = height - 5;

      for (const daisy of daisies) {
        if (daisy.sleeping) continue;

        daisy.vy += GRAVITY * step;
        daisy.vx *= Math.pow(AIR_DRAG, step);
        daisy.vy *= Math.pow(AIR_DRAG, step);
        daisy.x += daisy.vx * step;
        daisy.y += daisy.vy * step;
        daisy.angularVelocity *= Math.pow(ANGULAR_DRAG, step);
        daisy.angularVelocity = clamp(
          daisy.angularVelocity,
          -MAX_ANGULAR_SPEED,
          MAX_ANGULAR_SPEED
        );
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
          daisy.angularVelocity *= 0.86;
        }
      }

      for (let pass = 0; pass < 4; pass += 1) {
        resolveCollisions();
      }

      for (const daisy of daisies) {
        if (daisy.sleeping) continue;

        const linearSpeed = Math.hypot(daisy.vx, daisy.vy);
        const calm =
          linearSpeed < SLEEP_LINEAR_SPEED &&
          Math.abs(daisy.angularVelocity) < SETTLED_ANGULAR_SPEED;

        if (calm) {
          daisy.settledFrames += 1;
          daisy.vx *= 0.72;
          daisy.vy *= 0.72;
          daisy.angularVelocity *= 0.65;
        } else {
          daisy.settledFrames = 0;
        }

        if (daisy.settledFrames >= SLEEP_AFTER_FRAMES) {
          sleepDaisy(daisy);
        }
      }

      limitActiveDaisies();
    }

    function drawDaisies() {
      drawingContext.clearRect(0, 0, width, height);

      for (const daisy of daisies) {
        drawingContext.save();
        drawingContext.translate(daisy.x, daisy.y);
        drawingContext.rotate(daisy.angle);
        const size = daisy.radius * 2;

        if (daisyImage.complete && daisyImage.naturalWidth > 0) {
          drawingContext.drawImage(
            daisyImage,
            -daisy.radius,
            -daisy.radius,
            size,
            size
          );
        } else {
          drawingContext.fillStyle = "#f4c95d";
          drawingContext.beginPath();
          drawingContext.arc(0, 0, daisy.radius * 0.28, 0, Math.PI * 2);
          drawingContext.fill();
        }

        drawingContext.restore();
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
    cursorElement.style.setProperty("--daisy-x", `${pointerX}px`);
    cursorElement.style.setProperty("--daisy-y", `${pointerY}px`);

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
