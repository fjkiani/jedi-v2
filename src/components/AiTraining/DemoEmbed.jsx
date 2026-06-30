import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const DemoEmbed = ({ url, title, repoUrl, resultImages }) => {
  const [iframeStatus, setIframeStatus] = useState("loading"); // loading | loaded | sleeping
  const [selected, setSelected] = useState(0);
  const timerRef = useRef(null);

  // Detect if the HF Space is sleeping by checking if the iframe loads within 8s
  useEffect(() => {
    if (!url) {
      setIframeStatus("sleeping");
      return;
    }

    setIframeStatus("loading");

    // If iframe doesn't signal "loaded" within 8s, assume sleeping
    timerRef.current = setTimeout(() => {
      setIframeStatus((prev) => (prev === "loading" ? "sleeping" : prev));
    }, 8000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [url]);

  const handleIframeLoad = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIframeStatus("loaded");
  };

  const current = resultImages?.[selected];

  // ── No URL at all: show cached gallery only ──
  if (!url) {
    return <CachedGallery resultImages={resultImages} selected={selected} setSelected={setSelected} repoUrl={repoUrl} current={current} note="Live demo not available. View cached results below." />;
  }

  // ── Sleeping: show cached gallery with resume note ──
  if (iframeStatus === "sleeping") {
    return (
      <div className="my-4">
        <div className="rounded-xl border border-n-6 bg-n-7/50 p-6 text-center mb-4">
          <div className="text-3xl mb-2">😴</div>
          <p className="text-n-3 mb-1">Live demo is sleeping</p>
          <p className="text-n-4 text-xs mb-4">
            HuggingFace Spaces sleep after inactivity. Cached results are shown below.
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
        <CachedGallery resultImages={resultImages} selected={selected} setSelected={setSelected} repoUrl={repoUrl} current={current} />
      </div>
    );
  }

  // ── Loading or loaded: show live iframe + cached gallery below ──
  return (
    <div className="my-4">
      {/* Live iframe */}
      <div className="rounded-xl overflow-hidden border border-n-6 relative">
        {iframeStatus === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-n-7/80 z-10">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-2 border-color-1 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-n-4 text-xs">Loading live demo...</p>
            </div>
          </div>
        )}
        <iframe
          src={url}
          title={title}
          className="w-full"
          style={{ height: "600px", border: "none" }}
          sandbox="allow-scripts allow-same-origin allow-forms"
          loading="lazy"
          onLoad={handleIframeLoad}
        />
      </div>

      {/* Action links */}
      <div className="flex items-center justify-between mt-2 mb-6 px-1">
        <p className="text-n-4 text-xs">
          Live demo hosted on HuggingFace Spaces.
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

      {/* Cached results gallery (always visible below as reference) */}
      {resultImages && resultImages.length > 0 && (
        <div className="mt-6 pt-6 border-t border-n-6">
          <p className="text-n-4 text-xs uppercase tracking-wider mb-3">
            Cached Results (pre-computed on sample inputs)
          </p>
          <CachedGallery resultImages={resultImages} selected={selected} setSelected={setSelected} repoUrl={repoUrl} current={current} compact />
        </div>
      )}
    </div>
  );
};

// ── Reusable cached gallery component ──
const CachedGallery = ({ resultImages, selected, setSelected, repoUrl, current, note, compact }) => {
  if (!resultImages || resultImages.length === 0) {
    return (
      <div className="rounded-xl border border-n-6 bg-n-7/50 p-8 text-center my-4">
        <div className="text-4xl mb-3">🚀</div>
        <p className="text-n-3 mb-2">Demo results coming soon</p>
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
      {note && (
        <p className="text-n-4 text-xs mb-3">{note}</p>
      )}

      {/* Main result image */}
      <div className="rounded-xl overflow-hidden border border-n-6 bg-n-7/30">
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
      <p className="text-n-4 text-xs mt-2 mb-3 text-center">{current.caption}</p>

      {/* Thumbnail gallery */}
      {resultImages.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {resultImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                i === selected
                  ? "border-color-1 scale-105"
                  : "border-n-6 opacity-60 hover:opacity-100"
              }`}
              style={{ width: compact ? "60px" : "80px", height: compact ? "45px" : "60px" }}
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
      {!compact && (
        <div className="flex justify-end mt-2">
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-n-3 hover:text-n-1 text-xs font-medium transition-colors"
          >
            Source code →
          </a>
        </div>
      )}
    </div>
  );
};

export default DemoEmbed;
