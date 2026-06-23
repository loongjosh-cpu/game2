import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

type LegacyModule = {
  mountLegacyApp: (target: HTMLElement) => () => void;
};

export function App() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    import("./app.js")
      .then((module: LegacyModule) => {
        if (cancelled || !hostRef.current) return;
        cleanup = module.mountLegacyApp(hostRef.current);
      })
      .catch((error) => {
        console.error("Failed to mount legacy game app", error);
        setFailed(true);
      });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  if (failed) {
    return (
      <main className="react-shell-fallback">
        <h1>梦境牌国：持牌人原型</h1>
        <p>游戏入口加载失败，请刷新页面重试。</p>
      </main>
    );
  }

  return <div id="legacy-app" ref={hostRef} />;
}

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("Missing #app root element");
}

createRoot(rootElement).render(<App />);
