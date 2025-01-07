import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Section from '@/components/Section';
import { fadeIn } from '@/utils/motion';
import { teamService } from '@/services/teamService';

const AboutUs = () => {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      const data = await teamService.getTeamMembers();
      setTeamMembers(data || []);
    };

    fetchTeamMembers();
  }, []);

  return (
    <>
      <Helmet>
        <title>About Us | JediLabs - AI Innovation & Solutions</title>
        <meta 
          name="description" 
          content="Learn about JediLabs' mission to transform businesses through innovative AI solutions. Discover our story, values, and commitment to excellence."
        />
      </Helmet>

      {/* Hero Section */}
      <Section className="pt-[12rem] -mt-[5.25rem]">
        <div className="container relative">
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            animate="show"
            className="relative z-1 max-w-[50rem] mx-auto text-center mb-[3.75rem] md:mb-[6.25rem]"
          >
            <h1 className="h1 mb-6">
              Pioneering the Future of{' '}
              <span className="inline-block relative">
                AI Innovation
                <svg className="absolute left-0 right-0 bottom-0 -z-10" viewBox="0 0 100% 100%">
                  <circle className="stroke-n-1/10 dark:stroke-n-6" cx="50%" cy="50%" r="45%" pathLength="100" strokeDasharray="100" strokeDashoffset="0" fill="none" strokeWidth="0.5"/>
                </svg>
              </span>
            </h1>
            <p className="body-1 text-n-4 mb-6">
              At JediLabs, we're dedicated to transforming businesses through cutting-edge AI solutions. 
              Our mission is to make advanced AI technology accessible, practical, and impactful for enterprises of all sizes.
            </p>
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
              <h2 className="h2 mb-6">Our Vision</h2>
              <p className="body-2 text-n-4 mb-10">
                We envision a future where AI enhances every aspect of business operations, making them more efficient, 
                intelligent, and human-centric. Our goal is to be at the forefront of this transformation, 
                providing solutions that not only solve today's challenges but anticipate tomorrow's needs.
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-n-2 dark:bg-n-7">
                    <svg className="w-6 h-6 text-color-1" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="caption text-n-4">Innovation First</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-n-2 dark:bg-n-7">
                    <svg className="w-6 h-6 text-color-1" viewBox="0 0 24 24" fill="none">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="caption text-n-4">Client Success</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-n-2 dark:bg-n-7">
                    <svg className="w-6 h-6 text-color-1" viewBox="0 0 24 24" fill="none">
                      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="caption text-n-4">Expert Team</div>
                </div>
              </div>
            </div>
            <div className="relative aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-color-1/40 to-color-2/40 rounded-3xl -z-10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src="/images/about/vision.webp" 
                  alt="JediLabs Vision" 
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
            <h2 className="h2 mb-6">Our Core Values</h2>
            <p className="body-2 text-n-4">
              The principles that guide everything we do at JediLabs
            </p>
          </motion.div>
          
          <motion.div 
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                title: "Innovation",
                description: "Constantly pushing boundaries and exploring new possibilities in AI technology",
                icon: (
                  <svg className="w-8 h-8 text-color-1" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              },
              {
                title: "Excellence",
                description: "Delivering the highest quality solutions and exceeding client expectations",
                icon: (
                  <svg className="w-8 h-8 text-color-1" viewBox="0 0 24 24" fill="none">
                    <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              },
              {
                title: "Collaboration",
                description: "Working closely with clients to understand and solve their unique challenges",
                icon: (
                  <svg className="w-8 h-8 text-color-1" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              }
            ].map((value, index) => (
              <div 
                key={index}
                className="relative flex flex-col items-center text-center p-8 rounded-3xl bg-n-2 dark:bg-n-7"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-n-1 dark:bg-n-6 mb-6">
                  {value.icon}
                </div>
                <h3 className="h4 mb-4">{value.title}</h3>
                <p className="body-2 text-n-4">{value.description}</p>
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
            <h2 className="h2 mb-6">Our Leadership Team</h2>
            <p className="body-2 text-n-4">
              Meet the experts driving innovation and excellence at JediLabs
            </p>
          </motion.div>

          <motion.div 
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {teamMembers.map((member) => (
              <Link 
                key={member.id}
                to={`/team/${member.slug}`}
                className="relative overflow-hidden rounded-3xl bg-n-2 dark:bg-n-7 hover:bg-n-3 dark:hover:bg-n-6 transition-colors group"
              >
                <div className="aspect-[4/3]">
                  <img 
                    src={member.image?.url} 
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="h4 mb-1">{member.name}</h3>
                  <p className="caption text-n-4">{member.role}</p>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      </Section>
    </>
  );
};

export default AboutUs; 