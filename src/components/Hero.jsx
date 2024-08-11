import React, { useState } from "react";
import Slider from "react-slick";
import { curve, heroBackground } from "../assets";
import Button from "./Button";
import Section from "./Section";
import { BackgroundCircles, BottomLine, Gradient } from "./design/Hero";
import { heroIcons } from "../constants";
import { ScrollParallax } from "react-just-parallax";
import Generating from "./Generating";
import Notification from "./Notification";
import CompanyLogos from "./CompanyLogos";

// Import the slick-carousel CSS files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom arrow components with larger size
const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, fontSize: "2.5rem", right: "-25px", zIndex: 2 }}
      onClick={onClick}
    >
      &rarr;
    </div>
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, fontSize: "2.5rem", left: "-25px", zIndex: 2 }}
      onClick={onClick}
    >
      &larr;
    </div>
  );
};

const Hero = () => {
  const heroContent = [
    {
      title: "Unlock the Full Potential of Your Business with Jedi Labs",
      subtitle: "Unleash the power of technology to transform your business.",
      video: "https://path-to-your-video-1.mp4",
    },
    {
      title: "Elevate Your Business with Cutting-Edge AI Solutions",
      subtitle: "Transform ideas into reality with our advanced AI tools.",
      video: "https://path-to-your-video-2.mp4",
    },
    {
      title: "Innovate and Scale with Jedi Labs' Expertise",
      subtitle: "Harness the future of technology to drive your success.",
      video: "https://path-to-your-video-3.mp4",
    },
  ];

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    customPaging: (i) => (
      <div className="dot"></div>
    ),
    dotsClass: "slick-dots custom-dots",
  };

  return (
    <Section
      className="pt-[12rem] -mt-[5.25rem]"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      <div className="container relative">
        <Slider {...settings}>
          {heroContent.map((content, index) => (
            <div key={index}>
              <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
                <h1 className="h1 mb-6">
                  {content.title}&nbsp;&nbsp;
                  <span className="inline-block relative">
                    Jedi Labs{" "}
                    <img
                      src={curve}
                      className="absolute top-full left-0 w-full xl:-mt-2"
                      width={624}
                      height={28}
                      alt="Curve"
                    />
                  </span>
                </h1>
                <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8">
                  {content.subtitle}
                </p>
                <Button href="/pricing" white>
                  Get started
                </Button>
              </div>
              <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24">
                <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
                  <div className="relative bg-n-8 rounded-[1rem]">
                    <div className="h-[1.4rem] bg-n-10 rounded-t-[0.9rem]" />

                    <div className="aspect-[33/40] rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490]">
                      <video
                        className="w-full h-full object-cover"
                        src={content.video}
                        controls
                        alt="Hero video"
                      />
                      <Generating className="absolute left-4 right-4 bottom-5 md:left-1/2 md:right-auto md:bottom-8 md:w-[31rem] md:-translate-x-1/2" />

                      <ScrollParallax isAbsolutelyPositioned>
                        <ul className="hidden absolute -left-[5.5rem] bottom-[7.5rem] px-1 py-1 bg-n-9/40 backdrop-blur border border-n-1/10 rounded-2xl xl:flex">
                          {heroIcons.map((icon, iconIndex) => (
                            <li className="p-5" key={iconIndex}>
                              <img src={icon} width={24} height={25} alt={icon} />
                            </li>
                          ))}
                        </ul>
                      </ScrollParallax>

                      <ScrollParallax isAbsolutelyPositioned>
                        <Notification
                          className="hidden absolute -right-[5.5rem] bottom-[11rem] w-[18rem] xl:flex"
                          title="Code generation"
                        />
                      </ScrollParallax>
                    </div>
                  </div>

                  <Gradient />
                </div>
                <div className="absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%]">
                  <img
                    src={heroBackground}
                    className="w-full"
                    width={1440}
                    height={1800}
                    alt="hero"
                  />
                </div>

                <BackgroundCircles />
              </div>
            </div>
          ))}
        </Slider>

        <CompanyLogos className="hidden relative z-10 mt-20 lg:block" />
      </div>

      <BottomLine />
    </Section>
  );
};

export default Hero;
