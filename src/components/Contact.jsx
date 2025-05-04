import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import styles from '@/styles';
// import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "@/hoc";
import { slideIn } from "../utils/motion";
import { useTheme } from "@/context/ThemeContext";

// template_dlnkhpw
// service_pbft5vk
// uJYd4pcG3X27kg7z-

const Contact = () => {
  const formRef = useRef();
  const { isDarkMode } = useTheme();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        // import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        // import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        'service_pbft5vk',
        'template_dlnkhpw',
        {
          from_name: form.name,
          to_name: "FJK",
          from_email: form.email,
          to_email: "fjkiani1@gmail.com",
          message: form.message,
        },
        // import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
        'uJYd4pcG3X27kg7z-'
      )
      .then(
        () => {
          setLoading(false);
          alert("Thank you. Jedi Labs will get back to you as soon as possible.");

          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          setLoading(false);
          console.error(error);

          alert("Ahh, something went wrong. Please try again.");
        }
      );
  };

  return (
    <div
      className={`xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden`}
    >
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className={`flex-[0.75] ${isDarkMode ? 'bg-n-7' : 'bg-white'} p-8 rounded-2xl border ${isDarkMode ? 'border-n-6' : 'border-n-3'}`}
      >
        <h4 className={`h4 mb-6 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
          Send Us a Message
        </h4>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className='mt-12 flex flex-col gap-8'
        >
          <label className='flex flex-col'>
            <span className={`${isDarkMode ? 'text-n-1' : 'text-n-8'} font-medium mb-4`}>Your Name</span>
            <input
              type='text'
              name='name'
              value={form.name}
              onChange={handleChange}
              placeholder="What's your name?"
              className={`${isDarkMode ? 'bg-n-6' : 'bg-n-2'} py-4 px-6 
                ${isDarkMode ? 'placeholder:text-n-4' : 'placeholder:text-n-5'} 
                ${isDarkMode ? 'text-n-1' : 'text-n-8'} 
                rounded-lg outline-none border-none font-medium transition-colors duration-200
                focus:ring-2 focus:ring-primary-1`}
            />
          </label>
          <label className='flex flex-col'>
            <span className={`${isDarkMode ? 'text-n-1' : 'text-n-8'} font-medium mb-4`}>Your email</span>
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              placeholder="What's your email address?"
              className={`${isDarkMode ? 'bg-n-6' : 'bg-n-2'} py-4 px-6 
                ${isDarkMode ? 'placeholder:text-n-4' : 'placeholder:text-n-5'} 
                ${isDarkMode ? 'text-n-1' : 'text-n-8'} 
                rounded-lg outline-none border-none font-medium transition-colors duration-200
                focus:ring-2 focus:ring-primary-1`}
            />
          </label>
          <label className='flex flex-col'>
            <span className={`${isDarkMode ? 'text-n-1' : 'text-n-8'} font-medium mb-4`}>Your Message</span>
            <textarea
              rows={7}
              name='message'
              value={form.message}
              onChange={handleChange}
              placeholder='What you want to say?'
              className={`${isDarkMode ? 'bg-n-6' : 'bg-n-2'} py-4 px-6 
                ${isDarkMode ? 'placeholder:text-n-4' : 'placeholder:text-n-5'} 
                ${isDarkMode ? 'text-n-1' : 'text-n-8'} 
                rounded-lg outline-none border-none font-medium transition-colors duration-200
                focus:ring-2 focus:ring-primary-1 resize-none`}
            />
          </label>

          <button
            type='submit'
            className={`${isDarkMode ? 'bg-primary-1' : 'bg-n-8 text-white'} py-3 px-8 rounded-xl outline-none w-fit 
              font-bold shadow-md shadow-primary-1/20 
              transition-all duration-200 hover:scale-105 active:scale-95`}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className='xl:flex-1 xl:h-auto md:h-[550px] h-[350px] flex flex-col justify-center'
      >
        <div className={`${isDarkMode ? 'bg-n-7' : 'bg-n-1'} p-8 rounded-2xl border ${isDarkMode ? 'border-n-6' : 'border-n-3'} h-full flex flex-col justify-center`}>
          <h4 className={`h4 mb-6 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Other Ways to Reach Us</h4>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <svg className={`w-5 h-5 mt-1 flex-shrink-0 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <div>
                <p className={`font-medium ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>Email</p>
                <a href="mailto:info@jedilabs.ai" className={`text-sm hover:text-primary-1 transition-colors ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>jedi@jedilabs.org</a>
              </div>
            </div>

            {/* <div className="flex items-start gap-3">
              <svg className={`w-5 h-5 mt-1 flex-shrink-0 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <div>
                <p className={`font-medium ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>Phone</p>
                <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>+1 (555) 123-4567 (Placeholder)</p>
              </div>
            </div> */}

            <div className="flex items-start gap-3">
              <svg className={`w-5 h-5 mt-1 flex-shrink-0 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <div>
                <p className={`font-medium ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>HQ</p>
                <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>2 Blue Slip, Brooklyn, NY 11222</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
