import React, { useState, useRef, useEffect } from "react";
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
import Icon from "./Icon";
// import { coding2 } from "../assets/videos";

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
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  const heroContent = [
    {
      title: "You imagine, We Engineer",
      subtitle: "We are a team of AI engineers, best-in-class designers, and web developers who are passionate about building products that are both meaningful and impactful.",
      video: "/videos/coding2.mp4",
    },
    {
      title: "Knowledge as a Service for Enterprise AI",
      subtitle: "JediLabs transforms how enterprises harness AI by combining cutting-edge technology with deep domain expertise. Our platform turns complex AI capabilities into actionable business solutions.",
      video: "/videos/coding2.mp4",
    },
    {
      title: "Enterprise-Grade AI/ML Solutions",
      subtitle: "From intelligent document processing to predictive analytics, we build custom AI solutions that scale. Achieve 80% faster deployment, 60% cost reduction, and 95% automation accuracy.",
      video: "/videos/coding2.mp4",
    },
    {
      title: "Autonomous AI Agents & Orchestration",
      subtitle: "Deploy self-improving AI agents that handle complex workflows 24/7. Our agents integrate with your existing tools, reducing manual intervention by 90% while maintaining enterprise security standards.",
      video: "/videos/coding2.mp4",
    },
    {
      title: "Intelligent Data Engineering Pipeline",
      subtitle: "Transform raw data into business intelligence with our end-to-end data solutions. Process millions of records in real-time, ensure 99.9% data accuracy, and generate insights 10x faster.",
      video: "/videos/coding2.mp4",
    },
    {
      title: "Custom LLM Development & Integration",
      subtitle: "Build and deploy domain-specific language models tailored to your industry. Our LLMs understand your business context, compliance requirements, and specialized terminology.",
      video: "/videos/coding2.mp4",
    },
    {
      title: "AI Strategy & Digital Transformation",
      subtitle: "Partner with our experts to develop your AI roadmap. We help you identify high-impact use cases, build proof of concepts, and scale successful implementations across your organization.",
      video: "/videos/coding2.mp4",
    }
  ];

  useEffect(() => {
    const fadeTimeout = 8000;    // Increased to 8 seconds for more reading time
    const fadeTransition = 1000; // Smooth 1-second transition

    // Set initial title
    setDisplayedTitle(heroContent[currentIndex].title);

    const fadeLoop = () => {
      // Start fade out
      setIsVisible(false);
      
      // After fade out, change text and start fade in
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % heroContent.length);
        setDisplayedTitle(heroContent[(currentIndex + 1) % heroContent.length].title);
        setIsVisible(true);
      }, fadeTransition);
    };

    // Set up the interval for changing text
    const interval = setInterval(fadeLoop, fadeTimeout);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // Create a ref for the video element
  const videoRef = useRef(null);

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    customPaging: (i) => <div className="dot"></div>,
    dotsClass: "slick-dots custom-dots",
    autoplay: true,
    autoplaySpeed: 8000,
    pauseOnHover: true,
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
  };

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
        <Slider {...settings}>
          {heroContent.map((content, index) => (
            <div key={index}>
              <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
                <h1 className={`h1 mb-6 theme-text-primary transition-opacity duration-500 ease-in-out ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}>
                  {displayedTitle}
                </h1>
                <p className={`body-1 max-w-3xl mx-auto mb-6 theme-text-secondary lg:mb-8 transition-opacity duration-500 ease-in-out ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}>
                  {heroContent[currentIndex].subtitle}
                </p>
                <Button href="/pricing" white>
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
                          {/* {heroIcons.map((icon, iconIndex) => (
                            <li className="p-5" key={iconIndex}>
                              <img src={icon} width={24} height={25} alt={icon} />
                            </li>
                          ))} */}
                        </ul>
                      </ScrollParallax>

                      <ScrollParallax isAbsolutelyPositioned>
                        {/* <Notification
                          className="hidden absolute -right-[5.5rem] bottom-[11rem] w-[18rem] xl:flex"
                          title="Code generation"
                        /> */}
                      </ScrollParallax>
                    </div>
                  </div>

                  <Gradient />
                </div>
                <div className="absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%]">
                  {/* <img
                    src={heroBackground}
                    className="w-full"
                    width={1440}
                    height={1800}
                    alt="hero"
                  /> */}
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
