import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import styles from '@/styles';
import { EarthCanvas } from "./canvas";
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
          alert("Thank you. I will get back to you as soon as possible.");

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
        <p className={`${isDarkMode ? 'text-n-1' : 'text-n-8'} text-lg font-medium mb-4`}>
          Would you like to 100x your business?
        </p>
        {/* <h3 className={styles.sectionHeadText}>Lets bring your idea to life.</h3> */}

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
              // placeholder="What's your good name?"
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
              // placeholder="What's your web address?"
              className={`${isDarkMode ? 'bg-n-6' : 'bg-n-2'} py-4 px-6 
                ${isDarkMode ? 'placeholder:text-n-4' : 'placeholder:text-n-5'} 
                ${isDarkMode ? 'text-n-1' : 'text-n-8'} 
                rounded-lg outline-none border-none font-medium transition-colors duration-200
                focus:ring-2 focus:ring-primary-1`}
            />
          </label>
          <label className='flex flex-col'>
            <span className={`${isDarkMode ? 'text-n-1' : 'text-n-8'} font-medium mb-4`}>What are you looking to solve?</span>
            <textarea
              rows={7}
              name='message'
              value={form.message}
              onChange={handleChange}
              // placeholder='What you want to say?'
              className={`${isDarkMode ? 'bg-n-6' : 'bg-n-2'} py-4 px-6 
                ${isDarkMode ? 'placeholder:text-n-4' : 'placeholder:text-n-5'} 
                ${isDarkMode ? 'text-n-1' : 'text-n-8'} 
                rounded-lg outline-none border-none font-medium transition-colors duration-200
                focus:ring-2 focus:ring-primary-1 resize-none`}
            />
          </label>

          <button
            type='submit'
            className={`${isDarkMode ? 'bg-primary-1' : 'bg-n-8'} py-3 px-8 rounded-xl outline-none w-fit 
              text-white font-bold shadow-md shadow-primary-1/20 
              transition-all duration-200 hover:scale-105 active:scale-95`}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className='xl:flex-1 xl:h-auto md:h-[550px] h-[350px]'
      >
        <EarthCanvas />
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
