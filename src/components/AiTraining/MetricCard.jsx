const MetricCard = ({ label, value }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-n-7/50 border border-n-6 min-w-[100px]">
      <span className="text-xl sm:text-2xl font-bold text-color-1 mb-1">
        {value}
      </span>
      <span className="text-xs text-n-4 text-center">{label}</span>
    </div>
  );
};

export default MetricCard;
