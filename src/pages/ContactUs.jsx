import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Section from '@/components/Section';
import Contact from '@/components/Contact';
import { fadeIn } from '@/utils/motion';

const ContactUs = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us | JediLabs - Let's Build Something Amazing</title>
        <meta 
          name="description" 
          content="Get in touch with JediLabs to discuss your AI and security needs. Let's work together to build innovative, secure solutions for your business."
        />
      </Helmet>

      {/* Hero Section */}
      <Section className="pt-[12rem] -mt-[5.25rem]">
        <div className="container">
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            animate="show"
            className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.75rem]"
          >
            <h1 className="h1 mb-6">
              Let's Build Something{' '}
              <span className="inline-block relative">
                Amazing Together
                <svg className="absolute left-0 right-0 bottom-0 -z-10" viewBox="0 0 100% 100%">
                  <circle className="stroke-n-1/10 dark:stroke-n-6" cx="50%" cy="50%" r="45%" pathLength="100" strokeDasharray="100" strokeDashoffset="0" fill="none" strokeWidth="0.5"/>
                </svg>
              </span>
            </h1>
            <p className="body-1 text-n-4 mb-6">
              Whether you're looking to implement AI solutions, enhance security, or discuss a custom project,
              we're here to help turn your vision into reality.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Contact Form Section */}
      <Section>
        <div className="container">
          <Contact />
        </div>
      </Section>

      {/* Office Locations */}
      <Section>
        <div className="container">
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative z-1 max-w-[50rem] mx-auto text-center mb-[3.75rem]"
          >
            <h2 className="h2 mb-6">Our Office</h2>
            <p className="body-2 text-n-4">
              Visit us when in New York 
            </p>
          </motion.div>
          
          <motion.div 
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {/* <div className="relative flex flex-col items-center text-center p-8 rounded-3xl bg-n-2 dark:bg-n-7">
              <h3 className="h4 mb-4">San Francisco</h3>
              <p className="body-2 text-n-4 mb-6">
                100 Pine Street, Suite 1250<br />
                San Francisco, CA 94111
              </p>
              <div className="space-y-3">
                <p className="text-sm text-n-4">+1 (415) 555-0123</p>
                <p className="text-sm text-n-4">sf@jedilabs.ai</p>
              </div>
            </div> */}

            <div className="relative flex flex-col items-center text-center p-8 rounded-3xl bg-n-2 dark:bg-n-7">
              <h3 className="h4 mb-4">New York</h3>
              <p className="body-2 text-n-4 mb-6">
                Brooklyn, NY<br />
                &nbsp;
              </p>
              <div className="space-y-3">
                {/* <p className="text-sm text-n-4">+1 (212) 555-0123</p> */}
                <p className="text-sm text-n-4">jedi@jedilabs.org</p>
              </div>
            </div>

            {/* <div className="relative flex flex-col items-center text-center p-8 rounded-3xl bg-n-2 dark:bg-n-7">
              <h3 className="h4 mb-4">London</h3>
              <p className="body-2 text-n-4 mb-6">
                Coming Soon<br />
                &nbsp;
              </p>
              <div className="space-y-3">
                <p className="text-sm text-n-4">+44 20 7123 4567</p>
                <p className="text-sm text-n-4">london@jedilabs.ai</p>
              </div>
            </div> */}
          </motion.div>
        </div>
      </Section>

      
    </>
  );
};

export default ContactUs; 