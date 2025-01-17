import React from "react";
import Slider from "react-slick";
import {companyLogos } from "../constants";
import { StarsCanvas} from "../components/canvas";


// Import the slick-carousel CSS files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CompanyLogos = ({ className }) => {
  const baseSettings = {
    dots: false,
    infinite: true,
    speed: 8000,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const sliderRow1Settings = {
    ...baseSettings,
    rtl: false,
  };

  const sliderRow2Settings = {
    ...baseSettings,
    rtl: true,
  };

  const doubledLogos = [...companyLogos, ...companyLogos];

  return (
    <div className={className}>
      <h5 className="tagline mb-6 text-center text-n-1/50">
        Built using
      </h5>
      <div className="space-y-8">
        <div className="overflow-hidden">
          <Slider {...sliderRow1Settings}>
            {doubledLogos.map((logo, index) => (
              <div 
                key={`row1-${index}`} 
                className="p-2 group relative"
              >
                <li className="flex items-center justify-center h-[8.5rem]">
                  <div className="relative">
                    <img 
                      src={logo.image} 
                      width={134} 
                      height={28} 
                      alt={logo.name}
                      className="transition-all duration-300 group-hover:opacity-20" 
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm font-bold text-color-2 mb-2">
                        {logo.name}
                      </p>
                      <div className="flex flex-wrap justify-center gap-1">
                        {logo.services.map((service, serviceIndex) => (
                          <span 
                            key={serviceIndex}
                            className="text-[10px] px-2 py-1 rounded-full bg-n-1/10 text-n-1/80"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              </div>
            ))}
          </Slider>
        </div>

        <div className="overflow-hidden">
          <Slider {...sliderRow2Settings}>
            {doubledLogos.map((logo, index) => (
              <div 
                key={`row2-${index}`} 
                className="p-2 group relative"
              >
                <li className="flex items-center justify-center h-[8.5rem]">
                  <div className="relative">
                    <img 
                      src={logo.image} 
                      width={134} 
                      height={28} 
                      alt={logo.name}
                      className="transition-all duration-300 group-hover:opacity-20" 
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm font-bold text-color-2 mb-2">
                        {logo.name}
                      </p>
                      <div className="flex flex-wrap justify-center gap-1">
                        {logo.services.map((service, serviceIndex) => (
                          <span 
                            key={serviceIndex}
                            className="text-[10px] px-2 py-1 rounded-full bg-n-1/10 text-n-1/80"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      {/* <StarsCanvas/> */}
    </div>
  );
};

export default CompanyLogos;
