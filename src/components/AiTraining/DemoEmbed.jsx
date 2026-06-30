import { useState } from "react";
import { motion } from "framer-motion";

const DemoEmbed = ({ url, title, repoUrl, resultImages }) => {
  const [selected, setSelected] = useState(0);

  // If we have cached result images, show them as a gallery
  if (resultImages && resultImages.length > 0) {
    const current = resultImages[selected];

    return (
      <div className="my-4">
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

        {/* Action links */}
        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-n-4 text-xs">
            Pre-computed results on sample inputs.
          </p>
          <div className="flex gap-4">
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-color-1 hover:text-color-1/80 text-xs font-medium transition-colors"
              >
                Try live demo →
              </a>
            )}
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-n-3 hover:text-n-1 text-xs font-medium transition-colors"
            >
              Source code →
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Fallback: no cached results, show live iframe or placeholder
  if (url) {
    return (
      <div className="my-4">
        <div className="rounded-xl overflow-hidden border border-n-6">
          <iframe
            src={url}
            title={title}
            className="w-full"
            style={{ height: "600px", border: "none" }}
            sandbox="allow-scripts allow-same-origin allow-forms"
            loading="lazy"
          />
        </div>
        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-n-4 text-xs">
            Hosted on HuggingFace Spaces. May take ~30s to wake if inactive.
          </p>
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-color-1 hover:text-color-1/80 text-xs font-medium transition-colors"
          >
            Source code →
          </a>
        </div>
      </div>
    );
  }

  // No demo at all
  return (
    <div className="rounded-xl border border-n-6 bg-n-7/50 p-8 text-center my-4">
      <div className="text-4xl mb-3">🚀</div>
      <p className="text-n-3 mb-2">Demo coming soon</p>
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
};

export default DemoEmbed;
