import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

type Hot = { col: number; y: number }; 

export default function Matrix() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const navigate = useNavigate();

  const cfg = useMemo(
    () => ({
      fontSize: 22,

      fade: 0.08,

      greenSpeedMin: 0.9,
      greenSpeedMax: 0.22,

      redSpeedMin: 0.03,
      redSpeedMax: 0.05,

      green: "#50FFA0",
      red: "#FF3C3C",

      clickRadiusCells: 1,
    }),
    [],
  );

  const dropsRef = useRef<number[]>([]);
  const speedsRef = useRef<number[]>([]);
  const colsRef = useRef(0);
  const rowsRef = useRef(0);

  const hotARef = useRef<Hot>({ col: 0, y: 0 });
  const hotBRef = useRef<Hot>({ col: 0, y: 0 });
  const hotASpeedRef = useRef(0.08);
  const hotBSpeedRef = useRef(0.08);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const placeHots = (cols: number, rows: number) => {
      hotARef.current = { col: Math.max(2, Math.min(cols - 3, Math.floor(cols * 0.62))), y: rows * 0.15 };
      hotBRef.current = { col: Math.max(2, Math.min(cols - 3, Math.floor(cols * 0.35))), y: rows * 0.35 };

      hotASpeedRef.current = rand(cfg.redSpeedMin, cfg.redSpeedMax);
      hotBSpeedRef.current = rand(cfg.redSpeedMin, cfg.redSpeedMax);
    };

    const resize = () => {
      const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
      const w = Math.floor(window.innerWidth);
      const h = Math.floor(window.innerHeight);

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.floor(w / cfg.fontSize);
      const rows = Math.floor(h / cfg.fontSize);

      colsRef.current = cols;
      rowsRef.current = rows;

      dropsRef.current = Array.from({ length: cols }, () => Math.random() * rows);
      speedsRef.current = Array.from({ length: cols }, () =>
        rand(cfg.greenSpeedMin, cfg.greenSpeedMax),
      );

      placeHots(cols, rows);
    };

    resize();
    window.addEventListener("resize", resize);

    let raf = 0;

    const tick = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.fillStyle = `rgba(0,0,0,${cfg.fade})`;
      ctx.fillRect(0, 0, w, h);

      ctx.font = `${cfg.fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;

      const cols = colsRef.current;
      const rows = rowsRef.current;

      ctx.fillStyle = cfg.green;
      for (let col = 0; col < cols; col++) {
        const row = Math.floor(dropsRef.current[col]);
        const x = col * cfg.fontSize;
        const y = row * cfg.fontSize;

        ctx.fillText(Math.random() < 0.5 ? "0" : "1", x, y);

        dropsRef.current[col] += speedsRef.current[col];

        if (dropsRef.current[col] > rows && Math.random() > 0.975) {
          dropsRef.current[col] = 0;
          speedsRef.current[col] = rand(cfg.greenSpeedMin, cfg.greenSpeedMax);
        }
      }

      const stepHot = (hot: Hot, speed: number) => {
        hot.y += speed;
        if (hot.y > rows + 2) {
          hot.y = -2;

          const c = colsRef.current;
          const newCol =
            Math.random() < 0.5
              ? hot.col + 1
              : hot.col - 1;

          hot.col = Math.max(2, Math.min(c - 3, newCol));
        }
      };

      stepHot(hotARef.current, hotASpeedRef.current);
      stepHot(hotBRef.current, hotBSpeedRef.current);

      ctx.fillStyle = cfg.red;

      const drawHot = (hot: Hot) => {
        const x = hot.col * cfg.fontSize;
        const y = Math.floor(hot.y) * cfg.fontSize;
        ctx.fillText("1", x, y);
      };

      drawHot(hotARef.current);
      drawHot(hotBRef.current);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [cfg]);

  const onClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const col = Math.floor((e.clientX - rect.left) / cfg.fontSize);
    const row = Math.floor((e.clientY - rect.top) / cfg.fontSize);

    const r = cfg.clickRadiusCells;

    const hit = (h: Hot) => {
      const hRow = Math.floor(h.y);
      return Math.abs(col - h.col) <= r && Math.abs(row - hRow) <= r;
    };

    if (hit(hotARef.current) || hit(hotBRef.current)) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="relative h-screen w-screen bg-black">
      <canvas
        ref={canvasRef}
        onClick={onClick}
        className="h-full w-full cursor-crosshair"
      />
    </div>
  );
}
