import React, { useState } from "react";
import Slider from "react-slick";
import Section from "./Section";
import Heading from "./Heading";
import { brainwaveServices, brainwaveServicesIcons, serviceContent, sliderSettings } from "../constants";
import { check } from "../assets";
import { PhotoChatMessage, Gradient, VideoBar, VideoChatMessage } from "./design/Services";
import Generating from "./Generating";
import { StarsCanvas} from "../components/canvas";


const Services = () => {
  const [selectedService, setSelectedService] = useState(0);

  const handleIconClick = (index) => {
    setSelectedService(index);
  };

  return (
    <Section id="how-to-use">
      <div className="container">
        <Heading title="Edulga aims to bridge the gaps between education and industry through a platform that offers real-time, personalized learning experiences " />

        <div className="py-12 px-4 xl:px-8">
          <h4 className="h4 mb-4">{serviceContent[selectedService].title}</h4>
          <p className="body-2 mb-[2rem] text-n-3">
            {serviceContent[selectedService].subtitle}
          </p>

          <ul className="flex items-center justify-between overflow-x-auto">
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
          <div className="relative z-1 flex flex-col lg:flex-row items-center h-auto lg:h-[39rem] mb-5 p-8 border border-n-1/10 rounded-3xl overflow-hidden lg:p-20 xl:h-[46rem]">
            <div className="relative h-[20rem] w-full lg:w-[65%] bg-n-8 rounded-xl overflow-hidden md:h-[25rem]">
              <video
                className="w-full h-full object-cover"
                src={serviceContent[selectedService].video}
                controls
                alt={serviceContent[selectedService].title}
              />
              {/* //change this message to the video */}
              {/* <VideoChatMessage /> */}
              {/* <VideoBar /> */}
            </div>

            <div className="relative z-1 max-w-[17rem] mt-8 lg:mt-0 lg:ml-8 lg:w-[35%]">
              <h4 className="h4 mb-4">{serviceContent[selectedService].title2}</h4>
              <p className="body-2 mb-[3rem] text-n-3">
                {serviceContent[selectedService].description}
              </p>
              <ul className="body-2">
                  {serviceContent[selectedService].useCases.map((useCase, index) => (
                    <li key={index} className="flex items-start py-4 border-t border-n-6">
                      <img width={24} height={24} src={check} alt="check icon" />
                      <p className="ml-4">{useCase}</p>
                    </li>
                  ))}
                </ul>

            </div>
          </div>

          <Gradient />
        </div>
      </div>
                <StarsCanvas/>
    </Section>
  );
};

export default Services;