import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';
import { authorService } from '@/services/authorService';
import { RichText } from '@graphcms/rich-text-react-renderer';

const Author = () => {
  const { slug } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const data = await authorService.getAuthorDetails(slug);
        setAuthor(data);
      } catch (err) {
        setError('Failed to load author data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [slug]);

  if (loading) {
    return (
      <Section className="text-center">
        <div className="animate-pulse">Loading...</div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section className="text-center">
        <div className="text-red-500">{error}</div>
      </Section>
    );
  }

  if (!author) {
    return (
      <Section className="text-center">
        <div className="text-red-500">Author not found</div>
      </Section>
    );
  }

  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'MMM yyyy');
  };

  return (
    <Section className="overflow-hidden">
      <div className="container">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          {author.photo && (
            <img
              src={author.photo.url}
              alt={author.name}
              className="w-48 h-48 rounded-full mx-auto mb-8 object-cover"
            />
          )}
          <h1 className="h1 mb-4">{author.name}</h1>
          <p className="text-primary-1 text-xl mb-8">{author.title}</p>
          <div className="body-1 text-n-3 max-w-3xl mx-auto mb-8">
            {author.bio}
          </div>
          {author.socialLinks && (
            <div className="flex justify-center gap-6">
              {author.socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-n-3 hover:text-primary-1 transition-colors"
                >
                  <Icon name={link.platform.toLowerCase()} className="w-6 h-6" />
                </a>
              ))}
            </div>
          )}
        </motion.div>

        {/* Work Experience Timeline */}
        {author.workExperience && (
          <div className="mb-20">
            <h2 className="h2 text-center mb-10">Work Experience</h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-n-6" />
              
              {author.workExperience.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-start mb-16 ${
                    index % 2 === 0 ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className="w-1/2 px-8">
                    <div className="bg-n-7 rounded-2xl p-6">
                      <div className="flex items-center gap-4 mb-4">
                        {experience.companyLogo && (
                          <img
                            src={experience.companyLogo.url}
                            alt={experience.companyName}
                            className="w-12 h-12 rounded-lg object-contain bg-white p-2"
                          />
                        )}
                        <div>
                          <h3 className="h4 mb-1">{experience.position}</h3>
                          <p className="text-primary-1">{experience.companyName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-n-3 mb-4">
                        <span>{formatDate(experience.startDate)} - {experience.isCurrentRole ? 'Present' : formatDate(experience.endDate)}</span>
                        {experience.location && (
                          <>
                            <span>•</span>
                            <span>{experience.location}</span>
                          </>
                        )}
                      </div>
                      {experience.description && (
                        <div className="text-n-3 mb-4">
                          {experience.description}
                        </div>
                      )}
                      {experience.achievements && (
                        <div className="space-y-2">
                          {experience.achievements.split('\n').map((achievement, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-n-3">
                              <Icon name="check" className="w-5 h-5 text-primary-1 mt-1" />
                              <span>{achievement}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {experience.technologies && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {experience.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-full bg-n-6 text-n-1 text-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-primary-1 rounded-full relative z-10 mt-8" />
                  <div className="w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Section */}
        {author.skills && (
          <div className="mb-20">
            <h2 className="h2 text-center mb-10">Skills & Expertise</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {author.skills.map((skillCategory, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-n-7 rounded-2xl p-6"
                >
                  <h3 className="h4 mb-4">{skillCategory.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillCategory.items.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-n-6 text-n-1 text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {author.education && (
          <div className="mb-20">
            <h2 className="h2 text-center mb-10">Education</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {author.education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-n-7 rounded-2xl p-6"
                >
                  <h3 className="h4 mb-2">{edu.institution}</h3>
                  <p className="text-primary-1 mb-2">{edu.degree}</p>
                  {edu.field && <p className="text-n-3 mb-2">{edu.field}</p>}
                  {edu.graduationYear && (
                    <p className="text-n-4">Class of {edu.graduationYear}</p>
                  )}
                  {edu.description && (
                    <p className="text-n-3 mt-4">{edu.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {author.certifications && (
          <div className="mb-20">
            <h2 className="h2 text-center mb-10">Certifications</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {author.certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-n-7 rounded-2xl p-6"
                >
                  <h3 className="h4 mb-2">{cert.name}</h3>
                  <p className="text-primary-1 mb-2">{cert.issuingOrganization}</p>
                  <div className="text-n-3 mb-4">
                    <p>Issued: {formatDate(cert.issueDate)}</p>
                    {cert.expiryDate && (
                      <p>Expires: {formatDate(cert.expiryDate)}</p>
                    )}
                  </div>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary-1 hover:text-primary-2 transition-colors"
                    >
                      <span>View Credential</span>
                      <Icon name="arrow-right" className="w-4 h-4" />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Posts */}
        {author.posts && author.posts.length > 0 && (
          <div className="mb-20">
            <h2 className="h2 text-center mb-10">Recent Posts</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {author.posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-n-7 rounded-2xl overflow-hidden"
                >
                  {post.coverImage && (
                    <img
                      src={post.coverImage.url}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="h4 mb-2">{post.title}</h3>
                    <p className="text-n-3 mb-4">{post.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-n-4">
                        {format(new Date(post.publishedAt), 'MMM d, yyyy')}
                      </span>
                      <a
                        href={`/blog/${post.slug}`}
                        className="text-primary-1 hover:text-primary-2 transition-colors"
                      >
                        Read More
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
};

export default Author; 