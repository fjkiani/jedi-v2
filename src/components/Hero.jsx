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
import { useScrollAnimation } from "../hooks/useScrollAnimation";
// import { coding2 } from "../assets/videos";
import SystemLog from "./SystemLog";
import GridBackground from "./GridBackground";

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

  // Scroll animations
  const titleAnimation = useScrollAnimation({ animationType: 'fadeIn', delay: 0 });
  const subtitleAnimation = useScrollAnimation({ animationType: 'fadeIn', delay: 200 });
  const buttonAnimation = useScrollAnimation({ animationType: 'fadeInScale', delay: 400 });
  const videoAnimation = useScrollAnimation({ animationType: 'slideInUp', delay: 600 });
  const logoAnimation = useScrollAnimation({ animationType: 'fadeIn', delay: 800 });

  const heroContent = {
    title: "Production AI Co-Pilots.",
    subtitle: "Agentic AI consulting and development studio — shipping production co-pilots for SMBs across Healthcare, Finance, and Education via a modular MCP/NLP/LLM stack.",
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
      className="pt-[12rem] -mt-[5.25rem] theme-bg-primary relative overflow-hidden"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      {/* Tactical Grid Background */}
      <GridBackground className="z-0" />

      <div className="container relative z-10">
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
          <h1 ref={titleAnimation.ref} className={`h1 mb-6 theme-text-primary uppercase tracking-tighter ${titleAnimation.animationClasses}`}>
            <span className="glitch-safe" data-text={heroContent.title}>
              {heroContent.title}
            </span>
          </h1>
          <p ref={subtitleAnimation.ref} className={`body-1 max-w-3xl mx-auto mb-6 theme-text-secondary lg:mb-8 font-mono text-sm tracking-wide ${subtitleAnimation.animationClasses}`}>
            {formatText(heroContent.subtitle)}
          </p>
          <div ref={buttonAnimation.ref} className={buttonAnimation.animationClasses}>
            <Button href="/jedi" white>
              Access The Registry
            </Button>
          </div>
        </div>
        <div ref={videoAnimation.ref} className={`relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24 ${videoAnimation.animationClasses}`}>
          <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient group">
            {/* HUD Effects */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary-1 z-20 transition-all group-hover:w-8 group-hover:h-8"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary-1 z-20 transition-all group-hover:w-8 group-hover:h-8"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary-1 z-20 transition-all group-hover:w-8 group-hover:h-8"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary-1 z-20 transition-all group-hover:w-8 group-hover:h-8"></div>

            <div className="relative theme-bg-secondary rounded-[1rem]">
              <div className="h-[1.4rem] bg-n-10 rounded-t-[0.9rem] flex items-center px-4 gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div className="ml-auto text-[0.5rem] font-mono text-n-4">SECURE FEED | JEDI-CORE-V1</div>
              </div>

              <div className="aspect-[33/40] rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490] relative">
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
                  className={`w-full h-full object-cover transition-opacity duration-300 ${isVideoLoading ? 'opacity-0' : 'opacity-100'
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

                {/* Replaced 'Generating' with SystemLog for a more active look */}
                <div className="absolute left-4 right-4 bottom-5 md:left-1/2 md:right-auto md:bottom-8 md:w-[31rem] md:-translate-x-1/2 font-mono">
                  <SystemLog className="h-24 bg-n-9/90 border-n-1/10 shadow-lg backdrop-blur-sm" />
                </div>

                <ScrollParallax isAbsolutelyPositioned>
                  <ul className="hidden absolute -left-[5.5rem] bottom-[7.5rem] px-1 py-1 theme-bg-secondary backdrop-blur border theme-border rounded-2xl xl:flex">
                    {/* Keep empty or add icons here later */}
                  </ul>
                </ScrollParallax>

                <ScrollParallax isAbsolutelyPositioned>
                </ScrollParallax>
              </div>
            </div>

            <Gradient />
          </div>
          <div className="absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%] pointer-events-none">
            {/* Keep empty or add light effects */}
          </div>

          <BackgroundCircles />
        </div>

        <BackgroundCircles />

        <div ref={logoAnimation.ref} className={logoAnimation.animationClasses}>
          <CompanyLogos className="hidden relative z-10 mt-20 lg:block" />
        </div>
      </div>

      <BottomLine />
    </Section>
  );
};

export default Hero;
