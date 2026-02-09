import React from "react";
import Slider from "react-slick";
import { check } from "../assets";
import { pricing } from "../constants";
import Button from "./Button";
import { useTheme } from '@/context/ThemeContext';
import { FiHexagon, FiShield, FiPackage } from 'react-icons/fi';

const PricingCard = ({ item, isDarkMode }) => {
  return (
    <div className={`w-full h-full px-6 py-8 border-2 transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] ${isDarkMode
      ? 'bg-n-8 border-n-6 hover:border-primary-1'
      : 'bg-white border-n-3 hover:border-n-8 shadow-lg'
      }`}>
      {/* Crate Visuals */}
      <div className={`absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 ${isDarkMode ? 'border-n-6 group-hover:border-primary-1' : 'border-n-3 group-hover:border-n-8'}`}></div>
      <div className={`absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 ${isDarkMode ? 'border-n-6 group-hover:border-primary-1' : 'border-n-3 group-hover:border-n-8'}`}></div>
      <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 ${isDarkMode ? 'border-n-6 group-hover:border-primary-1' : 'border-n-3 group-hover:border-n-8'}`}></div>
      <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 ${isDarkMode ? 'border-n-6 group-hover:border-primary-1' : 'border-n-3 group-hover:border-n-8'}`}></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h4 className={`h4 font-mono uppercase ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{item.title}</h4>
        <div className={`p-2 rounded border ${isDarkMode ? 'border-n-6 bg-n-7' : 'border-n-3 bg-n-2'}`}>
          {item.title.includes('Enterprise') ? <FiShield size={20} /> : <FiPackage size={20} />}
        </div>
      </div>

      <p className={`body-2 min-h-[4rem] mb-6 font-mono text-xs ${isDarkMode ? 'text-n-4' : 'text-n-6'}`}>
        // {item.description}
      </p>

      {/* Price */}
      <div className="flex items-center h-[5.5rem] mb-6 border-b border-dashed border-n-6/50">
        {item.price ? (
          <>
            <div className="h3 font-mono text-n-4">$</div>
            <div className={`text-[2.5rem] leading-none font-bold font-mono ${isDarkMode ? 'text-primary-1' : 'text-n-8'}`}>
              {item.price}
            </div>
          </>
        ) : (
          <div className={`text-[1.5rem] leading-none font-bold font-mono uppercase ${isDarkMode ? 'text-primary-1' : 'text-n-8'}`}>
            Custom Quote
          </div>
        )}
      </div>

      {/* Button */}
      {/* <Button
        className="w-full mb-8 font-mono uppercase tracking-widest"
        href={item.price ? "/pricing" : "mailto:contact@jedilabs.org"}
        white={!!item.price}
      >
        {item.price ? "Requisition Access" : "Contact Command"}
      </Button> */}
      <a href={item.price ? "/pricing" : "/contact"} className={`w-full block py-3 text-center mb-8 border font-mono uppercase text-sm font-bold tracking-widest transition-colors ${isDarkMode
        ? 'border-primary-1 text-primary-1 hover:bg-primary-1 hover:text-n-8'
        : 'border-n-8 text-n-8 hover:bg-n-8 hover:text-n-1'
        }`}>
        {item.price ? "GET STARTED" : "CONTACT SALES"}
      </a>

      {/* Features */}
      <ul>
        {item.features.map((feature, index) => (
          <li
            key={index}
            className={`flex items-start py-4 border-t ${isDarkMode ? 'border-n-6' : 'border-n-3'}`}
          >
            <div className={`mt-1 mr-4 ${isDarkMode ? 'text-primary-1' : 'text-n-8'}`}>
              <FiHexagon size={12} className="fill-current" />
            </div>
            <p className={`body-2 font-mono text-xs ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{feature}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const PricingList = () => {
  const { isDarkMode } = useTheme();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    className: "h-full"
  };

  return (
    <>
      {/* Slider for mobile */}
      <div className="block lg:hidden">
        <Slider {...settings}>
          {pricing.map((item) => (
            <div key={item.id} className="p-2 h-full">
              <PricingCard item={item} isDarkMode={isDarkMode} />
            </div>
          ))}
        </Slider>
      </div>

      {/* Static display for larger screens */}
      <div className="hidden lg:flex gap-[1rem] justify-center items-stretch h-full">
        {pricing.map((item) => (
          <div key={item.id} className="w-[19rem] lg:w-[22rem]">
            <PricingCard item={item} isDarkMode={isDarkMode} />
          </div>
        ))}
      </div>
    </>
  );
};

export default PricingList;
