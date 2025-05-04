import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Section from "./Section";
import { socials } from "../constants";
import { logo } from "../assets";
import { gql } from 'graphql-request';
import { hygraphClient } from '@/lib/hygraph';
import { technologyService } from '@/services/technologyService';

const FooterColumn = ({ title, url, items = [] }) => (
  <div className="flex flex-col gap-4">
    <h5 className="text-n-1 font-semibold">
      {items && items.length > 0 ? (
        title
      ) : url ? (
        <Link to={url} className="hover:text-n-1 transition-colors">{title}</Link>
      ) : (
        <span className="cursor-default">{title}</span>
      )}
    </h5>
    {items && items.length > 0 && (
      <ul className="flex flex-col gap-3">
        {items.map((item, index) => (
          <li key={item.id || index}>
            <div>
              <Link
                to={item.url}
                className="text-n-4 hover:text-n-1 transition-colors"
              >
                {item.title}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const GetFooterNavData = gql`
  query GetFooterNavData {
    industries(stage: PUBLISHED, orderBy: name_ASC) {
      id
      name
      slug
    }
    useCaseS(stage: PUBLISHED, orderBy: title_ASC) {
      id
      title
      slug
      industry {
        slug
      }
    }
  }
`;

const Footer = () => {
  const [footerNavData, setFooterNavData] = useState({
    industries: [],
    useCases: [],
    techCategories: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooterData = async () => {
      setLoading(true);
      try {
        console.log("[Footer] Fetching navigation data...");
        const mainData = await hygraphClient.request(GetFooterNavData);
        console.log("[Footer] Raw main nav data received:", mainData);

        const techData = await technologyService.getAllCategories();
        console.log("[Footer] Fetched Technology categories:", techData);

        const validUseCases = (mainData?.useCaseS || []).filter(uc => {
          const hasIndustryAndSlug = uc.industry && uc.industry.slug;
          if (!hasIndustryAndSlug) {
            console.warn(`[Footer] Filtering out use case "${uc.title}" (ID: ${uc.id}) due to missing or invalid industry link for URL.`);
          }
          return hasIndustryAndSlug;
        });

        setFooterNavData({
          industries: mainData?.industries || [],
          useCases: validUseCases,
          techCategories: techData || [],
        });

      } catch (error) {
        console.error('Error fetching footer navigation data:', error);
        setFooterNavData({ industries: [], useCases: [], techCategories: [] });
      } finally {
        setLoading(false);
        console.log("[Footer] Loading complete.");
      }
    };
    fetchFooterData();
  }, []);

  const footerColumns = useMemo(() => {
    if (loading) return [];

    console.log("[Footer] Preparing footer columns with data:", footerNavData);

    const columns = [];

    columns.push({
      id: 'company',
      title: 'Company',
      url: '/about',
      items: [
        { id: 'about-us', title: 'About Us', url: '/about' },
        { id: 'careers', title: 'Careers', url: '/careers' },
        { id: 'contact', title: 'Contact', url: '/contact' },
      ]
    });

    if (footerNavData.industries.length > 0) {
      columns.push({
        id: 'industries',
        title: 'Industries',
        url: '/industries',
        items: footerNavData.industries.map(ind => ({
          id: ind.id,
          title: ind.name,
          url: `/industries/${ind.slug}`,
        })),
      });
    }

    if (footerNavData.useCases.length > 0) {
      columns.push({
        id: 'use-cases',
        title: 'Use Cases',
        url: '/usecases',
        items: footerNavData.useCases.map(uc => ({
          id: uc.id,
          title: uc.title,
          url: `/industries/${uc.industry.slug}/${uc.slug}`,
        })),
      });
    }

    if (footerNavData.techCategories.length > 0) {
      columns.push({
        id: 'technology',
        title: 'Technology',
        url: '/technology',
        items: footerNavData.techCategories.map(cat => ({
          id: cat.id || cat.slug,
          title: cat.name,
          url: `/technology#${cat.slug}`,
        })),
      });
    }

    columns.push({
      id: 'resources',
      title: 'Resources',
      url: '/resources',
      items: [
        { id: 'blog', title: 'Blog', url: '/blog' },
        // { id: 'whitepapers', title: 'Whitepapers', url: '/whitepapers' },
        // { id: 'case-studies', title: 'Case Studies', url: '/case-studies' },
      ]
    });

    console.log("[Footer] Prepared footer columns:", columns);
    return columns;
  }, [loading, footerNavData]);

  return (
    <Section crosses className="!px-0 !py-10">
      <div className="container">
        <div className="flex flex-col items-center gap-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10 w-full">
            {!loading && footerColumns.map((item) => (
              <FooterColumn
                key={item.id}
                title={item.title}
                url={item.url}
                items={item.items}
              />
            ))}
            {loading && (
              <div className="col-span-full text-center text-n-4">Loading footer...</div>
            )}
          </div>

          <div className="flex flex-col items-start sm:items-center sm:flex-row justify-between gap-6 w-full pt-10 mt-10 border-t border-n-6">
            <p className="text-n-4 text-sm">
              © {new Date().getFullYear()} JediLabs. All rights reserved.
            </p>

            <ul className="flex gap-5 flex-wrap">
              {socials.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-n-7 rounded-full transition-colors hover:bg-n-6"
                >
                  <img src={item.iconUrl} width={16} height={16} alt={item.title} />
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
