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
import { request } from 'graphql-request';

// Import the slick-carousel CSS files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// GraphQL query for hero content
const GET_HERO_CONTENT = `
  query GetHeroContent {
    heroContents(orderBy: createdAt_ASC) {
      id
      title
      subtitle
      heroVideo {
        url
      }
    }
  }
`;

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
  const [heroContent, setHeroContent] = useState([]);
  const [isChanging, setIsChanging] = useState(false);

  // Fetch hero content from Hygraph
  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const data = await request(
          'https://us-west-2.cdn.hygraph.com/content/cm1fkwyv5084x07mvgzp8hcml/master',
          GET_HERO_CONTENT
        );
        
        if (data.heroContents && data.heroContents.length > 0) {
          setHeroContent(data.heroContents);
          setDisplayedTitle(data.heroContents[0].title);
        }
      } catch (error) {
        console.error('Error fetching hero content:', error);
      }
    };

    fetchHeroContent();
  }, []);

  // Create a ref for the video element
  const videoRef = useRef(null);

  // Play the video when the section loads
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  if (heroContent.length === 0) {
    return null; // or a loading state
  }

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500, // Reduced for smoother transitions
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
    cssEase: "ease-out",
    beforeChange: (oldIndex, newIndex) => {
      setIsChanging(true);
      setCurrentIndex(newIndex);
    },
    afterChange: (index) => {
      setIsChanging(false);
      setCurrentIndex(index);
    }
  };

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
            <div key={content.id}>
              <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
                <h1 className={`h1 mb-6 theme-text-primary transition-all duration-300 ${
                  !isChanging && currentIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  {content.title}
                </h1>
                <p className={`body-1 max-w-3xl mx-auto mb-6 theme-text-secondary lg:mb-8 transition-all duration-300 delay-100 ${
                  !isChanging && currentIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  {content.subtitle}
                </p>
                <div className={`transition-all duration-300 delay-200 ${
                  !isChanging && currentIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <Button href="/pricing" white>
                    Get started
                  </Button>
                </div>
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
                        src={content.heroVideo?.url}
                        controls
                        muted
                        autoPlay
                        preload="none"
                        onLoadedData={() => setIsVideoLoading(false)}
                        playsInline
                        alt="Hero video"
                      />
                      <Generating className="absolute left-4 right-4 bottom-5 md:left-1/2 md:right-auto md:bottom-8 md:w-[31rem] md:-translate-x-1/2" />
                    </div>
                  </div>

                  <Gradient />
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
