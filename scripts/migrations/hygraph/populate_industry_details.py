import os
import logging
import json
from dotenv import load_dotenv
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport
from graphql import GraphQLError

# --- Configuration ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
load_dotenv()

ENDPOINT = os.getenv("VITE_HYGRAPH_ENDPOINT")
TOKEN = os.getenv("VITE_HYGRAPH_TOKEN")

if not ENDPOINT or not TOKEN:
    logging.error("Hygraph configuration missing in .env file (VITE_HYGRAPH_ENDPOINT, VITE_HYGRAPH_TOKEN)")
    exit(1)

# --- GraphQL Client Setup ---
transport = RequestsHTTPTransport(
    url=ENDPOINT,
    headers={
        "Authorization": f"Bearer {TOKEN}",
        "gcms-stage": "DRAFT" # Mutate the DRAFT stage
    },
    verify=True,
    retries=3,
)
client = Client(transport=transport, fetch_schema_from_transport=False)

# --- Data to Populate ---
# Define the content for each industry here.
# Use the exact field names (API IDs) from your Hygraph schema.
# For Rich Text, use the 'raw' format.
# For JSON fields, provide valid JSON objects/arrays.
# For relations, provide the slugs of the items to connect.
INDUSTRY_DETAILS = {
    "education": {
        "description": "Leveraging AI to personalize learning experiences and streamline educational operations.",
        "fullDescription": { # Example Rich Text structure
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "Artificial intelligence is transforming the education sector by enabling personalized learning paths tailored to individual student needs."}]},
                    {"type": "paragraph", "children": [{"text": "AI tools can automate administrative tasks, freeing up educators to focus on teaching and mentorship."}]},
                    {"type": "paragraph", "children": [{"text": "Furthermore, AI-powered analytics provide valuable insights into student performance and engagement, helping institutions improve outcomes."}]}
                ]
            }
        },
        "benefits": [
            "Enhanced student engagement through personalized content.",
            "Improved accessibility for students with diverse learning needs.",
            "Automation of grading and administrative tasks.",
            "Data-driven insights for curriculum development and institutional improvement."
        ],
        "capabilities": [
            "Adaptive learning platforms that adjust difficulty in real-time.",
            "AI-powered tutoring systems offering instant feedback.",
            "Automated essay scoring and plagiarism detection.",
            "Predictive analytics for identifying at-risk students.",
            "Intelligent content recommendation engines."
        ],
        "keyFeaturesJson": [ # Example JSON array for features
            {"icon": "users", "title": "Personalized Learning Paths", "description": "AI algorithms analyze student data to create customized educational journeys."},
            {"icon": "zap", "title": "Automated Grading", "description": "Reduces teacher workload by automatically grading assignments and quizzes."},
            {"icon": "bar-chart-2", "title": "Performance Analytics", "description": "Provides deep insights into student progress and learning patterns."}
        ],
        "statisticsJson": [ # Example JSON array for stats
            {"value": "47%", "label": "Expected Growth in AI EdTech Market by 2027"},
            {"value": "30%", "label": "Increase in Student Engagement with AI Tutors"},
            {"value": "25%", "label": "Reduction in Teacher Admin Time"}
        ],
        "connectUseCaseSlugs": []
    },
    # --- Placeholder data for other industries ---
    "healthcare": {
        "description": "Utilizing AI for enhanced diagnostics, personalized treatment plans, and streamlined healthcare operations.",
        "fullDescription": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "AI is revolutionizing healthcare by enabling faster and more accurate disease diagnosis through advanced medical image analysis."}]},
                    {"type": "paragraph", "children": [{"text": "Personalized medicine becomes a reality as AI algorithms analyze patient data to predict treatment responses and tailor therapies."}]},
                    {"type": "paragraph", "children": [{"text": "Operational efficiency improves with AI automating administrative tasks, optimizing patient flow, and managing resources effectively."}]}
                ]
            }
        },
        "benefits": [
            "Improved diagnostic accuracy and speed.",
            "Development of personalized treatment plans.",
            "Accelerated drug discovery and development cycles.",
            "Enhanced operational efficiency and cost reduction.",
            "Increased accessibility to healthcare services."
        ],
        "capabilities": [
            "AI-powered medical image analysis (X-rays, CT scans, MRIs).",
            "Predictive diagnostics based on patient history and genetic data.",
            "Natural Language Processing for clinical documentation and research.",
            "Robotic process automation (RPA) for administrative tasks.",
            "AI-driven drug discovery and virtual screening platforms."
        ],
        "keyFeaturesJson": [
            {"icon": "activity", "title": "Enhanced Diagnostics", "description": "AI assists clinicians in interpreting medical images and identifying anomalies with higher precision."},
            {"icon": "target", "title": "Personalized Medicine", "description": "Tailoring treatment strategies based on individual patient profiles and predictive analytics."},
            {"icon": "settings", "title": "Operational Efficiency", "description": "Automating scheduling, billing, and record-keeping to optimize hospital workflows."}
        ],
        "statisticsJson": [
            {"value": "35%", "label": "Potential Annual Savings in US Healthcare by 2026 (Accenture)"},
            {"value": "50%", "label": "Reduction in Diagnostic Errors in specific imaging tasks"},
            {"value": "40%", "label": "Faster Drug Discovery Timelines possible with AI"}
        ],
        "connectUseCaseSlugs": []
    },
    "financial-services": {
        "description": "Enhancing security, customer experience, and operational efficiency in finance with AI.",
        "fullDescription": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "The financial services sector is rapidly adopting AI to combat sophisticated fraud, manage risk exposure, personalize customer interactions, and automate complex processes."}]},
                    {"type": "paragraph", "children": [{"text": "From algorithmic trading and portfolio management to AI-driven compliance and chatbots for customer support, AI enables financial institutions to operate more efficiently, securely, and customer-centrically."}]}
                ]
            }
        },
        "benefits": [
            "Enhanced fraud detection and prevention.",
            "Improved risk assessment and management.",
            "Personalized financial products and advisory services.",
            "Increased efficiency through process automation (e.g., loan processing).",
            "Algorithmic trading optimization.",
            "Improved customer service via AI chatbots and virtual assistants."
        ],
        "capabilities": [
            "AI-driven fraud detection systems.",
            "Credit risk scoring models.",
            "Algorithmic trading strategies.",
            "Robo-advisory platforms.",
            "Natural Language Processing for sentiment analysis and compliance checks.",
            "Customer churn prediction."
        ],
        "keyFeaturesJson": [
            {"icon": "shield", "title": "AI Fraud Prevention", "description": "Real-time detection of fraudulent transactions and activities."},
            {"icon": "trending-up", "title": "Algorithmic Trading", "description": "Optimize trading strategies using AI predictions and analysis."},
            {"icon": "users", "title": "Personalized Banking", "description": "Tailor financial advice and product offerings to individual customers."}
        ],
        "statisticsJson": [
            {"value": "$1 Trillion+", "label": "Potential Value Add from AI in Global Banking Annually"},
            {"value": "Up to 70%", "label": "Reduction in False Positives for Fraud Alerts"},
            {"value": "20-30%", "label": "Operational Cost Savings from AI Automation"}
        ],
        "connectUseCaseSlugs": [] # Add relevant use case slugs if any
    },
    "technology": {
        "description": "Accelerating innovation, optimizing operations, and enhancing user experiences in the tech industry with AI.",
        "fullDescription": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "AI is not just a product but a core enabling capability within the technology sector itself. It drives innovation in software development, infrastructure management, cybersecurity, and product features."}]},
                    {"type": "paragraph", "children": [{"text": "From AI-assisted coding and intelligent cloud resource allocation to advanced threat detection and personalized recommendation engines, AI helps tech companies build better products faster and operate more efficiently."}]}
                ]
            }
        },
        "benefits": [
            "Accelerated software development lifecycles.",
            "Improved code quality and bug detection.",
            "Enhanced cybersecurity posture and threat detection.",
            "Optimized cloud infrastructure and resource management.",
            "More personalized user experiences in apps and services.",
            "Automation of DevOps and IT operations tasks."
        ],
        "capabilities": [
            "AI-powered code generation and completion tools.",
            "Intelligent testing and quality assurance.",
            "AIOps for infrastructure monitoring and management.",
            "AI-driven cybersecurity threat analysis.",
            "Recommendation systems and personalization engines.",
            "Natural Language Processing for user interfaces and support."
        ],
        "keyFeaturesJson": [
            {"icon": "code", "title": "AI-Assisted Development", "description": "Boost developer productivity with AI code suggestions and analysis."},
            {"icon": "shield-check", "title": "Intelligent Cybersecurity", "description": "Proactively identify and respond to sophisticated security threats."},
            {"icon": "cloud", "title": "Optimized Cloud Ops", "description": "Automate resource management and performance tuning for cloud infrastructure."}
        ],
        "statisticsJson": [
            {"value": "30%", "label": "Increase in Developer Productivity reported with AI tools"},
            {"value": "60%", "label": "Faster Threat Detection Times using AI Security"},
            {"value": "15-25%", "label": "Reduction in Cloud Spend through AI Optimization"}
        ],
        "connectUseCaseSlugs": [] # Add relevant use case slugs if any
    },
    "retail": {
        "description": "Personalizing shopping experiences and optimizing operations with AI.",
        "fullDescription": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "AI is reshaping the retail landscape by enabling hyper-personalized customer experiences, optimizing supply chains, and improving inventory management."}]},
                    {"type": "paragraph", "children": [{"text": "From personalized product recommendations and dynamic pricing to demand forecasting and automated checkout systems, AI helps retailers enhance customer satisfaction, increase sales, and operate more efficiently."}]}
                ]
            }
        },
        "benefits": [
            "Hyper-personalized customer experiences and recommendations.",
            "Optimized inventory management and demand forecasting.",
            "Improved supply chain efficiency.",
            "Dynamic pricing strategies.",
            "Enhanced customer service through AI chatbots.",
            "Reduced shrinkage through AI-powered surveillance."
        ],
        "capabilities": [
            "Recommendation engines based on purchase history and browsing behavior.",
            "Demand forecasting models.",
            "AI-powered inventory optimization systems.",
            "Dynamic pricing algorithms.",
            "Customer sentiment analysis from reviews and social media.",
            "Computer vision for checkout automation and loss prevention."
        ],
        "keyFeaturesJson": [
            {"icon": "shopping-cart", "title": "Personalized Recommendations", "description": "Deliver tailored product suggestions to increase conversion rates."},
            {"icon": "package", "title": "Inventory Optimization", "description": "Use AI to predict demand and manage stock levels effectively."},
            {"icon": "dollar-sign", "title": "Dynamic Pricing", "description": "Adjust prices based on demand, competition, and inventory levels."}
        ],
        "statisticsJson": [
            {"value": "$100B+", "label": "Annual Value AI Could Unlock in Retail"},
            {"value": "10-15%", "label": "Increase in Sales Conversion from Personalization"},
            {"value": "5-10%", "label": "Reduction in Inventory Costs through AI"}
        ],
        "connectUseCaseSlugs": [] # Add relevant use case slugs if any
    },
    "manufacturing": {
        "description": "Optimizing production processes and enhancing quality control with AI.",
        "fullDescription": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "AI is revolutionizing manufacturing by enabling smarter factories, predictive maintenance, optimized supply chains, and enhanced quality control."}]},
                    {"type": "paragraph", "children": [{"text": "From optimizing robotic assembly lines and predicting equipment failures to using computer vision for defect detection and managing complex logistics, AI helps manufacturers increase throughput, reduce waste, and improve product quality."}]}
                ]
            }
        },
        "benefits": [
            "Increased production efficiency and throughput.",
            "Reduced equipment downtime through predictive maintenance.",
            "Improved product quality and defect detection rates.",
            "Optimized supply chain logistics and inventory management.",
            "Enhanced worker safety through automation and monitoring.",
            "Faster adaptation to changing market demands."
        ],
        "capabilities": [
            "Predictive maintenance for industrial machinery.",
            "AI-powered quality control using computer vision.",
            "Robotic process automation (RPA) for assembly lines.",
            "Supply chain optimization algorithms.",
            "Demand forecasting for production planning.",
            "Generative design for product development."
        ],
        "keyFeaturesJson": [
            {"icon": "tool", "title": "Predictive Maintenance", "description": "Anticipate equipment failures before they happen, minimizing downtime."},
            {"icon": "eye", "title": "AI Quality Control", "description": "Use computer vision to automatically detect defects on the production line."},
            {"icon": "settings", "title": "Process Optimization", "description": "Fine-tune production workflows for maximum efficiency and resource utilization."}
        ],
        "statisticsJson": [
            {"value": "10-20%", "label": "Reduction in Maintenance Costs with Predictive AI"},
            {"value": "Up to 90%", "label": "Improvement in Defect Detection Accuracy"},
            {"value": "5-15%", "label": "Increase in Overall Equipment Effectiveness (OEE)"}
        ],
        "connectUseCaseSlugs": [] # Add relevant use case slugs if any
    },
    "energy": {
        "description": "Optimizing energy generation, grid management, and resource exploration with AI.",
        "fullDescription": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "The energy sector is leveraging AI to enhance efficiency, reliability, and sustainability across the value chain, from resource discovery to power generation and distribution."}]},
                    {"type": "paragraph", "children": [{"text": "AI applications include optimizing renewable energy output, predicting grid demand and stability, automating infrastructure maintenance, and improving the accuracy of subsurface exploration for oil, gas, and geothermal resources."}]}
                ]
            }
        },
        "benefits": [
            "Improved efficiency of power generation (fossil fuels and renewables).",
            "Enhanced grid stability and optimized load balancing.",
            "Predictive maintenance for critical infrastructure (turbines, pipelines, transformers).",
            "More accurate forecasting of renewable energy generation (solar, wind).",
            "Optimized resource exploration and drilling operations.",
            "Improved energy trading and risk management."
        ],
        "capabilities": [
            "AI models for predicting renewable energy output.",
            "Smart grid management systems using AI.",
            "Predictive maintenance algorithms for energy infrastructure.",
            "AI-powered analysis of seismic and geological data for exploration.",
            "Optimization algorithms for energy dispatch and trading.",
            "Demand-side management using AI predictions."
        ],
        "keyFeaturesJson": [
            {"icon": "wind", "title": "Renewable Energy Forecasting", "description": "Optimize power generation from variable sources like wind and solar."},
            {"icon": "zap", "title": "Smart Grid Management", "description": "Enhance grid reliability and efficiency through AI-driven load balancing."},
            {"icon": "activity", "title": "Predictive Maintenance", "description": "Reduce downtime and maintenance costs for critical energy assets."}
        ],
        "statisticsJson": [
            {"value": "5-10%", "label": "Potential Improvement in Renewable Energy Output Prediction"},
            {"value": "15%", "label": "Reduction in Grid Operational Costs with AI Optimization"},
            {"value": "20%", "label": "Decrease in Unplanned Downtime via Predictive Maintenance"}
        ],
        "connectUseCaseSlugs": [] # Add relevant use case slugs if any
    },
    "media-entertainment": {
        "description": "Personalizing content delivery and automating production workflows with AI.",
        "fullDescription": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "AI is transforming media and entertainment by enabling hyper-personalized content recommendations, automating parts of the creative process, optimizing ad delivery, and providing deeper audience insights."}]},
                    {"type": "paragraph", "children": [{"text": "From AI-driven recommendation engines on streaming platforms and automated video editing/tagging to targeted advertising and sentiment analysis of audience feedback, AI helps creators and distributors engage audiences more effectively."}]}
                ]
            }
        },
        "benefits": [
            "Highly personalized content recommendations, increasing user engagement.",
            "Automation of tedious tasks in content creation (e.g., tagging, subtitling).",
            "Optimized advertising targeting and revenue generation.",
            "Deeper understanding of audience preferences and behavior.",
            "Enhanced content discovery for users.",
            "AI-powered tools for script analysis and generation."
        ],
        "capabilities": [
            "Content recommendation systems (Collaborative & Content-based filtering).",
            "AI-driven video and audio analysis (scene detection, transcription, tagging).",
            "Natural Language Processing for script analysis and audience sentiment.",
            "Predictive analytics for box office performance or viewership.",
            "Automated content summarization and generation.",
            "Targeted advertising platforms using AI audience segmentation."
        ],
        "keyFeaturesJson": [
            {"icon": "film", "title": "Personalized Content Hub", "description": "Engage users with AI-curated recommendations based on viewing habits."},
            {"icon": "edit-3", "title": "Automated Production Tools", "description": "Streamline post-production workflows with AI video analysis and tagging."},
            {"icon": "target", "title": "Smarter Ad Targeting", "description": "Maximize ad revenue by reaching the right audience segments with AI."}
        ],
        "statisticsJson": [
            {"value": "30%", "label": "Increase in User Engagement with Personalized Recommendations"},
            {"value": "25%", "label": "Reduction in Content Processing Time with AI Automation"},
            {"value": "15%", "label": "Improvement in Ad Click-Through Rates via AI Targeting"}
        ],
        "connectUseCaseSlugs": [] # Add relevant use case slugs if any
    },
    "telecommunications": {
        "description": "Optimizing network performance, enhancing customer service, and enabling new services with AI.",
        "fullDescription": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "AI is crucial for the telecommunications industry to manage increasingly complex networks, optimize spectrum usage, predict network faults, and personalize customer experiences."}]},
                    {"type": "paragraph", "children": [{"text": "Applications range from AI-driven network optimization and predictive maintenance for cell towers to intelligent customer service bots and fraud detection for billing systems."}]}
                ]
            }
        },
        "benefits": [
            "Improved network performance and reliability.",
            "Enhanced customer experience through personalized service and support.",
            "Predictive maintenance for network infrastructure, reducing outages.",
            "Optimized spectrum allocation and usage.",
            "Increased operational efficiency through automation.",
            "Faster deployment of new services like 5G and IoT."
        ],
        "capabilities": [
            "AI-powered network traffic analysis and optimization.",
            "Predictive maintenance models for network equipment.",
            "Intelligent chatbots and virtual assistants for customer support.",
            "AI-driven anomaly detection for network security.",
            "Customer churn prediction and prevention models.",
            "Automated network configuration and management (AIOps)."
        ],
        "keyFeaturesJson": [
            {"icon": "wifi", "title": "Network Optimization", "description": "Use AI to dynamically manage traffic and ensure optimal network performance."},
            {"icon": "message-circle", "title": "Intelligent Customer Care", "description": "Deploy AI chatbots to handle customer queries and improve service efficiency."},
            {"icon": "activity", "title": "Predictive Fault Management", "description": "Anticipate network issues before they impact customers."}
        ],
        "statisticsJson": [
            {"value": "10-20%", "label": "Improvement in Network Capacity Utilization"},
            {"value": "25%", "label": "Reduction in Customer Service Costs via AI Chatbots"},
            {"value": "Up to 30%", "label": "Decrease in Network Downtime with Predictive AI"}
        ],
        "connectUseCaseSlugs": [] # Add relevant use case slugs if any
    },
    "transportation-logistics": {
        "description": "Optimizing routes, predicting demand, and improving efficiency in transport and logistics.",
        "fullDescription": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "AI is streamlining the transportation and logistics sector by optimizing route planning, enhancing fleet management, predicting delivery times, and automating warehouse operations."}]},
                    {"type": "paragraph", "children": [{"text": "From AI-powered route optimization software that accounts for traffic and weather to predictive maintenance for vehicles and automated sorting systems in warehouses, AI increases efficiency, reduces costs, and improves delivery reliability."}]}
                ]
            }
        },
        "benefits": [
            "Optimized route planning leading to fuel savings and faster deliveries.",
            "Improved fleet management and predictive maintenance for vehicles.",
            "Enhanced warehouse efficiency through automation and optimized layouts.",
            "More accurate demand forecasting for logistics planning.",
            "Increased visibility and tracking across the supply chain.",
            "Reduced shipping costs and improved delivery times."
        ],
        "capabilities": [
            "AI route optimization algorithms.",
            "Predictive maintenance systems for trucks, ships, and planes.",
            "Demand forecasting models for shipping volumes.",
            "Automated warehouse management systems (WMS).",
            "Computer vision for package sorting and inspection.",
            "Real-time traffic prediction and analysis."
        ],
        "keyFeaturesJson": [
            {"icon": "map", "title": "Intelligent Route Optimization", "description": "Minimize travel time and fuel consumption with AI-calculated routes."},
            {"icon": "truck", "title": "Predictive Fleet Maintenance", "description": "Schedule vehicle maintenance based on AI predictions to prevent breakdowns."},
            {"icon": "package", "title": "Automated Warehouse Ops", "description": "Increase sorting speed and accuracy using AI and robotics."}
        ],
        "statisticsJson": [
            {"value": "5-15%", "label": "Reduction in Fuel Costs through Route Optimization"},
            {"value": "10-20%", "label": "Decrease in Vehicle Downtime with Predictive Maintenance"},
            {"value": "20-30%", "label": "Improvement in Warehouse Throughput with Automation"}
        ],
        "connectUseCaseSlugs": [] # Add relevant use case slugs if any
    },
    "real-estate-construction": {
        "description": "Improving property valuation, site management, and building design with AI.",
        "fullDescription": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "AI is impacting the real estate and construction industries by enabling more accurate property valuations, optimizing construction project management, enhancing building design, and improving site safety."}]},
                    {"type": "paragraph", "children": [{"text": "Applications include AI-driven property appraisal models, predictive analytics for construction project risks, generative design for architecture, and computer vision for monitoring construction site progress and safety compliance."}]}
                ]
            }
        },
        "benefits": [
            "More accurate and faster property valuations.",
            "Improved construction project planning and risk management.",
            "Optimized building designs for energy efficiency and cost-effectiveness.",
            "Enhanced safety monitoring on construction sites.",
            "Automation of repetitive design and documentation tasks.",
            "Better prediction of real estate market trends."
        ],
        "capabilities": [
            "AI-powered real estate appraisal models (AVMs).",
            "Predictive analytics for construction project scheduling and cost overruns.",
            "Generative design tools for architectural planning.",
            "Computer vision for site monitoring and progress tracking.",
            "AI analysis of drone imagery for site surveys.",
            "Natural Language Processing for analyzing contracts and regulations."
        ],
        "keyFeaturesJson": [
            {"icon": "home", "title": "AI Property Valuation", "description": "Leverage machine learning for faster and more accurate real estate appraisals."},
            {"icon": "hard-hat", "title": "Smart Construction Mgmt", "description": "Use predictive analytics to mitigate risks and optimize project timelines."},
            {"icon": "layout", "title": "Generative Building Design", "description": "Explore optimized architectural designs using AI algorithms."}
        ],
        "statisticsJson": [
            {"value": "Up to 20%", "label": "Improvement in Property Valuation Accuracy"},
            {"value": "10-15%", "label": "Reduction in Construction Project Delays"},
            {"value": "5-10%", "label": "Potential Cost Savings through Optimized Design"}
        ],
        "connectUseCaseSlugs": [] # Add relevant use case slugs if any
    },
    "government-public-sector": {
        "description": "Improving public services, enhancing efficiency, and informing policy with AI.",
        "fullDescription": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "AI offers significant potential to improve the efficiency and effectiveness of government operations and public services."}]},
                    {"type": "paragraph", "children": [{"text": "Applications include automating administrative tasks, detecting fraud in public programs, optimizing resource allocation, improving public safety through predictive analytics, and enhancing citizen engagement through intelligent interfaces."}]}
                ]
            }
        },
        "benefits": [
            "Increased efficiency in public service delivery.",
            "Improved fraud detection in social programs and tax collection.",
            "Enhanced public safety through predictive policing and resource allocation.",
            "Better citizen engagement via AI-powered communication channels.",
            "Data-driven policy making based on comprehensive analytics.",
            "Optimization of resource allocation for infrastructure and services."
        ],
        "capabilities": [
            "AI for fraud detection and anomaly identification.",
            "Natural Language Processing for analyzing citizen feedback and documents.",
            "Predictive analytics for crime patterns, traffic flow, and public health trends.",
            "Intelligent chatbots for citizen services and information dissemination.",
            "Robotic Process Automation (RPA) for administrative tasks.",
            "Optimization algorithms for resource scheduling and allocation."
        ],
        "keyFeaturesJson": [
            {"icon": "flag", "title": "Efficient Public Services", "description": "Automate processes and optimize resource allocation to improve service delivery."},
            {"icon": "shield", "title": "AI Fraud & Anomaly Detection", "description": "Identify potential fraud and irregularities in public programs and finance."},
            {"icon": "clipboard", "title": "Data-Driven Policy Making", "description": "Utilize AI analytics to inform evidence-based policy decisions."}
        ],
        "statisticsJson": [
            {"value": "Up to 40%", "label": "Potential Reduction in Admin Costs through Automation"},
            {"value": "15-25%", "label": "Improvement in Fraud Detection Rates"},
            {"value": "10%", "label": "Increase in Citizen Satisfaction with AI-powered Services"}
        ],
        "connectUseCaseSlugs": [] # Add relevant use case slugs if any
    },
    "hospitality-tourism": {
        "description": "Enhancing guest experiences and optimizing operations in hospitality and tourism.",
        "fullDescription": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "AI is transforming the hospitality and tourism industry by enabling personalized guest experiences, optimizing pricing and resource allocation, and automating customer service."}]},
                    {"type": "paragraph", "children": [{"text": "From AI-powered chatbots handling bookings and inquiries to dynamic pricing for rooms and flights, and personalized recommendations for activities and dining, AI helps businesses improve guest satisfaction and operational efficiency."}]}
                ]
            }
        },
        "benefits": [
            "Highly personalized guest experiences and recommendations.",
            "Improved customer service through AI chatbots and virtual assistants.",
            "Optimized pricing strategies for rooms, flights, and services.",
            "Enhanced operational efficiency (e.g., staff scheduling, inventory).",
            "Better prediction of booking trends and demand.",
            "Streamlined booking and check-in processes."
        ],
        "capabilities": [
            "AI-powered recommendation engines for travel and activities.",
            "Intelligent chatbots for customer service and booking.",
            "Dynamic pricing algorithms for hospitality services.",
            "Sentiment analysis of guest reviews and feedback.",
            "Predictive analytics for demand forecasting.",
            "AI tools for optimizing staff scheduling and resource allocation."
        ],
        "keyFeaturesJson": [
            {"icon": "smile", "title": "Personalized Guest Services", "description": "Offer tailored recommendations and support using AI analysis of preferences."},
            {"icon": "dollar-sign", "title": "Dynamic Revenue Management", "description": "Optimize pricing for rooms and services based on real-time demand."},
            {"icon": "message-square", "title": "AI-Powered Concierge", "description": "Provide instant assistance and information through intelligent chatbots."}
        ],
        "statisticsJson": [
            {"value": "10-15%", "label": "Increase in Booking Conversion Rates with Personalization"},
            {"value": "20%", "label": "Improvement in Customer Satisfaction Scores"},
            {"value": "5-10%", "label": "Increase in Revenue Per Available Room (RevPAR)"}
        ],
        "connectUseCaseSlugs": [] # Add relevant use case slugs if any
    }
    # --- Add data for other industries below ---
    # "financial-services": { ... },
    # "healthcare": { ... },
}

