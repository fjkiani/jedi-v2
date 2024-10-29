import { useState, useEffect } from "react";
import Slider from "react-slick";
import {check } from "../assets";
import { logo } from "../assets";
import { collabApps, collabContent } from "../constants";
import Button from "./Button";
import Section from "./Section";
import { LeftCurve, RightCurve } from "./design/Collaboration";
import { StarsCanvas} from "../components/canvas";
import BackedBy from "./BackedBy";



const Collaboration = () => {
  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    const revealItems = () => {
      collabContent.forEach((item, index) => {
        setTimeout(() => {
          setVisibleItems((prevItems) => [...prevItems, index]);
        }, index * 1000); // 1000ms delay between each item
      });
    };

    window.addEventListener("scroll", revealItems);

    return () => {
      window.removeEventListener("scroll", revealItems);
    };
  }, []);

  const settings = {
    dots: false, // Set to false to remove the dots
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024, // Apply slider for screens <= 1024px
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Section crosses id="about">
      <div className="container lg:flex">
        <div className="max-w-[25rem]">
          <h2 className="h2 mb-4 md:mb-8">What is Edulga?</h2>

          {/* Slider for mobile screens */}
          <div className="block lg:hidden">
            <Slider {...settings}>
              {collabContent.map((item, index) => (
                <div key={item.id} className="p-4">
                  <li
                    className={`mb-3 py-3 transition-opacity duration-500 ease-in-out ${
                      visibleItems.includes(index) ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <div className="flex items-center">
                      <img src={check} width={24} height={24} alt="check" />
                      <h6 className="body-2 ml-5">{item.title}</h6>
                    </div>
                    {item.text && (
                      <p className="body-2 mt-3 text-n-4">{item.text}</p>
                    )}
                  </li>
                </div>
              ))}
            </Slider>
          </div>

          {/* Static list for larger screens */}
          <ul className="hidden lg:block max-w-[22rem] mb-10 md:mb-14">
            {collabContent.map((item, index) => (
              <li
                key={item.id}
                className={`mb-3 py-3 transition-opacity duration-500 ease-in-out ${
                  visibleItems.includes(index) ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="flex items-center">
                  <img src={check} width={24} height={24} alt="check" />
                  <h6 className="body-2 ml-5">{item.title}</h6>
                </div>
                {item.text && (
                  <p className="body-2 mt-3 text-n-4">{item.text}</p>
                )}
              </li>
            ))}
          </ul>

          <Button href="#contact" white>
                  Try it now 
                </Button>

        </div>

        <div className="lg:ml-auto xl:w-[38rem] mt-4">
          <div className="relative left-1/2 flex w-[22rem] aspect-square border border-n-6 rounded-full -translate-x-1/2 scale:75 md:scale-100">
            {/* <div className="flex w-60 aspect-square m-auto border border-n-6 rounded-full"> */}
              <div className="w-[6rem] aspect-square m-auto p-[0.2rem] bg-conic-gradient rounded-full">
                <div className="flex items-center justify-center w-full h-full bg-n-8 rounded-full">
                  <img
                    src={logo}
                    width={48}
                    height={48}
                    alt="brainwave"
                  />
                </div>
              {/* </div> */}
            </div>

            <ul>
              {collabApps.map((app, index) => (
                <li
                  key={app.id}
                  className={`absolute top-0 left-1/2 h-1/2 -ml-[1.6rem] origin-bottom rotate-${
                    index * 45
                  }`}
                >
                  <div
                    className={`relative -top-[1.6rem] flex w-[3.2rem] h-[3.2rem] bg-n-7 border border-n-1/15 rounded-xl -rotate-${
                      index * 45
                    }`}
                  >
                    <img
                      className="m-auto"
                      width={app.width}
                      height={app.height}
                      alt={app.title}
                      src={app.icon}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <LeftCurve />
            <RightCurve />
          </div>
        </div>
      </div>
      <BackedBy className="hidden relative z-10 mt-20 lg:block" />

      <StarsCanvas/>
    </Section>
  );
};

export default Collaboration;


import { cohere, langchain, openai, anthropic, aws, clay, lambda, snowflake } from "../assets/stack";
