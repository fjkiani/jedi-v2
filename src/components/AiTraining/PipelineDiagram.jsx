import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const PipelineDiagram = ({ steps, color }) => {
  const { isDarkMode } = useTheme();
  const cardBg = isDarkMode ? "bg-n-7/50" : "bg-n-1";
  const cardBorder = isDarkMode ? "border-n-6" : "border-n-3";
  const stepText = isDarkMode ? "text-n-1" : "text-n-8";
  const detailText = isDarkMode ? "text-n-4" : "text-n-5";

  return (
    <div className="flex flex-col gap-3 my-6">
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-4"
        >
          {/* Step number */}
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-sm font-bold`}
          >
            {i + 1}
          </div>

          {/* Step content */}
          <div className={`flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 p-3 rounded-lg border ${cardBg} ${cardBorder}`}>
            <span className={`font-code font-semibold text-sm sm:text-base ${stepText}`}>
              {step.step}
            </span>
            <span className="text-color-1 text-xs sm:text-sm font-medium">
              {step.tool}
            </span>
            <span className={`text-xs sm:text-sm hidden md:block ${detailText}`}>
              {step.detail}
            </span>
          </div>

          {/* Arrow to next step */}
          {i < steps.length - 1 && (
            <div className="absolute" />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default PipelineDiagram;
