import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Section from "./Section";
import { socials, navigation } from "../constants";
import { logo } from "../assets";
import { gql } from 'graphql-request';
import { hygraphClient } from '@/lib/hygraph';
import { useTheme } from '@/context/ThemeContext';

// Simple GraphQL Query - similar to Header approach
const GetFooterData = gql`
  query GetFooterData {
    # Optional: Fetch copyright info if needed
    footerInfo: footerSettings(first: 1) {
      id
      copyrightText
    }
    
    # Optional: Fetch social links if they exist as a model
    socialLinks(orderBy: displayOrder_ASC) {
      id
      platform
      url
      icon
    }
  }
`;

const FooterColumn = ({ title, items = [] }) => {
  const { isDarkMode } = useTheme();
  return (
    <div className="flex flex-col gap-4">
      <h5 className={`font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{title}</h5>
      {items && items.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {items.map((item, index) => (
            <li key={index}>
              {item.description ? (
                <div className="flex items-center gap-2">
                  <span className={`cursor-not-allowed ${isDarkMode ? 'text-n-4/75' : 'text-n-5/75'}`}>{item.title}</span>
                  <span className="text-[0.625rem] px-2 py-0.5 bg-primary-1/10 text-primary-1 rounded-full whitespace-nowrap">
                    Coming Soon
                  </span>
                </div>
              ) : (
                <div>
                  <Link 
                    to={item.url} 
                    className={`${isDarkMode ? 'text-n-4 hover:text-n-1' : 'text-n-5 hover:text-n-8'} transition-colors`}
                  >
                    {item.title}
                  </Link>
                  {item.useCases && item.useCases.length > 0 && (
                    <ul className="ml-4 mt-2 space-y-2">
                      {item.useCases.map((useCase, useCaseIndex) => (
                        <li key={useCaseIndex}>
                          <Link
                            to={useCase.url}
                            className={`text-sm ${isDarkMode ? 'text-n-4 hover:text-n-1' : 'text-n-5 hover:text-n-8'} transition-colors`}
                          >
                            {useCase.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <Link 
          to={`/${title.toLowerCase()}`} 
          className={`${isDarkMode ? 'text-n-4 hover:text-n-1' : 'text-n-5 hover:text-n-8'} transition-colors`}
        >
          {title}
        </Link>
      )}
    </div>
  );
};

const Footer = () => {
  const [dynamicSocials, setDynamicSocials] = useState(null);
  const [copyrightText, setCopyrightText] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();

  // Fetch footer data
  useEffect(() => {
    const fetchFooterData = async () => {
      setLoading(true);
      try {
        console.log("[Footer] Fetching footer data...");
        const data = await hygraphClient.request(GetFooterData);
        console.log("[Footer] Raw footer data received:", data);

        // Set social links if available, otherwise use constants
        if (data.socialLinks && data.socialLinks.length > 0) {
          setDynamicSocials(data.socialLinks);
        }

        // Set copyright text if available
        if (data.footerInfo && data.footerInfo.length > 0 && data.footerInfo[0].copyrightText) {
          setCopyrightText(data.footerInfo[0].copyrightText);
        }

      } catch (error) {
        console.error('Error fetching footer data:', error);
        // Fallback to constants - already imported
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  // Determine which social links to use
  const displaySocials = dynamicSocials || socials;
  
  // Get current year for copyright
  const currentYear = new Date().getFullYear();

  return (
    <Section crosses className={`!px-0 !py-10 ${isDarkMode ? 'bg-n-8' : 'bg-n-1'}`}>
      <div className="container">
        <div className="flex flex-col items-center gap-10">
          
          {/* Navigation Grid - Using constants-based navigation */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 w-full">
            {navigation.map((item) => (
              <FooterColumn
                key={item.id}
                title={item.title}
                items={item.dropdownItems}
              />
            ))}
          </div>

          {/* Bottom Bar */}
          <div className={`flex flex-col sm:flex-row items-center justify-between gap-6 w-full pt-10 mt-10 border-t ${isDarkMode ? 'border-n-6' : 'border-n-3'}`}>
            {/* Copyright - Dynamic if available, otherwise fallback */}
            <p className={`text-sm ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
              {copyrightText ? (
                copyrightText.replace('[YEAR]', currentYear)
              ) : (
                `© ${currentYear} JediLabs. All rights reserved.`
              )}
            </p>

            {/* Social Links - Dynamic if available, otherwise fallback */}
            <ul className="flex gap-5 flex-wrap">
              {displaySocials.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                    isDarkMode ? 'bg-n-7 hover:bg-n-6' : 'bg-n-3 hover:bg-n-4'
                  }`}
                  aria-label={item.platform || item.title}
                >
                  {/* Support both icon URL and icon name */}
                  {item.iconUrl ? (
                    <img src={item.iconUrl} width={16} height={16} alt={item.title} />
                  ) : item.icon ? (
                    <img src={item.icon} width={16} height={16} alt={item.platform} />
                  ) : (
                    <span className={`${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                      {item.platform?.charAt(0) || item.title?.charAt(0) || '#'}
                    </span>
                  )}
                </a>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Footer;
