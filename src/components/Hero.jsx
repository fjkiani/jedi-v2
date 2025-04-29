import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
// import { curve, heroBackground } from "../assets";
import Button from "./Button";
import Section from "./Section";
import { BackgroundCircles, BottomLine, Gradient } from "./design/Hero";
import { heroIcons } from "../constants";
import { ScrollParallax } from "react-just-parallax";
import Generating from "./Generating";
import Notification from "./Notification";
import CompanyLogos from "./CompanyLogos";
import Icon from "./Icon";
// import { coding2 } from "../assets/videos";

// Import the slick-carousel CSS files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Helper function for text formatting
const formatText = (text) => {
  if (!text) return '';
  return text.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < text.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));
};

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
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  const heroContent = {
    title: "100x Your Business Potential",
    subtitle: "We transform organizations through cutting-edge AI solutions, strategic consulting, and innovative services that deliver exponential growth and operational excellence.",
    video: "/videos/coding2.mp4",
  };

  // Create a ref for the video element
  const videoRef = useRef(null);

  // Play the video when the section loads
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  return (
    <Section
      className="pt-[12rem] -mt-[5.25rem] theme-bg-primary"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      <div className="container relative">
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
          <h1 className="h1 mb-6 theme-text-primary">
            {heroContent.title}
          </h1>
          <p className="body-1 max-w-3xl mx-auto mb-6 theme-text-secondary lg:mb-8">
            {formatText(heroContent.subtitle)}
          </p>
          <Button href="/contact" white>
            Get started
          </Button>
        </div>
        <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24">
          <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
            <div className="relative theme-bg-secondary rounded-[1rem]">
              <div className="h-[1.4rem] bg-n-10 rounded-t-[0.9rem]" />

              <div className="aspect-[33/40] rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490]">
                {isVideoLoading && (
                  <div className="w-full h-full bg-n-8 animate-pulse flex items-center justify-center">
                    <Icon 
                      name="loader" 
                      className="w-10 h-10 text-primary-1 animate-spin" 
                    />
                  </div>
                )}
                <video
                  ref={videoRef}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    isVideoLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  src="/videos/coding2.mp4"
                  controls
                  muted
                  autoPlay
                  preload="none"
                  onLoadedData={() => setIsVideoLoading(false)}
                  playsInline
                  alt="Hero video"
                />
                <Generating className="absolute left-4 right-4 bottom-5 md:left-1/2 md:right-auto md:bottom-8 md:w-[31rem] md:-translate-x-1/2" />

                <ScrollParallax isAbsolutelyPositioned>
                  <ul className="hidden absolute -left-[5.5rem] bottom-[7.5rem] px-1 py-1 theme-bg-secondary backdrop-blur border theme-border rounded-2xl xl:flex">
                  </ul>
                </ScrollParallax>

                <ScrollParallax isAbsolutelyPositioned>
                </ScrollParallax>
              </div>
            </div>

            <Gradient />
          </div>
          <div className="absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%]">
          </div>

          <BackgroundCircles />
        </div>

        <BackgroundCircles />

        <CompanyLogos className="hidden relative z-10 mt-20 lg:block" />
      </div>

      <BottomLine />
    </Section>
  );
};

export default Hero;
