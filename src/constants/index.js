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

import { cohere, langchain, openai, anthropic, aws, clay, lambda, snowflake, neo4j, alx, mc, sand } from "../assets/stack";


export const navigation = [
  {
    id: "0",
    title: "About",
    url: "/#about",
  },
  {
    id: "1",
    title: "Benefits",
    url: "/#benefits",
  },
  {
    id: "2",
    title: "Blog",
    url: "/#blog",
  },
  {
    id: "3",
    title: "Learning Hub",
    url: "https://edulga-ai-course-generator.vercel.app/",
  },
  {
    id: "4",
    title: "Contact",
    url: "/contact",
  },
  {
    id: "5",
    title: "Team",
    url: "/team",
  },
  {
    id: "5",
    title: "New account",
    url: "/#signup",
    onlyMobile: true,
  },
  {
    id: "6",
    title: "Sign in",
    url: "/#login",
    onlyMobile: true,
  },
];

export const heroIcons = [homeSmile, file02, searchMd, plusSquare];

export const notificationImages = [notification4, notification3, notification2];

// export const partnerLogos = [mastercard, sand, alx];

export const companyLogos = [cohere, langchain, openai, anthropic, aws, neo4j, lambda, mc, sand, alx];
export const backedBy = [alx, sand, mc]


export const brainwaveServicesIcons = [
  recording03,
  recording01,
  disc02,
  // chromecast,
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
    title: "Regenerative social educational platform designed to accelerate global development in education and human capital.",
    // text: collabText1,
  },
  {
    id: "1",
    title: "Connects educators, students, institutions, industry partners, and learning service providers through “The Brain”",
    // text: collabText2,
  },
  {
    id: "2",
    title: "An Instantaneously Updated Semantic Knowledge Web Powered by AI.",
    // text: collabText3,
  },
  // {
  //   id: "3",
  //   title: "Next-Gen and Recession-Proof",
  //   // text: collabText3,
  // },
  // {
  //   id: "4",
  //   title: "Scalable and Recession-Proof",
  //   // text: collabText3,
  // },
];

