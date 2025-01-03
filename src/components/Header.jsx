import { useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { useTheme } from "../context/ThemeContext";
import { logo } from "../assets";
import { navigation } from "../constants";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";
import { useState } from "react";
import { Link } from 'react-router-dom';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="ml-4 p-2 rounded-full hover:bg-n-7/40 transition-colors duration-200"
    >
      {isDarkMode ? (
        // Sun icon
        <svg className="w-5 h-5 text-n-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
          />
        </svg>
      ) : (
        // Moon icon
        <svg className="w-5 h-5 text-n-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
          />
        </svg>
      )}
    </button>
  );
};

const DropdownMenu = ({ items }) => {
  return (
    <div className="absolute top-full left-0 bg-n-8/90 backdrop-blur-sm rounded-lg py-2 hidden group-hover:block min-w-[200px]">
      {items.map((item, index) => (
        <div key={index}>
          {item.items ? (
            // Nested dropdown for categories like Technology
            <div className="relative group/nested">
              <Link 
                to={item.url} 
                className="block px-4 py-2 hover:bg-n-7/50 text-n-1/70 hover:text-n-1"
              >
                {item.title}
                <div className="absolute left-full top-0 hidden group-hover/nested:block">
                  <div className="bg-n-8/90 backdrop-blur-sm rounded-lg py-2 min-w-[200px]">
                    {item.items.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subItem.url}
                        className="block px-4 py-2 hover:bg-n-7/50 text-n-1/70 hover:text-n-1"
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </Link>
            </div>
          ) : item.useCases ? (
            // Industry dropdown with use cases
            <div className="relative group/nested">
              <Link 
                to={item.url} 
                className="block px-4 py-2 hover:bg-n-7/50 text-n-1/70 hover:text-n-1"
              >
                {item.title}
                <div className="absolute left-full top-0 hidden group-hover/nested:block">
                  <div className="bg-n-8/90 backdrop-blur-sm rounded-lg py-2 min-w-[200px]">
                    {item.useCases.map((useCase, useCaseIndex) => (
                      <Link
                        key={useCaseIndex}
                        to={useCase.url}
                        className="block px-4 py-2 hover:bg-n-7/50 text-n-1/70 hover:text-n-1"
                      >
                        {useCase.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </Link>
            </div>
          ) : (
            // Regular dropdown item
            <Link 
              to={item.url} 
              className="block px-4 py-2 hover:bg-n-7/50 text-n-1/70 hover:text-n-1"
            >
              {item.title}
              {item.description && (
                <span className="block text-xs text-n-3">{item.description}</span>
              )}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

const Header = () => {
  const location = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);
  const { isDarkMode } = useTheme();

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;
    enablePageScroll();
    setOpenNavigation(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 border-b theme-border theme-bg-primary backdrop-blur-sm">
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <Link to="/" className="block w-[5rem] xl:mr-8">
          <img src={logo} width={190} height={40} alt="JediLabs" />
        </Link>

        <nav className={`${
          openNavigation ? "flex" : "hidden"
        } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}>
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            {navigation.map((item) => (
              <div key={item.id} className="relative group">
                <Link
                  to={item.url}
                  onClick={handleClick}
                  className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 
                    px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold 
                    ${location.pathname === item.url ? "z-2 lg:text-n-1" : "lg:text-n-1/50"}
                    lg:leading-5 lg:hover:text-n-1 xl:px-12`}
                >
                  {item.title}
                </Link>
                {item.dropdownItems && <DropdownMenu items={item.dropdownItems} />}
              </div>
            ))}
          </div>
          <HamburgerMenu />
        </nav>

        <div className="flex items-center gap-4 ml-auto">
          <Button className="hidden lg:flex" href="/contact">
            Contact Us
          </Button>
          <ThemeToggle />
          <Button className="lg:hidden" px="px-3" onClick={toggleNavigation}>
            <MenuSvg openNavigation={openNavigation} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;