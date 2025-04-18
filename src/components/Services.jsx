import React, { useState } from "react";
import Slider from "react-slick";
import Section from "./Section";
import Heading from "./Heading";
import { brainwaveServices, brainwaveServicesIcons, serviceContent, sliderSettings } from "../constants";
import { check } from "../assets";
import { PhotoChatMessage, Gradient, VideoBar, VideoChatMessage } from "./design/Services";
import Generating from "./Generating";
// import { StarsCanvas} from "../components/canvas";


const Services = () => {
  const [selectedService, setSelectedService] = useState(0);

  const handleIconClick = (index) => {
    setSelectedService(index);
  };

  return (
    <Section id="how-to-use">
      <div className="container">
        <Heading title="100x Business Transformation Solutions" />

        <div className="py-8 px-4 xl:px-8">
          <h4 className="h4 mb-4">{serviceContent[selectedService].title}</h4>
          <p className="body-2 mb-[2rem] text-n-3 max-w-3xl">
            {serviceContent[selectedService].subtitle}
          </p>

          <ul className="flex items-center justify-start gap-4 overflow-x-auto mb-8 pb-2">
            {brainwaveServicesIcons.map((item, index) => (
              <li
                key={index}
                className={`cursor-pointer rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  index === selectedService
                    ? "w-[3rem] h-[3rem] p-0.25 bg-conic-gradient md:w-[4.5rem] md:h-[4.5rem]"
                    : "flex w-10 h-10 bg-n-6 md:w-15 md:h-15"
                }`}
                onClick={() => handleIconClick(index)}
              >
                <div
                  className={
                    index === selectedService
                      ? "flex items-center justify-center w-full h-full bg-n-7 rounded-[1rem]"
                      : ""
                  }
                >
                  <img src={item} width={24} height={24} alt={`Icon ${index + 1}`} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="relative z-1 flex flex-col lg:flex-row items-start h-auto mb-5 p-6 md:p-8 border border-n-1/10 rounded-3xl overflow-hidden lg:p-10 xl:p-16">
            <div className="relative h-[20rem] w-full lg:w-[55%] bg-n-8 rounded-xl overflow-hidden md:h-[25rem] lg:h-[30rem]">
              <video
                className="w-full h-full object-cover"
                src={serviceContent[selectedService].video}
                controls
                alt={serviceContent[selectedService].title}
              />
            </div>

            <div className="relative z-1 w-full lg:w-[45%] mt-8 lg:mt-0 lg:ml-10">
              <div className="mb-8">
                <h4 className="h4 mb-3 text-color-1">{serviceContent[selectedService].title2}</h4>
                <div className="h-1 w-16 bg-color-1 rounded-full mb-6"></div>
                <p className="body-2 text-n-3 leading-relaxed whitespace-pre-line">
                  {serviceContent[selectedService].description}
                </p>
              </div>
              
              <div className="mt-8">
                <h5 className="font-bold text-lg mb-6 flex items-center">
                  <span className="inline-block w-8 h-8 rounded-full bg-color-1 flex items-center justify-center mr-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  Key Benefits
                </h5>
                <ul className="body-2 space-y-5">
                  {serviceContent[selectedService].useCases.map((useCase, index) => (
                    <li key={index} className="flex items-start py-2 border-t border-n-6">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-color-1/20 flex items-center justify-center mr-4 mt-1">
                        <img width={16} height={16} src={check} alt="check icon" />
                      </div>
                      <p className="flex-1">{useCase}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <a 
                  href="/contact" 
                  className="button button-primary"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>

          <Gradient />
        </div>
      </div>
    </Section>
  );
};

export default Services;