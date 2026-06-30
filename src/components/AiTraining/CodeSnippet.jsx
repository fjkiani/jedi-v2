import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "../../context/ThemeContext";

const CodeSnippet = ({ code, language = "python" }) => {
  const { isDarkMode } = useTheme();
  // Code block stays visually dark in both themes (conventional & readable).
  // Only adjust outer border so the block stands out on a light page.
  const outerBorder = isDarkMode ? "border-n-6" : "border-n-3";

  return (
    <div className={`rounded-xl overflow-hidden border my-4 ${outerBorder}`}>
      <div className="flex items-center gap-2 px-4 py-2 bg-n-7 border-b border-n-6">
        <div className="w-3 h-3 rounded-full bg-red-500/70" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <div className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="ml-2 text-xs text-n-4 font-code">{language}</span>
      </div>
      <SyntaxHighlighter
        language={language}
        style={atomDark}
        customStyle={{
          margin: 0,
          padding: "1rem",
          fontSize: "0.8rem",
          background: "rgba(0,0,0,0.3)",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeSnippet;
