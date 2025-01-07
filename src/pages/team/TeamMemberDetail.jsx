import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Section from '@/components/Section';
import { fadeIn } from '@/utils/motion';
import { teamService } from '@/services/teamService';

const TeamMemberDetail = () => {
  const { slug } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      const data = await teamService.getTeamMemberBySlug(slug);
      setMember(data);
      setLoading(false);
    };

    fetchMember();
  }, [slug]);

  if (loading) {
    return (
      <Section className="pt-[12rem]">
        <div className="container">
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-color-1 rounded-full animate-spin border-t-transparent"></div>
          </div>
        </div>
      </Section>
    );
  }

  if (!member) {
    return (
      <Section className="pt-[12rem]">
        <div className="container">
          <div className="text-center">
            <h1 className="h3 mb-4">Team Member Not Found</h1>
            <p className="body-2 text-n-4">The team member you're looking for doesn't exist.</p>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <>
      <Helmet>
        <title>{member.name} | JediLabs Team</title>
        <meta 
          name="description" 
          content={`Learn more about ${member.name}, ${member.role} at JediLabs. ${member.bio?.substring(0, 100)}...`}
        />
      </Helmet>

      {/* Hero Section */}
      <Section className="pt-[12rem] -mt-[5.25rem]">
        <div className="container">
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            animate="show"
            className="relative grid gap-10 md:grid-cols-2 md:gap-16 items-center"
          >
            {/* Profile Image */}
            <div className="relative aspect-[4/3] md:aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-color-1/40 to-color-2/40 rounded-3xl -z-10" />
              <img 
                src={member.image?.url} 
                alt={member.name}
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>

            {/* Profile Info */}
            <div>
              <h1 className="h2 mb-4">{member.name}</h1>
              <p className="body-2 text-n-4 mb-6">{member.role}</p>
              
              {/* Social Links */}
              <div className="flex gap-4 mb-8">
                {member.linkedinUrl && (
                  <a 
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-xl bg-n-2 dark:bg-n-7 hover:bg-n-3 dark:hover:bg-n-6 transition-colors"
                  >
                    <svg className="w-6 h-6 text-n-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}
                {member.twitterUrl && (
                  <a 
                    href={member.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-xl bg-n-2 dark:bg-n-7 hover:bg-n-3 dark:hover:bg-n-6 transition-colors"
                  >
                    <svg className="w-6 h-6 text-n-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                )}
                {member.githubUrl && (
                  <a 
                    href={member.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-xl bg-n-2 dark:bg-n-7 hover:bg-n-3 dark:hover:bg-n-6 transition-colors"
                  >
                    <svg className="w-6 h-6 text-n-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                  </a>
                )}
              </div>

              {/* Bio */}
              <div className="mb-8">
                <h2 className="h4 mb-4">About</h2>
                <p className="body-2 text-n-4">{member.bio}</p>
              </div>

              {/* Specialties */}
              {member.specialties?.length > 0 && (
                <div className="mb-8">
                  <h2 className="h4 mb-4">Specialties</h2>
                  <div className="flex flex-wrap gap-2">
                    {member.specialties.map((specialty, index) => (
                      <span 
                        key={index}
                        className="px-4 py-2 rounded-lg bg-n-2 dark:bg-n-7 text-n-4 caption"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Additional Sections */}
      <Section>
        <div className="container">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {/* Education */}
            {member.education?.length > 0 && (
              <motion.div
                variants={fadeIn('up')}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-n-2 dark:bg-n-7"
              >
                <h2 className="h4 mb-6">Education</h2>
                <div className="space-y-4">
                  {member.education.map((edu, index) => (
                    <div key={index}>
                      <h3 className="body-2 font-semibold">{edu.degree}</h3>
                      <p className="caption text-n-4">{edu.institution}</p>
                      <p className="caption text-n-4">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Achievements */}
            {member.achievements?.length > 0 && (
              <motion.div
                variants={fadeIn('up')}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-n-2 dark:bg-n-7"
              >
                <h2 className="h4 mb-6">Achievements</h2>
                <ul className="space-y-4">
                  {member.achievements.map((achievement, index) => (
                    <li key={index} className="body-2 text-n-4">
                      {achievement}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Publications */}
            {member.publications?.length > 0 && (
              <motion.div
                variants={fadeIn('up')}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-n-2 dark:bg-n-7"
              >
                <h2 className="h4 mb-6">Publications</h2>
                <div className="space-y-4">
                  {member.publications.map((pub, index) => (
                    <div key={index}>
                      <a 
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="body-2 text-color-1 hover:text-color-2 transition-colors"
                      >
                        {pub.title}
                      </a>
                      <p className="caption text-n-4">{pub.year}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </Section>

      {/* Featured Projects */}
      {member.featuredProjects?.length > 0 && (
        <Section>
          <div className="container">
            <motion.h2
              variants={fadeIn('up')}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="h3 mb-10 text-center"
            >
              Featured Projects
            </motion.h2>

            <motion.div
              variants={fadeIn('up')}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {member.featuredProjects.map((project, index) => (
                <div 
                  key={index}
                  className="relative overflow-hidden rounded-3xl bg-n-2 dark:bg-n-7"
                >
                  {project.imageUrl && (
                    <div className="aspect-video">
                      <img 
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="h4 mb-2">{project.title}</h3>
                    <p className="body-2 text-n-4 mb-4">{project.description}</p>
                    {project.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, techIndex) => (
                          <span 
                            key={techIndex}
                            className="px-3 py-1 rounded-lg bg-n-1 dark:bg-n-6 caption"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 rounded-lg bg-color-1 text-n-1 caption hover:bg-color-2 transition-colors"
                      >
                        View Project
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </Section>
      )}
    </>
  );
};

export default TeamMemberDetail; 