# --- GraphQL Definitions ---
GET_INDUSTRY_ID_BY_SLUG_QUERY = gql("""
  query GetIndustryIdBySlug($slug: String!) {
    industries(where: { slug: $slug }, stage: DRAFT) {
      id
    }
  }
""")

# Note: Use the exact field names (API IDs) from your schema here
UPDATE_INDUSTRY_MUTATION = gql("""
  mutation UpdateIndustry(
    $id: ID!,
    $description: String,
    $fullDescription: RichTextAST,
    $benefits: [String!],
    $capabilities: [String!],
    $keyFeaturesJson: Json,
    $statisticsJson: Json,
    $useCaseConnections: [UseCaseConnectInput!]
  ) {
    updateIndustry(
      where: { id: $id }
      data: {
        description: $description
        fullDescription: $fullDescription
        benefits: $benefits
        capabilities: $capabilities
        keyFeaturesJson: $keyFeaturesJson
        statisticsJson: $statisticsJson
        relatedUseCases: { connect: $useCaseConnections }
      }
    ) {
      id
      slug
      # Query back some updated fields to confirm
      description
      benefits
      relatedUseCases(first: 5) { # Query back connected items
          id
          slug
      }
    }
  }
""")

PUBLISH_INDUSTRY_MUTATION = gql("""
  mutation PublishIndustry($id: ID!) {
    publishIndustry(where: { id: $id }, to: PUBLISHED) {
      id
      stage
    }
  }
""")


