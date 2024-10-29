import {
  benefitIcon1,
  benefitIcon2,
  benefitIcon3,
  benefitIcon4,
  benefitImage2,
  chromecast,
  disc02,
  discord,
  discordBlack,
  facebook,
  figma,
  file02,
  framer,
  homeSmile,
  instagram,
  notification2,
  notification3,
  notification4,
  notion,
  photoshop,
  plusSquare,
  protopie,
  raindrop,
  recording01,
  recording03,
  roadmap1,
  roadmap2,
  roadmap3,
  roadmap4,
  searchMd,
  slack,
  sliders04,
  telegram,
  twitter,
  yourlogo,
} from "../assets";

import { cohere, langchain, openai, anthropic, aws, clay, lambda, snowflake } from "../assets/stack";


export const navigation = [
  {
    id: "0",
    title: "Features",
    url: "#features",
  },
  {
    id: "1",
    title: "Pricing",
    url: "#about",
  },
  {
    id: "2",
    title: "Work",
    url: "#how-to-use",
  },
  {
    id: "3",
    title: "Team",
    url: "#roadmap",
  },
  {
    id: "4",
    title: "New account",
    url: "#signup",
    onlyMobile: true,
  },
  {
    id: "5",
    title: "Sign in",
    url: "#login",
    onlyMobile: true,
  },
];

export const heroIcons = [homeSmile, file02, searchMd, plusSquare];

export const notificationImages = [notification4, notification3, notification2];

export const companyLogos = [cohere, langchain, openai, anthropic, aws, clay, lambda, snowflake];


export const brainwaveServicesIcons = [
  recording03,
  recording01,
  disc02,
  chromecast,
  // sliders04,
  // sliders04,
];

export const roadmap = [
  {
    id: "0",
    title: "AI for Healthcare ",
    text: "Enable the chatbot to understand and respond to voice commands, making it easier for users to interact with the app hands-free.",
    date: "May 2023",
    status: "done",
    imageUrl: roadmap1,
    colorful: true,
  },
  {
    id: "1",
    title: "Rise of AI Agents",
    text: "Add game-like elements, such as badges or leaderboards, to incentivize users to engage with the chatbot more frequently.",
    date: "May 2023",
    status: "progress",
    imageUrl: roadmap2,
  },
  {
    id: "2",
    title: "Realtime Answer Retrieval (RAG)",
    text: "Allow users to customize the chatbot's appearance and behavior, making it more engaging and fun to interact with.",
    date: "May 2023",
    status: "done",
    imageUrl: roadmap3,
  },
  {
    id: "3",
    title: "Knowledge as a Service (KaaS)",
    text: "Knowledge as a Service (KaaS) provides on-demand access to a comprehensive knowledge base tailored to your business needs. With KaaS, your organization can integrate expert insights, curated data, and advanced AI-driven knowledge systems to enhance decision-making, optimize workflows, and reduce operational costs. This service ensures that your team has immediate access to critical information, fostering continuous learning and innovation",
    date: "May 2023",
    status: "progress",
    imageUrl: roadmap4,
  },
  {
    id: "3",
    title: "Understanding Prompt Engineering",
    text: "Allow the chatbot to access external data sources, such as weather APIs or news APIs, to provide more relevant recommendations.",
    date: "May 2023",
    status: "progress",
    imageUrl: roadmap4,
  },
];

export const collabText1 =
  "We partner with entrepreneurs, executives, and businesses to transform innovative ideas into fully functional, scalable software solutions and have the expertise to bring your vision to life.";

export const collabText2 =
  "Offering full-stack development, seamless system integration, and cloud-based solutions, we provide everything you need to build, launch, and grow your business successfully.";

export const collabText3 =
  "Our solutions are built to withstand economic downturns, ensuring that your technology remains robust and adaptable, keeping your business resilient and competitive, even in challenging market conditions";

