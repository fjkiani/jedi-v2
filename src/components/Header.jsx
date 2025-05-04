import { useState, useEffect, useMemo } from "react";
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
import { Icon } from './Icon';

// Define CORRECTED GraphQL Query
const GetNavbarData = gql`
   query GetNavbarData {
    industries(stage: PUBLISHED, orderBy: name_ASC) {
      id
      name
      slug
    }
    # Correct typo and add missing fields
    useCaseS(stage: PUBLISHED, orderBy: title_ASC) {
      id
      title
      slug
      industry {
        id
        name
        slug
      }
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
  // Handle Technology category structure if needed
  if (categories?.length > 0) {
    // Assuming 'categories' is structured for the Technology dropdown
    // Render based on 'categories' prop
    return (
      <div className="absolute top-full left-0 bg-n-8/90 backdrop-blur-sm rounded-lg py-2 hidden group-hover:block min-w-[200px]">
        {categories.map((category) => (
          // ... complex rendering for technology categories/sub-items ...
          <div key={category.slug} className="relative group/nested">
             <Link
               to={`/technology#${category.slug}`} // Example link
               className="block px-4 py-2 hover:bg-n-7/50 text-n-1/70 hover:text-n-1"
             >
               {category.name}
               {/* Add arrow or indicator if it has sub-items */}
             </Link>
             {/* Nested dropdown for technologies within the category */}
             {category.technologies?.length > 0 && (
                <div className="absolute left-full top-0 hidden group-hover/nested:block">
                   <div className="bg-n-8/90 backdrop-blur-sm rounded-lg py-2 min-w-[200px]">
                      {category.technologies.map((tech) => (
                         <Link
                            key={tech.id}
                            to={`/technology/${tech.slug}`} // Example link
                            className="block px-4 py-2 hover:bg-n-7/50 text-n-1/70 hover:text-n-1"
                         >
                            {tech.name}
                         </Link>
                      ))}
                   </div>
                </div>
             )}
          </div>
        ))}
      </div>
    );
  }

  // --- Default rendering for simple list of items (Industries, Use Cases) ---
  return (
    <div className="absolute top-full left-0 bg-n-8/90 backdrop-blur-sm rounded-lg py-2 hidden group-hover:block min-w-[200px]">
      {items.map((item) => (
        <Link
          key={item.id || item.url} // Use id if available, fallback to url
          to={item.url}
          className="block px-4 py-2 hover:bg-n-7/50 text-n-1/70 hover:text-n-1"
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
};

const MobileMenu = ({ items, categories }) => {
   // Handle Technology category structure if needed
  if (categories?.length > 0) {
     // Render based on 'categories' prop for mobile
     return (
        <div className="mt-2 pl-4 border-l border-n-6">
           {categories.map((category) => (
              <div key={category.slug} className="py-1">
                 <Link
                    to={`/technology#${category.slug}`} // Example link
                    className="block text-sm text-n-3 hover:text-n-1"
                 >
                    {category.name}
                 </Link>
                 {/* Render sub-items if needed for mobile */}
                 {category.technologies?.length > 0 && (
                    <div className="pl-4 mt-1">
                       {category.technologies.map((tech) => (
                          <Link
                             key={tech.id}
                             to={`/technology/${tech.slug}`} // Example link
                             className="block text-xs text-n-4 hover:text-n-1 py-0.5"
                          >
                             {tech.name}
                          </Link>
                       ))}
                    </div>
                 )}
              </div>
           ))}
        </div>
     );
  }

  // Default rendering for simple list of items (Industries, Use Cases)
  return (
    <div className="mt-2 pl-4 border-l border-n-6">
      {items.map((item) => (
        <Link
          key={item.id || item.url}
          to={item.url}
          className="block py-1 text-sm text-n-3 hover:text-n-1"
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
};

const Header = () => {
  const location = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);
  const [categories, setCategories] = useState([]); // For Technology dropdown
  const [navIndustries, setNavIndustries] = useState([]);
  const [navUseCases, setNavUseCases] = useState([]); // State for VALID use cases
  const [navApplications, setNavApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();
  const [expandedMobileItems, setExpandedMobileItems] = useState({}); // State for mobile expansion
  const [scrolled, setScrolled] = useState(false); // State to track scroll

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50; // Threshold of 50px
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check in case page loads already scrolled
    handleScroll(); 

    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array means this runs once on mount

  // Fetch industries, use cases, AND applications from Hygraph
  useEffect(() => {
    const fetchNavData = async () => {
      setLoading(true);
      try {
        console.log("[Header] Fetching navbar data...");
        const data = await hygraphClient.request(GetNavbarData); // Uses CORRECTED query
        console.log("[Header] Raw navbar data received:", data);

        const fetchedIndustries = data.industries || [];
        const fetchedUseCases = data.useCaseS || []; // Uses CORRECT key 'useCases'

        // Filter use cases to ensure they have the necessary industry slug
        const validUseCases = fetchedUseCases.filter(uc => {
          const hasIndustryAndSlug = uc.industry && uc.industry.slug;
          if (!hasIndustryAndSlug) {
            console.warn(`[Header] Filtering out use case "${uc.title}" (ID: ${uc.id}) due to missing or invalid industry link.`);
          }
          return hasIndustryAndSlug;
        });

        setNavIndustries(fetchedIndustries);
        setNavUseCases(validUseCases); // Set state ONLY with valid use cases
        console.log("[Header] Set navIndustries:", fetchedIndustries);
        console.log("[Header] Set navUseCases (filtered):", validUseCases);

      } catch (error) {
        console.error('Error fetching navbar data:', error);
        setNavIndustries([]);
        setNavUseCases([]); // Set empty on error
      } finally {
        setLoading(false);
      }
    };
    fetchNavData();
  }, []); // Runs once on mount

  // Prepare navigation data using useMemo
  const dynamicNavigation = useMemo(() => {
    console.log("[Header] Recalculating dynamicNavigation...");
    const baseNav = navigation.map(item => ({ ...item })); 

    const industriesIndex = baseNav.findIndex(item => item.id === 'industries');
    const useCasesIndex = baseNav.findIndex(item => item.id === 'use-cases');
    const solutionsIndex = baseNav.findIndex(item => item.id === '0'); 

    // Inject Industries
    if (industriesIndex !== -1 && !loading) {
      baseNav[industriesIndex].dropdownItems = navIndustries.map(industry => ({
        id: industry.id,
        title: industry.name,
        url: `/industries/${industry.slug}`
      }));
    } else if (industriesIndex !== -1) {
      baseNav[industriesIndex].dropdownItems = [];
    }

    // Inject Use Cases 
    if (useCasesIndex !== -1 && !loading) {
      baseNav[useCasesIndex].dropdownItems = navUseCases.map(useCase => ({
        id: useCase.id,
        title: useCase.title,
        url: useCase.industry?.slug ? `/industries/${useCase.industry.slug}/${useCase.slug}` : '#'
      }));
      console.log(`[Header] Injected ${baseNav[useCasesIndex].dropdownItems?.length || 0} use cases.`);
    } else if (useCasesIndex !== -1) {
       baseNav[useCasesIndex].dropdownItems = [];
    }
    
    // --- Inject IndustryApplications into Solutions --- 
    if (solutionsIndex !== -1 && !loading) {
      baseNav[solutionsIndex].dropdownItems = navApplications.map(app => ({
        id: app.id, 
        title: app.applicationTitle,
        url: `/industries/${app.industry.slug}#application-${app.id}` 
      }));
      console.log(`[Header] Injected ${baseNav[solutionsIndex].dropdownItems?.length || 0} applications into Solutions.`);
    } else if (solutionsIndex !== -1) {
       baseNav[solutionsIndex].dropdownItems = [];
    }
    // --- End Solutions Injection --- 

    console.log("[Header] Final dynamicNavigation:", baseNav);
    return baseNav;
  }, [loading, navIndustries, navUseCases, navApplications]);


  // Fetch categories for Technology dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Assuming technologyService fetches data structured for the 'categories' prop
        const data = await technologyService.getAllCategories();
        setCategories(data || []);
        console.log("[Header] Fetched Technology categories:", data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]); // Set empty on error
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
    // Reset mobile expansion on main click/close
    setExpandedMobileItems({});
  };

  // --- Function to toggle mobile sub-menu expansion ---
  const toggleMobileItemExpansion = (itemId) => {
    setExpandedMobileItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };
  // --- Mobile item click also closes full nav and resets expansion ---
   const handleMobileItemClick = () => {
     enablePageScroll();
     setOpenNavigation(false);
     setExpandedMobileItems({});
   };

   // --- Mobile sub-item click ---
   const handleMobileSubItemClick = (e) => {
     // Prevent event bubbling up to the main item toggle
     e.stopPropagation();
     handleMobileItemClick(); // Close nav on sub-item click too
   };

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm transition-colors duration-300 ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <Link 
          to="/" 
          className={`block w-[12rem] xl:mr-8`} 
          onClick={handleMobileItemClick}
        >
          <div className="flex flex-col items-center">
            <img 
              src={logo} 
              width={80} 
              alt="JediLabs Logo" 
              className={`
                transition-all duration-300 ease-in-out 
                ${scrolled ? 'opacity-0 invisible h-0 -translate-y-2' : 'opacity-100 visible h-auto translate-y-0'}
              `}
              aria-hidden={scrolled}
            />
            <span 
              className={`mt-1 text-xl text-n-7 dark:text-n-1 font-starjedi transition-margin duration-300 ease-in-out ${scrolled ? '-mt-4' : 'mt-1'}`}>
                Jedi Labs
            </span> 
          </div>
        </Link>

        {/* Render using the dynamicNavigation from useMemo */}
        <nav className={`${
          openNavigation ? "flex" : "hidden"
        } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 overflow-y-auto lg:static lg:flex lg:mx-auto lg:bg-transparent lg:overflow-visible`}>
          <div className="relative z-2 flex flex-col items-start justify-start py-8 min-h-full w-full lg:flex-row lg:items-center lg:py-0">
            {dynamicNavigation
              .filter(item => item.id !== 'technology')
              .map((item) => {
                // Determine if the item has children for mobile view
                const hasMobileChildren = (item.dropdownItems && item.dropdownItems.length > 0);
                const isMobileExpanded = !!expandedMobileItems[item.id];

                return (
                  <div key={item.id} className="w-full lg:w-auto relative group">
                    {/* Desktop Link */}
                    <Link
                      to={item.url}
                      onClick={handleClick} // Desktop behavior
                      className={`hidden lg:block relative font-code text-xs lg:font-semibold
                        px-6 py-8 lg:-mr-0.25
                        ${location.pathname.startsWith(item.url) && item.url !== '#' && item.url !== '/' ? "z-2 lg:text-n-1" : (location.pathname === '/' && item.url === '/') ? "z-2 lg:text-n-1" : "lg:text-n-1/50"}
                        lg:leading-5 lg:hover:text-n-1 xl:px-12`}
                    >
                      {item.title}
                    </Link>

                    {/* Mobile Item (either link or toggle button) */}
                    <div className="lg:hidden">
                      {hasMobileChildren ? (
                        // If item has children, make it a button to toggle expansion
                        <button
                          onClick={() => toggleMobileItemExpansion(item.id)}
                          className="flex items-center justify-between w-full px-6 py-4 font-code text-2xl uppercase text-n-1 hover:text-color-1 transition-colors"
                        >
                          <span>{item.title}</span>
                          <Icon
                            name={isMobileExpanded ? 'chevron-up' : 'chevron-down'}
                            className={`w-4 h-4 ml-2 transition-transform ${isMobileExpanded ? 'rotate-0' : 'rotate-0'}`}
                          />
                        </button>
                      ) : (
                        // If item has no children, make it a direct link
                        <Link
                          to={item.url}
                          onClick={handleMobileItemClick} // Mobile behavior (close nav)
                          className="block px-6 py-4 font-code text-2xl uppercase text-n-1 hover:text-color-1 transition-colors"
                        >
                          {item.title}
                        </Link>
                      )}
                    </div>

                    {/* Desktop Dropdown */}
                    <div className="hidden lg:block">
                       {item.dropdownItems && item.dropdownItems.length > 0 && (
                          <DropdownMenu items={item.dropdownItems} categories={null} />
                       )}
                    </div>

                     {/* --- Mobile Sub-Menu (Conditionally Rendered) --- */}
                     {hasMobileChildren && isMobileExpanded && (
                       <div className="lg:hidden pl-8 pb-4 border-l border-n-6 ml-6 mr-6 animate-fadeIn">
                          {item.dropdownItems.map((subItem) => (
                             <Link
                                key={subItem.id || subItem.url}
                                to={subItem.url}
                                onClick={handleMobileSubItemClick} // Use specific handler
                                className="block py-1 text-sm text-n-3 hover:text-n-1 transition-colors"
                             >
                                {subItem.title}
                             </Link>
                          ))}
                       </div>
                     )}
                     {/* --- End Mobile Sub-Menu --- */}

                  </div>
                );
            })}
          </div>

           {/* Mobile Fallback/Extra Links (if any, e.g., Contact) */}
           <div className="lg:hidden px-6 py-4 mt-auto border-t border-n-6">
              <Link
                 to="/contact"
                 onClick={handleMobileItemClick}
                 className="block font-code text-2xl uppercase text-n-1 hover:text-color-1 transition-colors"
              >
                 Contact Us
              </Link>
           </div>
        </nav>

        {/* Right side elements */}
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