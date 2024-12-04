import { useState, useEffect } from "react";
import Slider from "react-slick";
import {check } from "../assets";
import { logo } from "../assets";
import { collabApps, collabContent } from "../constants";
import Button from "./Button";
import Section from "./Section";
import { LeftCurve, RightCurve } from "./design/Collaboration";
import { StarsCanvas} from "../components/canvas";


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
    <Section crosses>
      <div className="container lg:flex">
        <div className="max-w-[25rem]">
          <h2 className="h2 mb-4 md:mb-8">You Imagine, We Engineer.</h2>

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

          <Button>Try it now</Button>
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

            {/* App icons with enhanced styling */}
            <ul>
              {collabApps.map((app, index) => (
                <li
                  key={app.id}
                  className={`absolute top-0 left-1/2 h-1/2 -ml-[2.4rem] origin-bottom rotate-${
                    index * 45
                  }`}
                >
                  <div
                    className={`relative -top-[2.4rem] flex w-[4.8rem] h-[4.8rem] 
                      bg-[#192230] border border-[#2A3B4A] rounded-xl 
                      backdrop-blur-sm transition-all duration-300
                      hover:scale-110 hover:bg-[#253545] 
                      hover:border-[#3A4B5A] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]
                      -rotate-${index * 45}`}
                  >
                    <div className="m-auto p-3 rounded-lg bg-[#253545] flex items-center justify-center
                      shadow-inner border border-[#3A4B5A]">
                      <img
                        className="w-[32px] h-[32px] object-contain 
                          filter brightness-150 contrast-150
                          drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                        alt={app.title}
                        src={app.icon}
                        style={{
                          filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.2))'
                        }}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <LeftCurve />
            <RightCurve />
          </div>
        </div>
      </div>

      <StarsCanvas/>
    </Section>
  );
};

export default Collaboration;
