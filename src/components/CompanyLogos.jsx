import React from "react";
import Slider from "react-slick";
import {companyLogos } from "../constants";
import { StarsCanvas} from "../components/canvas";


// Import the slick-carousel CSS files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CompanyLogos = ({ className }) => {
  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Show 4 logos at a time
    slidesToScroll: 1,
    arrows: true,
    customPaging: (i) => (
      <div className="dot"></div>
    ),
    dotsClass: "slick-dots custom-dots",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className={className}>
      <h5 className="tagline mb-6 text-center text-n-1/50">
      Backed By
      </h5>
      <Slider {...settings}>
        {backedBy.map((logo, index) => (
          <div key={index} className="p-2">
            <li className="flex items-center justify-center h-[8.5rem]">
              <img src={logo} width={134} height={28} alt={`Logo ${index + 1}`} />
            </li>
          </div>
        ))}
      </Slider>
      <StarsCanvas/>
    </div>
  );
};

export default CompanyLogos;
