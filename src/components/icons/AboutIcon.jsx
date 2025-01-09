const AboutIcon = ({ className, path, viewBox = "0 0 24 24" }) => {
  // If no path is provided, use the default info icon
  const defaultPath = "M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z M12 16V12 M12 8H12.01";

  return (
    <svg 
      className={className}
      viewBox={viewBox} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {path ? (
        path.split(' M').map((subPath, index) => (
          <path 
            key={index}
            d={index === 0 ? subPath : `M${subPath}`}
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        ))
      ) : (
        defaultPath.split(' M').map((subPath, index) => (
          <path 
            key={index}
            d={index === 0 ? subPath : `M${subPath}`}
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        ))
      )}
    </svg>
  );
};

export default AboutIcon;
