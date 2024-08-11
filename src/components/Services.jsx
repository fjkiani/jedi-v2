import React, { useState } from "react";
import Slider from "react-slick"; // Import react-slick for the slider
import Section from "./Section";
import Heading from "./Heading";
import { service1, service2, service3, check } from "../assets";
import { brainwaveServices, brainwaveServicesIcons } from "../constants";
import {
  PhotoChatMessage,
  Gradient,
  VideoBar,
  VideoChatMessage,
} from "./design/Services";
import Generating from "./Generating";

const Services = () => {
  const [selectedService, setSelectedService] = useState(0);

  const serviceContent = [
    {
      title: "Generative AI",
      subtitle: "Enhance your photos effortlessly",
      description: "Automatically enhance your photos using our AI app's photo editing feature. Try it now!",
      video: "https://path-to-your-video-1.mp4",
    },
    {
      title: "AI Agents",
      subtitle: "Create stunning visuals with ease",
      description: "The world’s most powerful AI photo and video art generation engine. What will you create?",
      video: "https://path-to-your-video-2.mp4",
    },
    {
      title: "Knowledge Base",
      subtitle: "Professional-grade audio enhancement",
      description: "Process and enhance audio files with our advanced AI-driven tools for clear and professional results.",
      video: "https://path-to-your-video-3.mp4",
    },
  ];

  const handleIconClick = (index) => {
    setSelectedService(index);
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Section id="how-to-use">
      <div className="container">
        <Heading
          title="Jedi Labs Develops Innovative Technology Solutions Across All Industries"
        />

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
          {/* //turn this into a slider where it changes based on the icons above  */}
          <div className="relative z-1 flex flex-col lg:flex-row items-center h-auto lg:h-[39rem] mb-5 p-8 border border-n-1/10 rounded-3xl overflow-hidden lg:p-20 xl:h-[46rem]">
            <div className="relative h-[20rem] w-full lg:w-[65%] bg-n-8 rounded-xl overflow-hidden md:h-[25rem]">
              <video
                className="w-full h-full object-cover"
                src={serviceContent[selectedService].video}
                controls
                alt={serviceContent[selectedService].title}
              />
              <VideoChatMessage />
              <VideoBar />
            </div>

            <div className="relative z-1 max-w-[17rem] mt-8 lg:mt-0 lg:ml-8 lg:w-[35%]">
              <h4 className="h4 mb-4">{serviceContent[selectedService].title}</h4>
              <p className="body-2 mb-[3rem] text-n-3">
                {serviceContent[selectedService].description}
              </p>
              <ul className="body-2">
                {brainwaveServices.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start py-4 border-t border-n-6"
                  >
                    <img width={24} height={24} src={check} alt="check icon" />
                    <p className="ml-4">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* This section can be turned into its on component ||  Slider for the images */}
          {/* <Slider {...sliderSettings}>
            <div className="relative min-h-[39rem] border border-n-1/10 rounded-3xl overflow-hidden">
              <div className="absolute inset-0">
                <img
                  src={service2}
                  className="h-full w-full object-cover"
                  width={630}
                  height={750}
                  alt="robot"
                />
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-b from-n-8/0 to-n-8/90 lg:p-15">
                <h4 className="h4 mb-4">{serviceContent[selectedService].title}</h4>
                <p className="body-2 mb-[3rem] text-n-3">
                  {serviceContent[selectedService].description}
                </p>
              </div>

              <PhotoChatMessage />
            </div>

            <div className="p-4 bg-n-7 rounded-3xl overflow-hidden lg:min-h-[46rem]">
              <img
                src={service2}
                className="h-full w-full object-cover"
                width={630}
                height={750}
                alt="robot"
              />
            </div>
          </Slider> */}

          <Gradient />
        </div>
      </div>
    </Section>
  );
};

export default Services;
