import React from 'react';
import { motion } from 'framer-motion';
import Section from './Section';
import { Link } from 'react-router-dom';
import Arrow from '../assets/svg/Arrow';
import { fadeIn } from '@/utils/motion';

const caseStudies = [
  {
    company: 'Fortune 500 Retailer',
    industry: 'Retail & E-commerce',
    challenge: 'Struggling with slow customer service response times, low satisfaction rates, and inability to scale support during peak seasons without massive hiring.',
    solution: 'Implemented our AI-powered customer service transformation platform with intelligent routing, automated response generation, and predictive issue resolution.',
    results: [
      '45% reduction in response time across all customer touchpoints',
      '92% customer satisfaction rating - up from 67% pre-implementation',
      '$2.4M annual cost savings through automation of routine inquiries',
      '3x increase in customer service capacity without additional headcount',
      '78% reduction in escalations to human agents'
    ],
    testimonial: {
      quote: "JediLabs' AI-powered customer service solution completely transformed our support operations. We're now able to handle 10x the volume of inquiries with faster response times and significantly higher customer satisfaction. The ROI has been extraordinary - we've seen a 35% increase in customer retention directly attributable to improved service quality.",
      author: "Jennifer Williams",
      title: "Chief Customer Experience Officer"
    },
    image: '/images/case-studies/retail.jpg'
  },
  {
    company: 'FinTech Innovator',
    industry: 'Financial Services',
    challenge: 'Struggling with unsustainable customer acquisition costs, slow growth in a competitive market, and inability to effectively target high-value prospects.',
    solution: 'Implemented our AI-powered customer targeting and personalized engagement platform with predictive analytics, behavioral modeling, and automated campaign optimization.',
    results: [
      '120x increase in qualified leads through AI-powered targeting algorithms',
      '85% reduction in customer acquisition costs across all channels',
      '95% improvement in conversion rates for high-value customer segments',
      '$25M additional revenue generated in the first year post-implementation',
      '347% increase in marketing ROI compared to previous strategies'
    ],
    testimonial: {
      quote: "JediLabs transformed our entire approach to customer acquisition. Their AI solution helped us identify untapped market segments and optimize our sales process, resulting in exponential revenue growth. We're now acquiring customers at 1/6th the cost while simultaneously increasing their lifetime value by 3x. The impact on our business has been nothing short of transformational.",
      author: "Sarah Johnson",
      title: "Chief Marketing Officer"
    },
    image: '/images/case-studies/fintech.jpg'
  },
  {
    company: 'MedTech Leader',
    industry: 'Healthcare',
    challenge: 'Overwhelmed by administrative processes that consumed thousands of staff hours, created significant delays in patient care, and resulted in high error rates.',
    solution: 'Deployed our intelligent healthcare automation system with custom clinical workflows, predictive resource allocation, and AI-powered documentation.',
    results: [
      '98% reduction in processing time for patient documentation and insurance verification',
      '85x improvement in operational efficiency across all administrative functions',
      '99.9% accuracy in patient data management - eliminating costly errors',
      '$12M annual cost savings through intelligent process automation',
      '73% increase in patient satisfaction due to faster service delivery'
    ],
    testimonial: {
      quote: "We were drowning in administrative processes that took thousands of staff hours. JediLabs implemented an intelligent automation solution that reduced processing time by 98% while improving accuracy. The ROI has been incredible, but more importantly, our staff can now focus on patient care instead of paperwork. We've achieved in 6 months what would have taken 5 years with traditional approaches.",
      author: "Dr. Michael Chen",
      title: "Chief Operations Officer"
    },
    image: '/images/case-studies/healthcare.jpg'
  },
  {
    company: 'Global Manufacturer',
    industry: 'Manufacturing & Supply Chain',
    challenge: 'Inefficient supply chain with high costs, frequent disruptions, inability to predict demand fluctuations, and slow response to market changes.',
    solution: 'Implemented our predictive AI system for supply chain optimization with real-time monitoring, digital twin simulation, and autonomous decision-making capabilities.',
    results: [
      '75% reduction in supply chain disruptions through predictive risk management',
      '40x faster response to market changes and demand fluctuations',
      '60% decrease in inventory costs while maintaining 99.8% fulfillment rates',
      '150x ROI on technology investment within the first 18 months',
      '83% improvement in forecast accuracy across all product categories'
    ],
    testimonial: {
      quote: "JediLabs' predictive AI system revolutionized our supply chain. We can now anticipate disruptions before they happen and optimize our operations in real-time. The impact on our bottom line has been transformative - we've reduced costs by millions while simultaneously improving service levels. Our supply chain has gone from a liability to a competitive advantage that's driving exponential growth across our business.",
      author: "Robert Martinez",
      title: "VP of Global Supply Chain"
    },
    image: '/images/case-studies/manufacturing.jpg'
  }
];

const CaseStudies = () => {
  return (
    <Section className="overflow-hidden">
      <div className="container">
        <motion.div
          variants={fadeIn('up')}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          <h2 className="h2 mb-4">100x Success Stories</h2>
          <p className="body-1 text-n-4 md:max-w-3xl mx-auto">
            See how we've helped businesses across industries achieve exponential growth
            through our transformative solutions and strategic approach.
          </p>
        </motion.div>

        <div className="space-y-20">
          {caseStudies.map((study, index) => (
            <motion.div
              key={index}
              variants={fadeIn('up')}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-12`}
            >
              <div className="lg:w-1/2">
                <div className="bg-n-7 rounded-2xl overflow-hidden h-full">
                  <div className="p-8 lg:p-10">
                    <div className="mb-6">
                      <span className="text-xs uppercase tracking-wider text-n-3 mb-2 block">
                        {study.industry}
                      </span>
                      <h3 className="h3 mb-2">{study.company}</h3>
                    </div>
                    
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-color-1 mb-2">The Challenge</h4>
                      <p className="body-2 text-n-3">{study.challenge}</p>
                    </div>
                    
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-color-1 mb-2">Our Solution</h4>
                      <p className="body-2 text-n-3">{study.solution}</p>
                    </div>
                    
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-color-1 mb-2">100x Results</h4>
                      <ul className="space-y-2">
                        {study.results.map((result, resultIndex) => (
                          <li key={resultIndex} className="flex items-start">
                            <svg 
                              className="w-5 h-5 text-color-1 mr-3 flex-shrink-0 mt-1" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z M8 12L11 15L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="body-2">{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="p-6 bg-n-8 rounded-xl">
                      <p className="italic text-n-3 mb-4">"{study.testimonial.quote}"</p>
                      <div className="flex items-center">
                        <div>
                          <p className="font-semibold">{study.testimonial.author}</p>
                          <p className="text-sm text-n-4">{study.testimonial.title}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2 flex items-center justify-center">
                <div className="bg-n-7 rounded-2xl overflow-hidden w-full h-full">
                  <img 
                    src={study.image} 
                    alt={`${study.company} case study`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          variants={fadeIn('up')}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <a 
            href="/contact" 
            className="button button-primary button-lg"
          >
            Become Our Next Success Story
          </a>
        </motion.div>
      </div>
    </Section>
  );
};

export default CaseStudies; 