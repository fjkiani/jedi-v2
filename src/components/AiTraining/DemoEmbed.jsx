import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const DemoEmbed = ({ url, title, repoUrl, resultImages, demoPaused }) => {
  const { isDarkMode } = useTheme();
  const [iframeOpen, setIframeOpen] = useState(false);
  const [iframeStatus, setIframeStatus] = useState("idle"); // idle | loading | loaded | sleeping
  const [selected, setSelected] = useState(0);
  const timerRef = useRef(null);

  const t = {
    headingText: isDarkMode ? "text-n-1" : "text-n-8",
    subheadText: isDarkMode ? "text-n-3" : "text-n-7",
    bodyText: isDarkMode ? "text-n-4" : "text-n-5",
    mutedText: isDarkMode ? "text-n-4" : "text-n-6",
    cardBg: isDarkMode ? "bg-n-7/50" : "bg-n-1",
    cardBgSubtle: isDarkMode ? "bg-n-7/30" : "bg-n-2/40",
    cardBorder: isDarkMode ? "border-n-6" : "border-n-3",
    cardBorderSoft: isDarkMode ? "border-n-6/70" : "border-n-3/70",
    overlayBg: isDarkMode ? "bg-n-7/80" : "bg-n-1/80",
    thumbBorderInactive: isDarkMode ? "border-n-6" : "border-n-3",
    sourceLink: isDarkMode ? "text-n-3 hover:text-n-1" : "text-n-6 hover:text-n-8",
  };

  // Trigger iframe loading + sleeping detection only when user opens expander
  useEffect(() => {
    if (!iframeOpen || !url || demoPaused) return;

    setIframeStatus("loading");

    timerRef.current = setTimeout(() => {
      setIframeStatus((prev) => (prev === "loading" ? "sleeping" : prev));
    }, 8000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [iframeOpen, url, demoPaused]);

  const handleIframeLoad = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIframeStatus("loaded");
  };

  const current = resultImages?.[selected];
  const hasLiveDemo = url && !demoPaused;

  return (
    <div className="my-4">
      {/* ── PRIMARY SURFACE: Cached gallery (always visible) ── */}
      <CachedGallery
        resultImages={resultImages}
        selected={selected}
        setSelected={setSelected}
        repoUrl={repoUrl}
        current={current}
        t={t}
      />

      {/* ── SECONDARY: Live demo expander ── */}
      {hasLiveDemo ? (
        <details
          className={`mt-6 rounded-xl border ${t.cardBorder} ${t.cardBgSubtle} overflow-hidden group`}
          onToggle={(e) => setIframeOpen(e.target.open)}
        >
          <summary
            className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-color-1/5 transition-colors list-none ${t.subheadText}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-color-1 text-sm">▶</span>
              <span className="text-sm font-medium">Try the live demo</span>
              <span className={`text-xs ${t.mutedText}`}>
                · Hosted on HuggingFace Spaces · ~30s cold-start
              </span>
            </div>
            <span className={`text-xs ${t.mutedText} group-open:rotate-180 transition-transform`}>
              ▼
            </span>
          </summary>

          <div className={`border-t ${t.cardBorderSoft}`}>
            {/* Loading overlay */}
            <div className="relative">
              {iframeStatus === "loading" && (
                <div
                  className={`absolute inset-0 flex items-center justify-center ${t.overlayBg} z-10`}
                >
                  <div className="text-center">
                    <div className="inline-block w-8 h-8 border-2 border-color-1 border-t-transparent rounded-full animate-spin mb-3" />
                    <p className={`${t.bodyText} text-xs`}>Loading live demo...</p>
                  </div>
                </div>
              )}

              {/* Sleeping fallback inside expander */}
              {iframeStatus === "sleeping" ? (
                <div className="p-6 text-center">
                  <div className="text-3xl mb-2">😴</div>
                  <p className={`${t.subheadText} mb-1`}>Live demo is sleeping</p>
                  <p className={`${t.bodyText} text-xs mb-4`}>
                    HuggingFace Spaces sleep after inactivity. Open it directly to wake it up.
                  </p>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-color-1 text-n-8 font-code text-xs font-semibold hover:bg-color-1/90 transition-colors"
                  >
                    Resume demo on HuggingFace ↗
                  </a>
                </div>
              ) : (
                iframeOpen && (
                  <iframe
                    src={url}
                    title={title}
                    className="w-full"
                    style={{ height: "600px", border: "none" }}
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    loading="lazy"
                    onLoad={handleIframeLoad}
                  />
                )
              )}
            </div>

            {iframeStatus === "loaded" && (
              <div className={`flex items-center justify-between px-4 py-2 border-t ${t.cardBorderSoft}`}>
                <p className={`${t.bodyText} text-xs`}>
                  Live inference running on HuggingFace Spaces.
                </p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-color-1 hover:text-color-1/80 text-xs font-medium transition-colors"
                >
                  Open in new tab ↗
                </a>
              </div>
            )}
          </div>
        </details>
      ) : url && demoPaused ? (
        <div className={`mt-6 rounded-xl border ${t.cardBorder} ${t.cardBgSubtle} p-4`}>
          <p className={`${t.bodyText} text-xs mb-2`}>
            <span className="text-color-1">●</span> Live demo paused (Free-tier capacity limit).
            View the cached results above or run the demo locally from source.
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-color-1 hover:text-color-1/80 text-xs font-medium transition-colors"
          >
            View Space on HuggingFace ↗
          </a>
        </div>
      ) : null}
    </div>
  );
};

// ── Reusable cached gallery component (primary surface) ──
const CachedGallery = ({ resultImages, selected, setSelected, repoUrl, current, t }) => {
  if (!resultImages || resultImages.length === 0) {
    return (
      <div className={`rounded-xl border ${t.cardBorder} ${t.cardBg} p-8 text-center`}>
        <div className="text-4xl mb-3">🚀</div>
        <p className={`${t.subheadText} mb-2`}>Demo results coming soon</p>
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-color-1 hover:text-color-1/80 text-sm font-medium transition-colors"
        >
          View source code →
        </a>
      </div>
    );
  }

  return (
    <div>
      <p className={`${t.bodyText} text-xs uppercase tracking-wider mb-3`}>
        Cached results · pre-computed on sample inputs
      </p>

      {/* Main result image */}
      <div className={`rounded-xl overflow-hidden border ${t.cardBorder} ${t.cardBgSubtle}`}>
        <motion.img
          key={selected}
          src={current.src}
          alt={current.caption}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full"
          loading="lazy"
        />
      </div>

      {/* Caption */}
      <p className={`${t.bodyText} text-xs mt-2 mb-3 text-center`}>{current.caption}</p>

      {/* Thumbnail gallery */}
      {resultImages.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {resultImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                i === selected
                  ? "border-color-1 scale-105"
                  : `${t.thumbBorderInactive} opacity-60 hover:opacity-100`
              }`}
              style={{ width: "80px", height: "60px" }}
            >
              <img
                src={img.src}
                alt={img.caption}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Source link */}
      <div className="flex justify-end">
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${t.sourceLink} text-xs font-medium transition-colors`}
        >
          Source code →
        </a>
      </div>
    </div>
  );
};

export default DemoEmbed;