export const collabApps = [
  {
    id: "0",
    title: "alx",
    icon: alx,
    width: 26,
    height: 36,
    
  },
  {
    id: "1",
    title: "langchain",
    icon: langchain,
    width: 34,
    height: 36,
  },
  {
    id: "2",
    title: "anthropic",
    icon: anthropic,
    width: 36,
    height: 28,
  },
  {
    id: "3",
    title: "aws",
    icon: aws,
    width: 34,
    height: 35,
  },
  {
    id: "4",
    title: "lambda",
    icon: lambda,
    width: 34,
    height: 44,
  },
  {
    id: "5",
    title: "snowflake",
    icon: snowflake,
    width: 34,
    height: 34,
  },
  {
    id: "6",
    title: "openai",
    icon: openai,
    width: 26,
    height: 34,
  },
  {
    id: "7",
    title: "neo4j",
    icon: neo4j,
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
    title: "Human Knowledge Simulator",
    text: "AI-driven platform that continuously adapts and simulates personalized learning experiences by integrating real-time global knowledge, enabling learners to stay aligned with the latest advancements and industry standards.",
    backgroundUrl: "./src/assets/benefits/card-1.svg",
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
  },
  {
    id: "1",
    title: "Education Ecosystem Accelerator",
    text: "Bridging the gap between education and the rapidly evolving job market by connecting learners, educators, and industry expert and accelerating development, knowledge and skills",
    backgroundUrl: "./src/assets/benefits/card-2.svg",
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "2",
    title: "Knowledge as a Service",
    text: "Providing on-demand access to a vast, continuously updated repository of global educational content, empowering learners and institutions to customize learning experiences and stay current with the latest industry and academic advancements.",
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
  // {
  //   id: "0",
  //   title: "Discord",
  //   iconUrl: discordBlack,
  //   url: "#",
  // },
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
  {
    id: "4",
    title: "Edulga",
    iconUrl: facebook,
    url: "https://www.linkedin.com/company/edulga/",
  },
];



// Service Content
// constants.js
export const serviceContent = [
  {
    title: "Advance AI Data Engineering",
    title2: "Unstructured data Framework",
    subtitle: "Edulga's Unstructured Framework allows the real-time handling of preprocessing unstructured data, converting it into a structured format that is usable for learning purposes across Large Language Models. This includes parsing and extracting relevant data (e.g., key concepts, courses, videos, pdf's) from each document type and convert it into content that can be fed into Edulga's The Brain",
    // description: " By integrating the Unstructured Framework, embedding models, and LLM programming frameworks, Edulga can:",
    video: "/videos/unstructured-2.mp4", // Updated path
    useCases: [
      "Ingest and preprocess unstructured educational content (PDFs, HTML, presentations) using NLP to extract key concepts and knowledge.",
      "Automatically structure unstructured data and feed it into the Knowledge Graph, ensuring real-time content delivery based on student queries.",
      "Enable personalized and context-driven learning experiences by integrating processed data into Edulga’s adaptive LLM-powered learning pathways."
    ],
  },
  {
    title: "Edulga’s AI-Powered Agents: Enabling Personalized Learning at Scale",
    title2: " Optimize Learning Paths Through Real-Time Adaptation",
    subtitle: "Edulga integrates AI-powered agents into its learning platform to ensure that each student follows a learning path tailored to their progress, engagement, and knowledge gaps. These AI agents handle data gathering, performance analysis, and content retrieval, all while continuously refining the student’s path using intelligent feedback loops. With AI agents handling the complex task prioritization and resource management, Edulga provides an optimized, adaptive learning experience that scales globally.",
    // description: "Edulga's AI agents dynamically adapt and personalize the learning experience for each student, continuously improving outcomes based on real-time data.",
    video: "/videos/ai-agents.mp4", // some path
    useCases: [
      "Real-Time Path Adjustment and update learning paths in real time",
      "Prioritizing tasks based on difficulty, relevance, and student proficiency.",
      "Personalized Content Delivery based on each student’s unique needs"
    ],
  },
  
  {
    title: "Edulga's Knowledge Graph & RAG: Intelligent Learning Powered by Real-Time Contextual Retrieval",
    title2: "Personalized Learning Through AI-Powered Knowledge Graphs",
    subtitle:"Knowledge Graph & RAG architecture forms the core of its adaptive learning platform. Using intelligent agents to query vast databases of unstructured educational content, the system combines vector-based search and graph-based relationships to generate real-time, personalized learning experiences according to most relevant content, dynamically adjusted to their learning needs. This enables Edulga to continuously refine learning paths and deliver content that is both comprehensive and aligned with the learner's goals.",
    // description: "Edulga Knowledge Graph & RAG system is central to providing an adaptive and personalized learning experience. Through intelligent agent interactions, students receive contextually enriched content that is continuously updated to match their progress.",
    video: "/videos/graph-rag.mp4", // some path
    useCases: [
      "Adaptive Learning Path Updates that continuously updates the learner's content recommendations based on real-time performance",
      "Enhanced Understanding Through Conceptual Relationships that helps identify and recommend related topics or subjects by linking foundational concepts across multiple disciplines."

    ],
  }
  // {
  //   title: "Machine Learning ROI Dashboard",
  //   title2: "Return on Investment ",
  //   subtitle: "Efficiently Track and Analyze Marketing Data",
  //   description: "Machine Learning dashboard, built on Snowflake and visualized through Streamlit, transforms raw ad spend data into actionable insights to forecast future ROI resulting in 400%+ ROI.",
  //   video: "/videos/HH.mp4", // Updated path
  //   useCases: [
  //     "Seamless integration of marketing data sources into Snowflake",
  //     "Automated data cleansing and transformation for accurate analysis",
  //     "Efficient management of marketing data pipelines for real-time insights",
  //   ],
  // },
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