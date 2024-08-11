import React from "react";
import Slider from "react-slick";
import { check } from "../assets";
import { pricing } from "../constants";
import Button from "./Button";

const PricingList = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024, // 1024px and below
        settings: {
          slidesToShow: 1, // 1 slide at a time for mobile
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
    ],
  };

  return (
    <>
      {/* Slider for mobile */}
      <div className="block lg:hidden">
        <Slider {...settings}>
          {pricing.map((item) => (
            <div key={item.id} className="p-4">
              <div className="w-full h-full px-6 bg-n-8 border border-n-6 rounded-[2rem] py-8">
                <h4 className="h4 mb-4">{item.title}</h4>
                <p className="body-2 min-h-[4rem] mb-3 text-n-1/50">
                  {item.description}
                </p>
                <div className="flex items-center h-[5.5rem] mb-6">
                  {item.price && (
                    <>
                      <div className="h3">$</div>
                      <div className="text-[2.5rem] leading-none font-bold">
                        {item.price}
                      </div>
                    </>
                  )}
                </div>
                <Button
                  className="w-full mb-6"
                  href={item.price ? "/pricing" : "mailto:contact@jsmastery.pro"}
                  white={!!item.price}
                >
                  {item.price ? "Get started" : "Contact us"}
                </Button>
                <ul>
                  {item.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start py-5 border-t border-n-6"
                    >
                      <img src={check} width={24} height={24} alt="Check" />
                      <p className="body-2 ml-4">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Static display for larger screens */}
      <div className="hidden lg:flex gap-[1rem]">
        {pricing.map((item) => (
          <div
            key={item.id}
            className="w-[19rem] h-full px-6 bg-n-8 border border-n-6 rounded-[2rem] even:py-14 odd:py-8 odd:my-4"
          >
            <h4 className="h4 mb-4">{item.title}</h4>
            <p className="body-2 min-h-[4rem] mb-3 text-n-1/50">
              {item.description}
            </p>
            <div className="flex items-center h-[5.5rem] mb-6">
              {item.price && (
                <>
                  <div className="h3">$</div>
                  <div className="text-[2.5rem] leading-none font-bold">
                    {item.price}
                  </div>
                </>
              )}
            </div>
            <Button
              className="w-full mb-6"
              href={item.price ? "/pricing" : "mailto:contact@jsmastery.pro"}
              white={!!item.price}
            >
              {item.price ? "Get started" : "Contact us"}
            </Button>
            <ul>
              {item.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start py-5 border-t border-n-6"
                >
                  <img src={check} width={24} height={24} alt="Check" />
                  <p className="body-2 ml-4">{feature}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};

export default PricingList;
