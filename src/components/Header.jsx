import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { useTheme } from "../context/ThemeContext";
import { logo } from "../assets";
import { navigation } from "../constants";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";
import { Link } from 'react-router-dom';
import { technologyService } from '@/services/technologyService';
import { gql } from 'graphql-request';
import { hygraphClient } from '@/lib/hygraph';

// Define GraphQL Query for Navbar Industries
const GetNavbarIndustries = gql`
  query GetNavbarIndustries {
    industries(stage: PUBLISHED, orderBy: name_ASC) {
      name
      slug
    }
  }
`;

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="ml-4 p-2 rounded-full hover:bg-n-7/40 transition-colors duration-200 text-n-1 dark:text-n-1"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        // Sun icon for dark mode (clicking will switch to light)
        <svg className="w-5 h-5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
          />
        </svg>
      ) : (
        // Moon icon for light mode (clicking will switch to dark)
        <svg className="w-5 h-5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

const DropdownMenu = ({ items, categories }) => {
  // If this is the Technology dropdown and we have categories, use those instead
  if (items[0]?.title === "AI Platforms" && categories?.length > 0) {
    return (
      <div className="absolute top-full left-0 bg-n-8/90 backdrop-blur-sm rounded-lg py-2 hidden group-hover:block min-w-[200px]">
        {categories.map((category) => (
          <div key={category.slug} className="relative group/nested">
            <Link 
              to={`/technology#${category.slug}`}
              className="block px-4 py-2 hover:bg-n-7/50 text-n-1/70 hover:text-n-1"
            >
              {category.name}
              {category.technologies?.length > 0 && (
                <div className="absolute left-full top-0 hidden group-hover/nested:block">
                  <div className="bg-n-8/90 backdrop-blur-sm rounded-lg py-2 min-w-[200px]">
                    {category.technologies.map((tech) => (
                      <div key={tech.slug} className="relative group/tech">
                        <Link
                          to={`/technology/${tech.slug}`}
                          className="block px-4 py-2 hover:bg-n-7/50 text-n-1/70 hover:text-n-1"
                        >
                          <div className="flex items-center justify-between">
                            <span>{tech.name}</span>
                            {tech.useCases?.length > 0 && (
                              <svg 
                                className="w-4 h-4 text-n-3" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M9 5l7 7-7 7" 
                                />
                              </svg>
                            )}
                          </div>
                        </Link>
                        {tech.useCases?.length > 0 && (
                          <div className="absolute left-full top-0 hidden group-hover/tech:block">
                            <div className="bg-n-8/90 backdrop-blur-sm rounded-lg py-2 min-w-[280px]">
                              <div className="px-4 py-2 border-b border-n-6">
                                <h4 className="text-sm font-medium text-n-1">Use Cases</h4>
                              </div>
                              {tech.useCases.map((useCase) => (
                                <Link
                                  key={useCase.id}
                                  to={`/technology/${tech.slug}/use-case/${useCase.slug}`}
                                  className="block px-4 py-2 hover:bg-n-7/50"
                                >
                                  <div className="text-n-1/70 hover:text-n-1">
                                    <span className="block font-medium">{useCase.title}</span>
                                    {useCase.industry && (
                                      <span className="block text-xs text-n-3 mt-0.5">
                                        {useCase.industry.name}
                                      </span>
                                    )}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Link>
          </div>
        ))}
      </div>
    );
  }

  // Default dropdown menu for other items
  return (
    <div className="absolute top-full left-0 bg-n-8/90 backdrop-blur-sm rounded-lg py-2 hidden group-hover:block min-w-[200px]">
      {items.map((item, index) => (
        <div key={index}>
          {item.items ? (
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
          ) : item.description ? (
            // Coming Soon items
            <div className="block px-4 py-2 cursor-default text-n-1/70">
              {item.title}
              <span className="block text-xs text-color-1 mt-0.5 font-medium">
                {item.description}
              </span>
            </div>
          ) : (
            // Regular menu items
            <Link 
              to={item.url}
              className="block px-4 py-2 hover:bg-n-7/50 text-n-1/70 hover:text-n-1"
            >
              {item.title}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

const MobileMenu = ({ items, categories }) => {
  const [openItem, setOpenItem] = useState(null);
  const [openSubItem, setOpenSubItem] = useState(null);

  const handleItemClick = (title) => {
    setOpenItem(openItem === title ? null : title);
    setOpenSubItem(null); // Reset sub-item when main item changes
  };

  const handleSubItemClick = (e, title) => {
    e.preventDefault(); // Prevent navigation when clicking items with use cases
    setOpenSubItem(openSubItem === title ? null : title);
  };

  // Get items with proper structure
  const getMenuItems = (items) => {
    if (items[0]?.title === "AI Platforms" && categories?.length > 0) {
      return categories.map(category => ({
        title: category.name,
        url: `/technology#${category.slug}`,
        items: category.technologies?.map(tech => ({
          title: tech.name,
          url: `/technology/${tech.slug}`,
          useCases: tech.useCases
        }))
      }));
    }
    return items;
  };

  const menuItems = getMenuItems(items);

  return (
    <div className="lg:hidden w-full">
      {menuItems.map((item, index) => (
        <div key={index} className="border-t border-n-6">
          {item.items || item.useCases ? (
            <div>
              <button
                onClick={() => handleItemClick(item.title)}
                className="flex items-center justify-between w-full px-6 py-4 text-n-1/75"
              >
                <span>{item.title}</span>
                <svg 
                  className={`w-3 h-3 transition-transform ${openItem === item.title ? 'rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openItem === item.title && (
                <div className="bg-n-8/50">
                  {item.items?.map((subItem, subIndex) => (
                    <div key={subIndex}>
                      {subItem.useCases ? (
                        <>
                          <button
                            onClick={(e) => handleSubItemClick(e, subItem.title)}
                            className="flex items-center justify-between w-full px-8 py-3 text-n-1/75 hover:text-n-1"
                          >
                            <span>{subItem.title}</span>
                            <svg 
                              className={`w-2.5 h-2.5 transition-transform ${openSubItem === subItem.title ? 'rotate-180' : ''}`}
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {openSubItem === subItem.title && (
                            <div className="bg-n-8/30 py-1">
                              {subItem.useCases.map((useCase, useCaseIndex) => (
                                <Link
                                  key={useCaseIndex}
                                  to={`${subItem.url}/use-case/${useCase.slug}`}
                                  className="block px-10 py-2 text-sm text-n-1/60 hover:text-n-1"
                                >
                                  {useCase.title}
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          to={subItem.url}
                          className="block px-8 py-3 text-n-1/75 hover:text-n-1"
                        >
                          {subItem.title}
                        </Link>
                      )}
                    </div>
                  ))}
                  {item.useCases?.map((useCase, useCaseIndex) => (
                    <Link
                      key={useCaseIndex}
                      to={useCase.url}
                      className="block px-8 py-3 text-n-1/75 hover:text-n-1"
                    >
                      {useCase.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : item.description ? (
            <div className="px-6 py-4 text-n-1/75">
              {item.title}
              <span className="block text-xs text-color-1 mt-0.5">
                {item.description}
              </span>
            </div>
          ) : (
            <Link
              to={item.url}
              className="block px-6 py-4 text-n-1/75 hover:text-n-1"
            >
              {item.title}
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
  const [categories, setCategories] = useState([]);
  const [navIndustries, setNavIndustries] = useState([]);
  const [loadingIndustries, setLoadingIndustries] = useState(true);
  const { isDarkMode } = useTheme();

  // Fetch industries from Hygraph
  useEffect(() => {
    const fetchNavIndustries = async () => {
      setLoadingIndustries(true);
      try {
        const data = await hygraphClient.request(GetNavbarIndustries);
        setNavIndustries(data.industries || []);
      } catch (error) {
        console.error('Error fetching navbar industries:', error);
        setNavIndustries([]); // Set empty on error
      } finally {
        setLoadingIndustries(false);
      }
    };
    fetchNavIndustries();
  }, []);

  // Prepare navigation data, injecting fetched industries
  const dynamicNavigation = navigation.map(navItem => {
    if (navItem.title === "Industries" && !loadingIndustries) {
      // Map fetched industries to the required dropdown format
      const industryDropdownItems = navIndustries.map(industry => ({
        title: industry.name,
        url: `/industries/${industry.slug}`
      }));
      return { ...navItem, dropdownItems: industryDropdownItems };
    }
    // Return other nav items unchanged, or Industries item while loading
    return navItem;
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await technologyService.getAllCategories();
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

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
    <div
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <Link to="/" className="block w-[5rem] xl:mr-8">
          <img src={logo} width={190} height={40} alt="JediLabs" />
        </Link>

        <nav className={`${
          openNavigation ? "flex" : "hidden"
        } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 overflow-y-auto lg:static lg:flex lg:mx-auto lg:bg-transparent lg:overflow-visible`}>
          <div className="relative z-2 flex flex-col items-start justify-start py-8 min-h-full w-full lg:flex-row lg:items-center lg:py-0">
            {dynamicNavigation.map((item) => (
              <div key={item.id} className="w-full lg:w-auto relative group">
                <Link
                  to={item.url}
                  onClick={handleClick}
                  className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 
                    px-6 py-4 lg:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold 
                    ${location.pathname === item.url ? "z-2 lg:text-n-1" : "lg:text-n-1/50"}
                    lg:leading-5 lg:hover:text-n-1 xl:px-12`}
                >
                  {item.title}
                </Link>
                {item.dropdownItems && (
                  <>
                    <div className="hidden lg:block">
                      <DropdownMenu 
                        items={item.dropdownItems} 
                        categories={item.title === "Technology" ? categories : null}
                      />
                    </div>
                    <div className="lg:hidden">
                      <MobileMenu 
                        items={item.dropdownItems}
                        categories={item.title === "Technology" ? categories : null}
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </nav>

        <div className="flex items-center ml-auto">
          <ThemeToggle />
          <Button className="hidden lg:flex ml-4" href="/contact">
            Contact Us
          </Button>
          <button className="ml-6 lg:hidden" onClick={toggleNavigation}>
            <MenuSvg openNavigation={openNavigation} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;