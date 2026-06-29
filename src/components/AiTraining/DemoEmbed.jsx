const DemoEmbed = ({ url, title, repoUrl }) => {
  if (!url) {
    return (
      <div className="rounded-xl border border-n-6 bg-n-7/50 p-8 text-center my-4">
        <div className="text-4xl mb-3">🚀</div>
        <p className="text-n-3 mb-2">Live demo coming soon</p>
        <p className="text-n-4 text-sm mb-4">
          The Gradio demo will be deployed to HuggingFace Spaces.
        </p>
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
    <div className="rounded-xl overflow-hidden border border-n-6 my-4">
      <iframe
        src={url}
        title={title}
        className="w-full"
        style={{ height: "600px", border: "none" }}
        sandbox="allow-scripts allow-same-origin allow-forms"
        loading="lazy"
      />
    </div>
  );
};

export default DemoEmbed;
