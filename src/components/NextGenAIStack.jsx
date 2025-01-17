import React from "react";
import Slider from "react-slick";
import Heading from "./Heading";
import Section from "./Section";
import Arrow from "../assets/svg/Arrow";
import { GradientLight } from "./design/Benefits";
import ClipPath from "../assets/svg/ClipPath";
import { getAllSolutions } from "../constants/solutions";
import { Link } from 'react-router-dom';
import { Icon } from "./Icon";
import { useTheme } from "@/context/ThemeContext";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NextGenAIStack = () => {
  const solutions = getAllSolutions();
  const { isDarkMode } = useTheme();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
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
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Section className="overflow-hidden">
      <div className="container relative z-2">
        <Heading
          className="md:max-w-md lg:max-w-2xl"
          title="NextGen AI Stack"
        />
        
        <div className="mt-10">
          <Slider {...settings}>
            {solutions.map((solution) => (
              <div key={solution.id} className="px-4">
                <div className={`relative p-8 h-[400px] rounded-3xl overflow-hidden ${isDarkMode ? 'bg-n-7' : 'bg-white'} border ${isDarkMode ? 'border-n-6' : 'border-n-3'} 
                  group transition-all duration-500 ${isDarkMode ? 'hover:border-n-4' : 'hover:border-n-5'}`}>
                  {/* Background Image with enhanced transitions */}
                  <div className={`absolute inset-0 z-0 ${isDarkMode ? 'opacity-[0.08]' : 'opacity-[0.12]'} transition-all duration-700 
                    ${isDarkMode ? 'group-hover:opacity-[0.18]' : 'group-hover:opacity-[0.22]'} group-hover:scale-[1.05]`}>
                    {solution.imageUrl && (
                      <img
                        src={solution.imageUrl}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-700"
                      />
                    )}
                  </div>

                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 z-1">
                    {/* Base gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${isDarkMode ? 'from-n-8/95 via-n-8/70 to-n-8/50' : 'from-white/95 via-white/70 to-white/50'} 
                      transition-opacity duration-700`} />
                    
                    {/* Accent gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-1/5 via-primary-1/0 to-transparent 
                      opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                  </div>
                  
                  {/* Content with enhanced hover effects */}
                  <div className="relative z-2">
                    <div className="mb-[2rem] transition-transform duration-500 group-hover:translate-y-[-4px]">
                      <div className={`w-12 h-12 ${isDarkMode ? 'bg-n-6/80' : 'bg-n-2/80'} backdrop-blur-sm rounded-xl 
                        flex items-center justify-center mb-6 transition-all duration-500
                        ${isDarkMode ? 'group-hover:bg-n-5/80' : 'group-hover:bg-n-3/80'} group-hover:shadow-lg group-hover:shadow-primary-1/20`}>
                        <Icon name={solution.icon} className="w-6 h-6 text-primary-1 transition-transform 
                          duration-500 group-hover:scale-110" />
                      </div>
                      <h4 className={`h4 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'} transition-colors duration-500 
                        group-hover:text-primary-1`}>{solution.title}</h4>
                      <p className={`body-2 ${isDarkMode ? 'text-n-3' : 'text-n-5'} transition-colors duration-500 
                        ${isDarkMode ? 'group-hover:text-n-1' : 'group-hover:text-n-6'}`}>{solution.description}</p>
                    </div>
                    
                    <Link 
                      to={`/solutions/${solution.slug}`}
                      className={`flex items-center gap-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'} transition-all duration-500 
                        group-hover:gap-5`}
                    >
                      <span className="font-bold relative">
                        EXPLORE MORE
                        <span className="absolute left-0 right-0 bottom-0 h-px bg-primary-1 
                          transform origin-left scale-x-0 transition-transform duration-500 
                          group-hover:scale-x-100" />
                      </span>
                      <Arrow className="transition-all duration-500 
                        group-hover:translate-x-2 group-hover:text-primary-1" />
                    </Link>
                  </div>

                  {/* Decorative corner gradient */}
                  <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-t 
                    from-primary-1/20 via-primary-1/0 to-transparent opacity-0 
                    transition-opacity duration-700 group-hover:opacity-100" />
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Enhanced Navigation Dots */}
        <div className="flex justify-center gap-3 mt-10">
          {[0, 1, 2].map((index) => (
            <div 
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 
                ${index === 1 ? (isDarkMode ? 'bg-n-1' : 'bg-n-8') : (isDarkMode ? 'bg-n-6 hover:bg-n-5' : 'bg-n-3 hover:bg-n-4')} 
                ${index === 1 ? 'scale-125' : ''}`}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default NextGenAIStack;