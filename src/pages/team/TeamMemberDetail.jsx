import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Section from '@/components/Section';
import { fadeIn } from '@/utils/motion';
import { teamService } from '@/services/teamService';
import InteractiveTimeline from '@/components/timeline/InteractiveTimeline';
import { Link } from 'react-router-dom';

// Helper function to group skills by category
const groupSkillsByCategory = (skills) => {
  const grouped = {};
  
  skills.forEach(skill => {
    if (!skill.category?.name) {
      grouped['Other'] = grouped['Other'] || [];
      grouped['Other'].push(skill);
      return;
    }

    const categoryName = skill.category.name;
    grouped[categoryName] = grouped[categoryName] || [];
    grouped[categoryName].push(skill);
  });

  return grouped;
};

const SkillsGroup = ({ skills }) => {
  const groupedSkills = groupSkillsByCategory(skills);
  
  return (
    <div className="mt-4 space-y-4">
      {Object.entries(groupedSkills).map(([category, skills]) => (
        <div key={category} className="space-y-2">
          <h4 className="text-sm font-semibold text-n-4">{category}</h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-n-2 dark:bg-n-7 hover:bg-n-3 dark:hover:bg-n-6 transition-colors cursor-help group relative"
                title={skill.description}
              >
                {skill.icon && (
                  <img 
                    src={skill.icon} 
                    alt={skill.name} 
                    className="w-4 h-4 object-contain"
                  />
                )}
                <span>{skill.name}</span>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-n-7 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {skill.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const parseExpertiseAreas = (bioHtml) => {
  if (!bioHtml) return [];

  // Find the section starting with "Core Areas of Expertise"
  const expertiseSection = bioHtml.split(/Core Areas of Expertise/)[1];
  if (!expertiseSection) return [];

  // Create a temporary DOM element to parse the HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(expertiseSection, 'text/html');
  
  // Find all list items
  const listItems = doc.querySelectorAll('li');
  
  return Array.from(listItems).map(li => {
    const strongTag = li.querySelector('strong');
    if (!strongTag) return null;

    // Get the title without colon
    const title = strongTag.textContent.trim().replace(/:\s*$/, '');
    
    // Get the text content after the strong tag
    const details = li.textContent
      .substring(li.textContent.indexOf(strongTag.textContent) + strongTag.textContent.length)
      .split(',')
      .map(detail => detail.trim())
      .filter(detail => detail.length > 0);

    return {
      title,
      details
    };
  }).filter(Boolean);
};

// Helper function to get appropriate icon based on expertise title
const getExpertiseIcon = (title) => {
  const icons = {
    'Full-Stack Development': (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    'Cloud Architecture & DevOps': (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    'Machine Learning & AI': (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    'Data Engineering & Analytics': (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    'Database Design & Management': (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3h-9C5.5 4 4 5 4 7z M8 7h8 M8 12h8 M8 17h8" />
      </svg>
    ),
    'API Development & Integration': (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    'Security & Compliance': (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    'SEO & Marketing Optimization': (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    'Product Management & Agile Methodologies': (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    )
  };

  return icons[title] || (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
};

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
        <title>{member.name} | JediLabs Leadership</title>
        <meta 
          name="description" 
          content={`Learn more about ${member.name}, ${member.role} at JediLabs. ${member.bio?.html?.replace(/<[^>]*>/g, '').substring(0, 150)}...`}
        />
      </Helmet>

      {/* Hero Section */}
      <Section className="pt-[8rem] -mt-[5.25rem]">
        <div className="container">
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            animate="show"
            className="relative grid gap-6 md:grid-cols-2 md:gap-12 items-start mb-12"
          >
            <div>
              {/* Profile Image */}
              <div className="relative aspect-[4/3] md:aspect-[3/4] mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-color-1/40 to-color-2/40 rounded-3xl -z-10" />
                <img 
                  src={member.image?.url} 
                  alt={member.name}
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="md:sticky md:top-[8rem]">
              <h1 className="h2 mb-3">{member.name}</h1>
              <p className="body-2 text-n-4 mb-4">{member.role}</p>
              
              {/* Social Links */}
              {member.socialLink && member.socialLink.length > 0 && (
                <div className="flex gap-4 mb-6">
                  {member.socialLink.map((social, index) => (
                    <a 
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 rounded-xl bg-n-2 dark:bg-n-7 hover:bg-n-3 dark:hover:bg-n-6 transition-colors"
                    >
                      {social.social === 'linkedIn' && (
                        <svg className="w-6 h-6 text-n-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      )}
                      {social.social === 'x' && (
                        <svg className="w-6 h-6 text-n-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      )}
                      {social.social === 'gitHub' && (
                        <svg className="w-6 h-6 text-n-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                        </svg>
                      )}
                    </a>
                  ))}
                </div>
              )}

              {/* Bio Section */}
              <div>
                <h2 className="h4 mb-4">About</h2>
                
                {/* Introduction */}
                <div className="space-y-4">
                  <div 
                    className="body-2 text-n-4 prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: member.bio?.html?.split(/Core Areas of Expertise/)[0]
                        .replace(/<p>/g, '<p class="mb-4 leading-relaxed">')
                    }}
                  />
                </div>

                {/* Quick Stats */}
                <div className="mt-8 pt-6 border-t border-n-3 dark:border-n-6">
                  <h3 className="h5 mb-4">Quick Overview</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-6 rounded-xl bg-n-1 dark:bg-n-6 text-center hover:bg-n-2 dark:hover:bg-n-5 transition-colors">
                      <div className="h3 mb-2 text-color-1">5+</div>
                      <div className="caption text-n-4">Years Experience</div>
                    </div>
                    <div className="p-6 rounded-xl bg-n-1 dark:bg-n-6 text-center hover:bg-n-2 dark:hover:bg-n-5 transition-colors">
                      <div className="h3 mb-2 text-color-1">40+</div>
                      <div className="caption text-n-4">Students Mentored</div>
                    </div>
                    <div className="p-6 rounded-xl bg-n-1 dark:bg-n-6 text-center hover:bg-n-2 dark:hover:bg-n-5 transition-colors">
                      <div className="h3 mb-2 text-color-1">3+</div>
                      <div className="caption text-n-4">AWS Certifications</div>
                    </div>
                    <div className="p-6 rounded-xl bg-n-1 dark:bg-n-6 text-center hover:bg-n-2 dark:hover:bg-n-5 transition-colors">
                      <div className="h3 mb-2 text-color-1">3+</div>
                      <div className="caption text-n-4">Successful Acquisitions</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Core Areas of Expertise - Full Width */}
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-12"
          >
            <h3 className="h3 mb-6">Core Areas of Expertise</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {parseExpertiseAreas(member.bio?.html).map((expertise, index) => (
                <div 
                  key={index}
                  className="group flex items-center gap-4 p-4 rounded-xl bg-n-1 dark:bg-n-6 hover:bg-n-2 dark:hover:bg-n-5 transition-all duration-200"
                >
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-color-1/10 text-color-1 group-hover:bg-color-1 group-hover:text-white transition-colors">
                    {getExpertiseIcon(expertise.title)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-base text-n-6 dark:text-n-1 truncate">
                      {expertise.title}
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {expertise.details.map((detail, i) => {
                        const tech = member.workExperience?.[0]?.skills?.find(
                          s => s.name?.toLowerCase() === detail.toLowerCase() || 
                               s.title?.toLowerCase() === detail.toLowerCase()
                        );
                        
                        if (!tech) return (
                          <span key={i} className="text-sm text-n-4">{detail}</span>
                        );

                        return (
                          <Link
                            key={i}
                            to={`/technology/${tech.slug || tech.name?.toLowerCase().replace(/\s+/g, '-')}`}
                            className="flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-n-2 dark:bg-n-7 hover:bg-color-1 hover:text-white transition-colors"
                          >
                            {tech.icon && (
                              <img 
                                src={tech.icon} 
                                alt={tech.name || tech.title} 
                                className="w-4 h-4 object-contain"
                              />
                            )}
                            <span>{detail}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Work Experience Timeline */}
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-12"
          >
            <h2 className="h3 mb-6">Work Experience</h2>
            {member.workExperience && (
              <InteractiveTimeline experiences={member.workExperience} />
            )}
          </motion.div>
        </div>
      </Section>

      {/* Additional Sections */}
      <Section className="pt-12">
        <div className="container">
          {/* Team Profile References (Blog Posts) */}
          {member.teamProfile?.length > 0 && (
            <motion.div
              variants={fadeIn('up')}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <h2 className="h3 mb-8">Recent Blogs</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {member.teamProfile.map((post, index) => (
                  <Link
                    key={index}
                    to={`/blog/post/${post.slug}`}
                    className="group block"
                  >
                    <motion.div 
                      className="relative overflow-hidden rounded-3xl bg-n-2 dark:bg-n-7"
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Post Image */}
                      <div className="aspect-[16/9] relative">
                        {post.featuredImage?.url ? (
                          <img 
                            src={post.featuredImage.url} 
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-color-1/40 to-color-2/40" />
                        )}
                        {/* Category Tags */}
                        {post.categories && post.categories.length > 0 && (
                          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                            {post.categories.map((category, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 text-xs font-medium text-white bg-n-1/10 backdrop-blur-sm rounded-full"
                              >
                                {category.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Post Info */}
                      <div className="p-6">
                        {post.createdAt && (
                          <div className="text-sm text-n-4 mb-3">
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        )}
                        <h3 className="h4 mb-4 group-hover:text-color-1 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="body-2 text-n-4 mb-6 line-clamp-3">
                          {post.excerpt}
                        </p>
                        
                        {/* Read More Link */}
                        <div className="flex items-center gap-2 text-n-4 font-medium">
                          <span className="group-hover:text-color-1 transition-colors">Read More</span>
                          <svg 
                            className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:text-color-1" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Certifications */}
          {member.certification?.length > 0 && (
            <motion.div
              variants={fadeIn('up')}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mt-10 p-8 rounded-3xl bg-n-2 dark:bg-n-7"
            >
              <h2 className="h4 mb-6">Certifications</h2>
              <div className="grid gap-4">
                {member.certification.map((cert, index) => (
                  <a
                    key={index}
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 hover:bg-n-3 dark:hover:bg-n-6 p-2 rounded-xl transition-colors"
                  >
                    {cert.image?.url && (
                      <img 
                        src={cert.image.url} 
                        alt={cert.name} 
                        className="w-12 h-12 object-contain"
                      />
                    )}
                    <div>
                      <h3 className="body-2 font-semibold">{cert.name}</h3>
                      {cert.description?.raw && (
                        <p className="text-sm text-n-4">
                          {typeof cert.description.raw === 'string' 
                            ? JSON.parse(cert.description.raw).children[0].children[0].text
                            : cert.description.raw.children[0].children[0].text
                          }
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </Section>
    </>
  );
};

export default TeamMemberDetail; 