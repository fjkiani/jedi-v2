import { useTheme } from "../../context/ThemeContext";

const MetricCard = ({ label, value }) => {
  const { isDarkMode } = useTheme();
  const cardBg = isDarkMode ? "bg-n-7/50" : "bg-n-1";
  const cardBorder = isDarkMode ? "border-n-6" : "border-n-3";
  const labelText = isDarkMode ? "text-n-4" : "text-n-5";

  return (
    <div className={`flex flex-col items-center justify-center p-4 rounded-xl border min-w-[100px] ${cardBg} ${cardBorder}`}>
      <span className="text-xl sm:text-2xl font-bold text-color-1 mb-1">
        {value}
      </span>
      <span className={`text-xs text-center ${labelText}`}>{label}</span>
    </div>
  );
};

export default MetricCard;