# --- Main Logic ---
def main():
    logging.info("Starting industry details population script...")
    updated_count = 0
    published_count = 0
    skipped_count = 0
    failed_update_count = 0
    failed_publish_count = 0
    not_found_count = 0

    for slug, details in INDUSTRY_DETAILS.items():
        logging.info(f"Processing industry: '{slug}'")

        # 1. Get the ID of the industry
        industry_id = None
        try:
            result = client.execute(GET_INDUSTRY_ID_BY_SLUG_QUERY, variable_values={"slug": slug})
            if result.get("industries") and len(result["industries"]) > 0:
                industry_id = result["industries"][0]["id"]
                logging.info(f"  Found industry ID: {industry_id}")
            else:
                logging.warning(f"  Industry with slug '{slug}' not found in DRAFT stage. Skipping.")
                not_found_count += 1
                continue
        except Exception as e:
            logging.error(f"  Error fetching ID for industry '{slug}': {e}")
            not_found_count += 1
            continue

        # 2. Prepare variables for the mutation
        slugs_to_connect = details.get("connectUseCaseSlugs", [])
        use_case_connections = [{"where": {"slug": s}} for s in slugs_to_connect]

        # Prepare fullDescription: Pass the raw object directly if it exists
        full_desc_data = details.get("fullDescription")
        raw_full_desc = full_desc_data.get("raw") if isinstance(full_desc_data, dict) else None

        variables = {
            "id": industry_id,
            "description": details.get("description"),
            # Pass the raw content directly, or None if not available
            "fullDescription": raw_full_desc,
            "benefits": details.get("benefits"),
            "capabilities": details.get("capabilities"),
            "keyFeaturesJson": details.get("keyFeaturesJson"),
            "statisticsJson": details.get("statisticsJson"),
            "useCaseConnections": use_case_connections
        }

        # 3. Update the industry
        try:
            logging.info(f"  Updating industry '{slug}' (ID: {industry_id})...")
            logging.debug(f"    Variables for update: {json.dumps(variables, indent=2)}")
            update_result = client.execute(UPDATE_INDUSTRY_MUTATION, variable_values=variables)
            logging.debug(f"    Update result: {update_result}")

            if update_result and update_result.get("updateIndustry"):
                logging.info(f"    Successfully updated industry '{slug}'.")
                updated_count += 1

                # 4. Publish the updated industry
                try:
                    logging.info(f"    Publishing industry '{slug}' (ID: {industry_id})...")
                    publish_result = client.execute(PUBLISH_INDUSTRY_MUTATION, variable_values={"id": industry_id})
                    if publish_result and publish_result.get("publishIndustry"):
                        logging.info(f"      Successfully published industry '{slug}'.")
                        published_count += 1
                    else:
                        logging.warning(f"      Failed to publish industry '{slug}'. Response: {publish_result}")
                        failed_publish_count += 1
                except Exception as e:
                    logging.error(f"    Error publishing industry '{slug}' (ID: {industry_id}): {e}")
                    failed_publish_count += 1
            else:
                # Handle potential GraphQL errors in the response
                error_message = "Unknown error during update."
                if isinstance(update_result, dict) and update_result.get('errors'):
                     error_message = update_result['errors'][0].get('message', error_message)
                     logging.error(f"    GraphQL error updating industry '{slug}': {error_message}")
                     logging.error(f"    Full error details: {update_result['errors']}")
                else:
                    logging.error(f"    Failed to update industry '{slug}'. Response: {update_result}")
                failed_update_count += 1

        except Exception as e:
            logging.error(f"  Unexpected error updating industry '{slug}': {e}")
            if hasattr(e, 'errors'):
                 logging.error(f"    GraphQL Errors: {e.errors}")
            if hasattr(e, 'response'):
                 logging.error(f"    Response Content: {e.response.content}")

            failed_update_count += 1


    logging.info("Industry details population finished.")
    logging.info(f"Summary: Updated={updated_count}, Published={published_count}, NotFound/Skipped={not_found_count}, UpdateFailed={failed_update_count}, PublishFailed={failed_publish_count}")

if __name__ == "__main__":
    main() 