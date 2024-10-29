// src/components/Header.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { logo } from "../assets";
import { navigation } from "../constants";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";
import { useState, useEffect } from "react";

import { Link } from 'react-router-dom'; // Updated import for internal links

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openNavigation, setOpenNavigation] = useState(false);

  const toggleNavigation = () => {
    setOpenNavigation(!openNavigation);
    openNavigation ? enablePageScroll() : disablePageScroll();
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle navigation clicks
  const handleClick = (itemUrl) => {
    if (itemUrl.startsWith("/#")) {
      // For section scrolling
      const sectionId = itemUrl.substring(2);

      if (location.pathname === "/") {
        scrollToSection(sectionId);
      } else {
        navigate("/");
        setTimeout(() => scrollToSection(sectionId), 100);
      }
    } else if (itemUrl.startsWith("/")) {
      // For internal routes like /contact or /team
      navigate(itemUrl);
    } else {
      // For external links
      window.open(itemUrl, "_blank");
    }
  };

  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.substring(1);
      scrollToSection(sectionId);
    }
  }, [location]);

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
<<<<<<< HEAD
        <a className="block w-[5rem] xl:mr-8" href="#hero">
        <Link to="/">
            <img src={logo} width={190} height={40} alt="Brainwave" />
          </Link>
        </a>
        {/* <h2>Jedi Labs</h2> */}
=======
        {/* Logo: Click to navigate to home */}
        <div
          className="block w-[5rem] xl:mr-8 cursor-pointer"
          onClick={handleLogoClick}
        >
          <img src={logo} width={190} height={40} alt="Brainwave" />
        </div>
>>>>>>> 2d930e8b8b602374b3fed575019a709bdc17f3cc

        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            {navigation.map((item) => (
              <a
                key={item.id}
                onClick={() => handleClick(item.url)}
                className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${
                  item.onlyMobile ? "lg:hidden" : ""
                } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
                  location.pathname === item.url ? "lg:text-n-1" : "lg:text-n-1/50"
                } lg:leading-5 lg:hover:text-n-1 xl:px-12`}
              >
                {item.title}
              </a>
            ))}
          </div>

          <HamburgerMenu />
        </nav>

<<<<<<< HEAD
        {/* <a
          href="#signup"
          className="button hidden mr-8 text-n-1/50 transition-colors hover:text-n-1 lg:block"
        >
          New account
        </a> */}
        <Button className="hidden lg:flex" href="#login">
          Sign in
        </Button>

=======
>>>>>>> 2d930e8b8b602374b3fed575019a709bdc17f3cc
        <Button
          className="ml-auto lg:hidden"
          px="px-3"
          onClick={toggleNavigation}
        >
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </div>
  );
};

export default Header;
