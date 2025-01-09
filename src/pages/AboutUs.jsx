import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import Section from '@/components/Section';
import { fadeIn } from '@/utils/motion';
import { aboutService } from '@/services/aboutService';
import { RichText } from '@graphcms/rich-text-react-renderer';
import { aboutContent } from '@/constants/about';
import AboutIcon from '@/components/icons/AboutIcon';
import { JEDIDiagramView } from '@/components/diagrams/JEDIDiagramView';
import { jediArchitecture } from '@/constants/solutions/jedi-architecture';
import { securityArchitecture } from '@/constants/solutions/security-architecture';
import { jediEmpower, jediVision } from '@/assets';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const aboutContent = await aboutService.getAboutPageData();
        setAboutData(aboutContent);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Helmet>
        <title>{aboutContent.meta.title}</title>
        <meta 
          name="description" 
          content={aboutContent.meta.description}
        />
      </Helmet>

      {/* Hero Section */}
      <Section className="pt-[12rem] -mt-[5.25rem]">
        <div className="container relative">
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            animate="show"
            className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.75rem] md:mb-[6.25rem]"
          >
            {/* Hero Image */}
            <motion.div
              variants={fadeIn('up')}
              initial="hidden"
              animate="show"
              className="mb-10"
            >
              <img 
                src={jediEmpower} 
                alt="JEDI Empowerment"
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </motion.div>

            <h1 className="h1 mb-6">
              {aboutContent.hero.title}{' '}
              <span className="inline-block relative">
                {aboutContent.hero.highlightText}
                <svg className="absolute left-0 right-0 bottom-0 -z-10" viewBox="0 0 100% 100%">
                  <circle className="stroke-n-1/10 dark:stroke-n-6" cx="50%" cy="50%" r="45%" pathLength="100" strokeDasharray="100" strokeDashoffset="0" fill="none" strokeWidth="0.5"/>
                </svg>
              </span>
            </h1>
            <p className="body-1 text-n-4 mb-6">
              {aboutContent.hero.description}
            </p>
            <div className="flex justify-center gap-8">
              {aboutContent.hero.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="h3 mb-2">{stat.value}</div>
                  <div className="caption text-n-4">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Vision Section */}
      <Section className="overflow-hidden">
        <div className="container">
          <motion.div 
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative grid gap-10 md:grid-cols-2 md:gap-16 items-center"
          >
            <div className="relative z-1">
              <h2 className="h2 mb-6">{aboutContent.vision.title}</h2>
              <p className="body-2 text-n-4 mb-10">
                {aboutContent.vision.description}
              </p>
              <div className="flex flex-wrap gap-6">
                {aboutContent.vision.highlights.map((highlight) => (
                  <div key={highlight.id} className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-n-2 dark:bg-n-7">
                      <AboutIcon 
                        path={highlight.icon.path}
                        viewBox={highlight.icon.viewBox}
                        className="w-6 h-6 text-color-1"
                      />
                    </div>
                    <div className="caption text-n-4">{highlight.text}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-color-1/40 to-color-2/40 rounded-3xl -z-10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src={jediVision}
                  alt="JEDI Vision"
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Values Section */}
      <Section>
        <div className="container">
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative z-1 max-w-[50rem] mx-auto text-center mb-[3.75rem]"
          >
            <h2 className="h2 mb-6">{aboutContent.values.title}</h2>
            <p className="body-2 text-n-4">
              {aboutContent.values.subtitle}
            </p>
          </motion.div>
          
          <motion.div 
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {aboutContent.values.items.map((value, index) => (
              <div 
                key={index}
                className="relative flex flex-col items-center text-center p-8 rounded-3xl bg-n-2 dark:bg-n-7"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-n-1 dark:bg-n-6 mb-6">
                  <AboutIcon 
                    path={value.icon.path}
                    viewBox={value.icon.viewBox}
                    className="w-8 h-8 text-color-1"
                  />
                </div>
                <h3 className="h4 mb-4">{value.title}</h3>
                <p className="body-2 text-n-4">{value.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* JEDI Architecture Section */}
      <Section className="overflow-hidden">
        <div className="container">
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative z-1 max-w-[50rem] mx-auto text-center mb-[3.75rem]"
          >
            {/* <h2 className="h2 mb-6">{jediArchitecture.title}</h2>
            <p className="body-2 text-n-4">
              {jediArchitecture.description}
            </p> */}
          </motion.div>
          
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <JEDIDiagramView diagram={jediArchitecture} />
          </motion.div>
        </div>
      </Section>

      {/* Security Architecture Section */}
      <Section className="overflow-hidden">
        <div className="container">
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative z-1 max-w-[50rem] mx-auto text-center mb-[3.75rem]"
          >
            {/* <h2 className="h2 mb-6">{securityArchitecture.title}</h2>
            <p className="body-2 text-n-4">
              {securityArchitecture.description}
            </p> */}
          </motion.div>
          
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <JEDIDiagramView diagram={securityArchitecture} />
          </motion.div>
        </div>
      </Section>

      {/* Expertise Section */}
      <Section>
        <div className="container">
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative z-1 max-w-[50rem] mx-auto text-center mb-[3.75rem]"
          >
            <h2 className="h2 mb-6">{aboutContent.expertise.title}</h2>
            <p className="body-2 text-n-4">
              {aboutContent.expertise.subtitle}
            </p>
          </motion.div>
          
          <motion.div 
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {aboutContent.expertise.areas.map((area, index) => (
              <div 
                key={index}
                className="relative flex flex-col items-center text-center p-8 rounded-3xl bg-n-2 dark:bg-n-7"
              >
                <h3 className="h4 mb-4">{area.title}</h3>
                <p className="body-2 text-n-4 mb-6">{area.description}</p>
                <div className="space-y-3">
                  {area.features.map((feature, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-2 text-sm text-n-4"
                    >
                      <AboutIcon 
                        path="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                        viewBox="0 0 24 24"
                        className="w-5 h-5 text-color-1"
                      />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Team Section */}
      <Section className="overflow-hidden">
        <div className="container">
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative z-1 max-w-[50rem] mx-auto text-center mb-[3.75rem]"
          >
            <h2 className="h2 mb-6">{aboutContent.team.title}</h2>
            <p className="body-2 text-n-4 mb-10">
              {aboutContent.team.subtitle}
            </p>
            <Link 
              to="/team"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-n-2 dark:bg-n-7 hover:bg-n-3 dark:hover:bg-n-6 transition-colors"
            >
              <AboutIcon 
                path="M17.754 14a2.249 2.249 0 0 1 2.25 2.249v.575c0 .894-.32 1.76-.902 2.438-1.57 1.834-4.098 2.986-6.852 2.986-2.754 0-5.282-1.152-6.851-2.986a3.595 3.595 0 0 1-.903-2.438v-.575A2.25 2.25 0 0 1 6.747 14h11.007ZM12.25 2.75a4.75 4.75 0 1 1 0 9.5 4.75 4.75 0 0 1 0-9.5Z"
                viewBox="0 0 24 24"
                className="w-5 h-5 text-color-1"
              />
              <span className="h5 text-color-1">Meet Our Team</span>
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* Dynamic Content from Hygraph */}
      {!loading && aboutData && aboutData.companyOverview && (
        <Section className="overflow-hidden">
          <div className="container">
            <motion.div
              variants={fadeIn('up')}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="h2 mb-6">{aboutData.companyOverview.title}</h2>
              {aboutData.companyOverview.description?.raw && (
                <div className="body-1 text-n-3 mb-8">
                  <RichText content={aboutData.companyOverview.description.raw} />
                </div>
              )}
              {aboutData.companyOverview.heroImage && (
                <img
                  src={aboutData.companyOverview.heroImage.url}
                  alt="Company Overview"
                  className="w-full rounded-2xl"
                />
              )}
            </motion.div>
          </div>
        </Section>
      )}
    </>
  );
};

export default AboutUs; 