export const collabContent = [
  {
    id: "0",
    title: "From Idea to Reality",
    // text: collabText1,
  },
  // {
  //   id: "1",
  //   title: "Next Generation Technology Solutions",
  //   // text: collabText2,
  // },
  {
    id: "2",
    title: "Full-Stack Software Development",
    // text: collabText3,
  },
  {
    id: "3",
    title: "Next-Gen and Recession-Proof",
    // text: collabText3,
  },
  // {
  //   id: "4",
  //   title: "Scalable and Recession-Proof",
  //   // text: collabText3,
  // },
];

export const collabApps = [
  {
    id: "0",
    title: "Figma",
    icon: figma,
    width: 26,
    height: 36,
    
  },
  {
    id: "1",
    title: "Notion",
    icon: notion,
    width: 34,
    height: 36,
  },
  {
    id: "2",
    title: "Discord",
    icon: discord,
    width: 36,
    height: 28,
  },
  {
    id: "3",
    title: "Slack",
    icon: slack,
    width: 34,
    height: 35,
  },
  {
    id: "4",
    title: "Photoshop",
    icon: photoshop,
    width: 34,
    height: 34,
  },
  {
    id: "5",
    title: "Protopie",
    icon: protopie,
    width: 34,
    height: 34,
  },
  {
    id: "6",
    title: "Framer",
    icon: framer,
    width: 26,
    height: 34,
  },
  {
    id: "7",
    title: "Raindrop",
    icon: raindrop,
    width: 38,
    height: 32,
  },
  
];

export const pricing = [
  {
    id: "0",
    title: "Web Development",
    description: "Modern Websites, Advanced Features",
    price: "1000",
    features: [
      "Professional website development tailored to your business needs",
      "Responsive design with optimized performance",
      "Integration with essential tools (CMS, analytics, SEO)",
      "1-month post-launch support to resolve issues quickly",
    ],
  },
  {
    id: "1",
    title: "Full-Stack Transformation",
    description: "Web, AI, and Data Infrastructure",
    price: "3000",
    features: [
      "End-to-end web and backend development for dynamic apps",
      "AI-powered chatbots and analytics for enhanced user interaction",
      "Data pipeline integration and visualization tools for real-time insights",
      "Priority support for 3 months to ensure seamless functionality and adaptation",
    ],
  },
  {
    id: "2",
    title: "Next-Gen ML Transformation",
    description: "Vector DBs, Embeddings, Graph DBs, RAG Implementation",
    price: "5000",
    features: [
      "Custom implementation of vector databases for semantic search",
      "Advanced embeddings and graph databases for robust data relationships",
      "Graph-based RAG architecture for real-time, context-aware answers",
      "6-month dedicated support for fine-tuning and scaling the solution",
    ],
  },
  {
    id: "4",
    title: "Enterprise",
    description: "Vector DBs, Embeddings, Graph DBs, RAG Implementation",
    price: "5000",
    features: [
      "All the above & beyond",
    ],
  },
];


export const benefits = [
  {
    id: "0",
    title: "Context Aware Agents",
    text: "AI Agents that go beyond simple question-and-answer systems by adapting to ongoing conversations, personalizing interactions, and delivering highly relevant responses based on the user’s unique situation.",
    backgroundUrl: "./src/assets/benefits/card-1.svg",
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
  },
  {
    id: "1",
    title: "Realtime Answer Generation (RAG) ",
    text: "Realtime Answer Generation (RAG) empowers your business by providing instant access to up-to-date information directly from your data sources ",
    backgroundUrl: "./src/assets/benefits/card-2.svg",
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "2",
    title: "Knowledge as a Service (KaaS)",
    text: "Instant access to knowledge base tailored to your business needs with real-time information, curated data, and advanced AI-driven knowledge systems to enhance decision-making",
    backgroundUrl: "./src/assets/benefits/card-3.svg",
    iconUrl: benefitIcon3,
    imageUrl: benefitImage2,
  },
 
  // {
  //   id: "4",
  //   title: "Ask anything",
  //   text: "Lets users quickly find answers to their questions without having to search through multiple sources.",
  //   backgroundUrl: "./src/assets/benefits/card-5.svg",
  //   iconUrl: benefitIcon1,
  //   imageUrl: benefitImage2,
  // },
  // {
  //   id: "5",
  //   title: "Improve everyday",
  //   text: "The app uses natural language processing to understand user queries and provide accurate and relevant responses.",
  //   backgroundUrl: "./src/assets/benefits/card-6.svg",
  //   iconUrl: benefitIcon2,
  //   imageUrl: benefitImage2,
  // },
];

