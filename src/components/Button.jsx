import ButtonSvg from "../assets/svg/ButtonSvg";
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

const Button = ({
  className,
  href,
  onClick,
  children,
  px,
  white,
  secondary,
  as: Component = 'button',
}) => {
  const { isDarkMode } = useTheme();

  let baseClasses = "button relative inline-flex items-center justify-center h-11 transition-colors duration-200";
  baseClasses += ` ${px || "px-7"}`;

  let variantClasses = "";
  if (secondary) {
    variantClasses = isDarkMode
      ? "text-n-1 border border-n-6 hover:bg-n-6"
      : "text-n-7 border border-n-3 hover:bg-n-2";
  } else {
    if (white) {
      variantClasses = "text-n-8 bg-n-1 hover:bg-n-2";
    } else {
      variantClasses = isDarkMode
        ? "text-n-1 bg-primary-1 hover:bg-primary-2"
        : "text-primary-1 bg-white border border-primary-1 hover:bg-primary-1/10";
    }
  }

  const combinedClasses = `${baseClasses} ${variantClasses} ${className || ""}`;
  const spanClasses = "relative z-10";

  const content = (
    <>
      <span className={spanClasses}>{children}</span>
      {!secondary && !white && ButtonSvg(false)}
      {!secondary && white && ButtonSvg(true)}
    </>
  );

  if (href) {
    const RenderComponent = Component === 'button' ? 'a' : Component;
    const linkProps = RenderComponent === Link ? { to: href } : { href: href };

    return (
      <RenderComponent {...linkProps} className={combinedClasses} onClick={onClick}>
        {content}
      </RenderComponent>
    );
  } else {
    const RenderComponent = Component;
    const linkProps = RenderComponent === Link ? { to: '#' } : {};

    return (
      <RenderComponent className={combinedClasses} onClick={onClick} {...linkProps}>
        {content}
      </RenderComponent>
    );
  }
};

export default Button;
