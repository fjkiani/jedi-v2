import React from "react";
import { Link } from "react-router-dom";
import Section from "./Section";
import { socials, navigation } from "../constants";
import { logo } from "../assets";

const FooterColumn = ({ title, items }) => (
  <div className="flex flex-col gap-4">
    <h5 className="text-n-1 font-semibold">{title}</h5>
    <ul className="flex flex-col gap-3">
      {items.map((item, index) => (
        <li key={index}>
          {item.description ? (
            <div className="flex items-center gap-2">
              <span className="text-n-4/75 cursor-not-allowed">{item.title}</span>
              <span className="text-[0.625rem] px-2 py-0.5 bg-primary-1/10 text-primary-1 rounded-full whitespace-nowrap">
                Coming Soon
              </span>
            </div>
          ) : (
            <Link 
              to={item.url} 
              className="text-n-4 hover:text-n-1 transition-colors"
            >
              {item.title}
            </Link>
          )}
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  return (
    <Section crosses className="!px-0 !py-10">
      <div className="container">
        {/* Main Footer Content */}
        <div className="flex flex-col items-center gap-10">
          {/* Logo and Description */}
          <Link to="/" className="block mb-6">
            <img src={logo} alt="JediLabs" className="h-8" />
          </Link>
          
          {/* Navigation Grid */}
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full pt-10 mt-10 border-t border-n-6">
            {/* Copyright */}
            <p className="text-n-4 text-sm">
              © {new Date().getFullYear()} JediLabs. All rights reserved.
            </p>

            {/* Social Links */}
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
