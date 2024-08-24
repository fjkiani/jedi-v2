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
    url: "#pricing",
  },
  {
    id: "2",
    title: "How to use",
    url: "#how-to-use",
  },
  {
    id: "3",
    title: "Roadmap",
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

export const brainwaveServices = [
  "AI-Driven Development",
  "Full-Stack Engineering",
  "Seamless Integration",
];

export const brainwaveServicesIcons = [
  recording03,
  recording01,
  disc02,
  chromecast,
  sliders04,
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
    text: collabText1,
  },
  {
    id: "1",
    title: "Comprehensive Development Services",
    text: collabText2,
  },
  {
    id: "2",
    title: "Scalable and Recession-Proof",
    text: collabText3,
  },
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
    title: "Consultation",
    description: "AI chatbot, personalized recommendations",
    price: "300",
    features: [
      "An AI chatbot that can understand your queries",
      "Personalized recommendations based on your preferences",
      "Ability to explore the app and its features without any cost",
    ],
  },
  {
    id: "1",
    title: "Web Transformation",
    description: "Advanced AI chatbot, priority support, analytics dashboard",
    price: "500 ",
    features: [
      "An advanced AI chatbot that can understand complex queries",
      "An analytics dashboard to track your conversations",
      "Priority support to solve issues quickly",
    ],
  },
  {
    id: "2",
    title: "Enterprise",
    description: "Custom AI chatbot, advanced analytics, dedicated account",
    price: null,
    features: [
      "An AI chatbot that can understand your queries",
      "Personalized recommendations based on your preferences",
      "Ability to explore the app and its features without any cost",
    ],
  },
  {
    id: "3",
    title: "Enterprise",
    description: "Custom AI chatbot, advanced analytics, dedicated account",
    price: null,
    features: [
      "An AI chatbot that can understand your queries",
      "Personalized recommendations based on your preferences",
      "Ability to explore the app and its features without any cost",
    ],
  },
];

export const benefits = [
  {
    id: "0",
    title: "Context Aware Agents",
    text: "Context Aware Agents are AI-driven systems designed to understand and respond to user queries with a deep awareness of context and history. These agents go beyond simple question-and-answer systems by adapting to ongoing conversations, personalizing interactions, and delivering highly relevant responses based on the user’s unique situation.",
    backgroundUrl: "./src/assets/benefits/card-1.svg",
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
  },
  {
    id: "1",
    title: "Realtime Answer Generation (RAG) ",
    text: "Realtime Answer Generation (RAG) empowers your business by providing instant access to up-to-date information directly from your data sources. Unlike traditional systems that rely on pre-trained models, RAG dynamically retrieves answers from live data, ensuring that your team or customers always have the latest and most accurate insights. ",
    backgroundUrl: "./src/assets/benefits/card-2.svg",
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "2",
    title: "Knowledge as a Service (KaaS)",
    text: "Knowledge as a Service (KaaS) provides on-demand access to a comprehensive knowledge base tailored to your business needs with real-time information, curated data, and advanced AI-driven knowledge systems to enhance decision-making and optimize workflows",
    backgroundUrl: "./src/assets/benefits/card-3.svg",
    iconUrl: benefitIcon3,
    imageUrl: benefitImage2,
  },
  // {
  //   id: "3",
  //   title: "Fast responding",
  //   text: "Lets users quickly find answers to their questions without having to search through multiple sources.",
  //   backgroundUrl: "./src/assets/benefits/card-4.svg",
  //   iconUrl: benefitIcon4,
  //   imageUrl: benefitImage2,
  //   light: true,
  // },
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
    url: "#",
  },
  {
    id: "1",
    title: "Twitter",
    iconUrl: twitter,
    url: "#",
  },
  {
    id: "2",
    title: "Instagram",
    iconUrl: instagram,
    url: "#",
  },
  {
    id: "3",
    title: "Telegram",
    iconUrl: telegram,
    url: "#",
  },
  {
    id: "4",
    title: "Facebook",
    iconUrl: facebook,
    url: "#",
  },
];



// Service Content
export const serviceContent = [
  {
    title: "Generative AI",
    subtitle: "Enhance your photos effortlessly",
    description: "Automatically enhance your photos using our AI app's photo editing feature. Try it now!",
    video: "src/assets/videos/medical-ai.mp4",
  },
  {
    title: "AI Agents",
    subtitle: "Create stunning visuals with ease",
    description: "The world’s most powerful AI photo and video art generation engine. What will you create?",
    video: "src/assets/videos/analytics.mp4",
  },
  {
    title: "Knowledge Base",
    subtitle: "Professional-grade audio enhancement",
    description: "Process and enhance audio files with our advanced AI-driven tools for clear and professional results.",
    video: "src/assets/videos/rdChat.mp4",
  },
  {
    title: "Knowledge Base",
    subtitle: "Professional-grade audio enhancement",
    description: "Process and enhance audio files with our advanced AI-driven tools for clear and professional results.",
    video: "src/assets/videos/HH.mp4",
  },
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