export const socials = [
  {
    id: "0",
    title: "Discord",
    iconUrl: discordBlack,
    url: "https://www.linkedin.com/company/jedilabs/",
  },
  // {
  //   id: "1",
  //   title: "Twitter",
  //   iconUrl: twitter,
  //   url: "#",
  // },
  // {
  //   id: "2",
  //   title: "Instagram",
  //   iconUrl: instagram,
  //   url: "#",
  // },
  // {
  //   id: "3",
  //   title: "Telegram",
  //   iconUrl: telegram,
  //   url: "#",
  // },
  // {
  //   id: "4",
  //   title: "Facebook",
  //   iconUrl: facebook,
  //   url: "#",
  // },
];



// Service Content
// constants.js
export const serviceContent = [
  {
    title: "AI-Powered X-Ray Analysis",
    title2: "Instant Pneumonia Diagnosis",
    subtitle: "Revolutionize X-Ray Diagnostics with AI",
    description: "Fast track the diagnosis of suspected pneumonia patients in just 30 seconds utilizing our AI-powered X-ray analysis platform.",
    video: "/videos/medical-ai.mp4", // Updated path
    useCases: [
      "Quick detection of pneumonia in emergency cases",
      "Assist radiologists with accurate diagnosis in less time",
      "Improve patient outcomes by reducing diagnostic delays",
    ],
  },
  {
    title: "Revenue and Expense Management Platform",
    title2: "Comprehensive Visualization and Financial Accuracy",
    subtitle: "Track and Analyze Your Revenue and Expenses",
    description: "Visualization to help make informed financial decisions to enhance financial accuracy and strategic planning with automated tracking",
    video: "/videos/analytics.mp4", // Updated path
    useCases: [
      "Track revenue and expenses across various departments",
      "Analyze profit and revenue to identify key financial trends",
      "Manage inventory and expenses with real-time data insights",
    ],
  },
  {
    title: "R&D Chat",
    title2: "Real-Time Answer Generation Chat",
    subtitle: "Continuous Data Updates for Real-Time Conversations",
    description: "Leverage Retrieval-Augmented Generation (RAG) and Natural Language Processing to revolutionize user engagement with real-time interactions.",
    video: "/videos/rdChat.mp4", // Updated path
    useCases: [
      "Real-time user interaction in customer service chatbots",
      "Enhance customer engagement by providing accurate, up-to-date information",
    ],
  },
  {
    title: "Machine Learning ROI Dashboard",
    title2: "Return on Investment ",
    subtitle: "Efficiently Track and Analyze Marketing Data",
    description: "Machine Learning dashboard, built on Snowflake and visualized through Streamlit, transforms raw ad spend data into actionable insights to forecast future ROI resulting in 400%+ ROI.",
    video: "/videos/HH.mp4", // Updated path
    useCases: [
      "Seamless integration of marketing data sources into Snowflake",
      "Automated data cleansing and transformation for accurate analysis",
      "Efficient management of marketing data pipelines for real-time insights",
    ],
  },
];


export const brainwaveServices = [
  "Test",
  "Full-Stack Engineering",
  "Seamless Integration",
];




// Slider Settings
export const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};