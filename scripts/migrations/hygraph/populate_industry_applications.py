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
# TODO: Replace with actual data and ensure slugs exist in Hygraph
INDUSTRY_APPLICATIONS_DATA = {
    # --- UPDATED Healthcare Entry ---
    "healthcare-drug-discovery": {
        "applicationTitle": "Accelerating Drug Target Identification",
        # --- Relations ---
        "industrySlug": "healthcare",
        "relevantJediComponentSlugs": ["proteinbind", "jedi-ensemble"], # Keep linked components
        # "keyTechnologySlugs": ["molecular-simulation", "ai-analysis-engine"], # Commented out temporarily
        "relatedUseCaseSlugs": [], # Add relevant use case slugs if needed
        # --- Fields ---
        "relevantEngine": "aiAnalysisEngine", # Core engine area
        "tagline": "Leveraging AI for faster, more accurate preclinical drug discovery.", # NEW
        "industryChallenge": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "Traditional drug discovery faces immense hurdles: identifying viable protein targets is a slow, resource-intensive process plagued by high failure rates. Sifting through massive biological datasets (genomics, proteomics, metabolomics) and predicting complex molecular interactions accurately remains a critical bottleneck, significantly delaying the development of life-saving therapies and driving up costs."}]},
                    {"type": "paragraph", "children": [{"text": "Limitations in traditional high-throughput screening and animal models often fail to predict human efficacy or toxicity until late-stage clinical trials, contributing to the ~90% attrition rate for drug candidates."}]}
                ]
            }
        },
        "jediApproach": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "Jedi Labs tackles these challenges using its advanced AI platform, featuring ProteinBind™ and JEDI Ensemble™."}]},
                    {"type": "paragraph", "children": [{"text": "Our ProteinBind™ engine employs cutting-edge geometric deep learning and molecular simulation to accurately predict protein structures and protein-ligand binding affinities *in silico*. This enables the rapid virtual screening of millions, even billions, of potential drug compounds against novel or established targets, drastically reducing the time and cost associated with initial wet-lab experiments and focusing R&D efforts on the most promising candidates."}]},
                    {"type": "paragraph", "children": [{"text": "JEDI Ensemble™ complements this by integrating and analyzing diverse biological data sources (genomics, transcriptomics, clinical data, literature). It identifies complex patterns indicative of target validity, potential efficacy based on biological pathways, and even predicts potential off-target effects or toxicity profiles early in the process, further de-risking development."}]},
                    {"type": "paragraph", "children": [{"text": "By combining high-fidelity molecular predictions with deep biological context analysis, Jedi Labs provides researchers with a ranked and validated list of drug targets and lead compounds, significantly accelerating the pre-clinical phase and increasing the probability of successful drug development."}]}
                ]
            }
        },
        # --- NEW FIELDS ---
        "keyCapabilities": [
            "In silico prediction of protein structure and binding affinity.",
            "High-throughput virtual screening of compound libraries.",
            "Integration and analysis of multi-omics data (genomics, proteomics).",
            "Identification of novel biological pathways and targets.",
            "Early prediction of potential off-target effects."
        ],
        "expectedResults": [
            "Up to 40% reduction in early-stage drug discovery timelines.",
            "Significant decrease in wet-lab screening costs.",
            "Increased success rate for preclinical candidates.",
            "Identification of novel, previously overlooked drug targets.",
            "Improved understanding of disease mechanisms."
        ],
        # --- END NEW FIELDS ---
    },
    # --- UPDATED Financial Services Entry ---
    "financial-fraud-detection": {
        "applicationTitle": "Real-time Fraud Detection & Prevention", # Slightly updated title
        "industrySlug": "financial-services",
        "relevantJediComponentSlugs": ["jedi-ensemble", "jedi-rules", "jedi-monitor"], # Added Monitor
        # "keyTechnologySlugs": ["ai-analysis-engine", "decision-engine"], # Commented out temporarily
        "relatedUseCaseSlugs": [],
        "relevantEngine": "decisionEngine", # Core engine area
        "tagline": "Proactively identifying and stopping fraudulent transactions in real-time.", # NEW
        "industryChallenge": {
             "raw": {
                 "children": [
                     {"type": "paragraph", "children": [{"text": "Financial institutions constantly battle evolving fraud tactics across various channels (online transactions, credit applications, insurance claims). Traditional rule-based systems struggle to keep pace with sophisticated fraudsters, leading to significant financial losses and damage to customer trust. Detecting complex fraud patterns hidden within vast amounts of transaction data in real-time is a major challenge."}]}
                 ]
             }
        },
        "jediApproach": {
             "raw": {
                 "children": [
                     {"type": "paragraph", "children": [{"text": "Jedi Labs employs a multi-layered AI approach using JEDI Ensemble™ and JEDI Rules™."}]},
                     {"type": "paragraph", "children": [{"text": "JEDI Ensemble™ analyzes diverse data streams (transaction details, user behavior, device information, network data) in real-time, identifying subtle anomalies and complex patterns indicative of fraud that static rules miss. It adapts continuously to new fraud vectors."}]},
                     {"type": "paragraph", "children": [{"text": "JEDI Rules™ provides a flexible engine to implement dynamic risk scoring and automated actions based on the insights generated by JEDI Ensemble™ and predefined business logic. This allows for immediate blocking of high-risk transactions or flagging for manual review."}]},
                    {"type": "paragraph", "children": [{"text": "JEDI Monitor™ provides continuous oversight, tracking model performance and alerting teams to potential drift or new attack patterns, ensuring the system remains effective."}]}
                 ]
             }
        },
        # --- NEW FIELDS ---
        "keyCapabilities": [
            "Real-time analysis of transaction streams.",
            "Detection of complex and anomalous fraud patterns.",
            "Adaptive learning to counter evolving fraud tactics.",
            "Dynamic risk scoring based on multiple factors.",
            "Automated transaction blocking or flagging.",
            "Behavioral analysis and user profiling."
        ],
        "expectedResults": [
            "Up to 70% reduction in false positives compared to traditional systems.",
            "Significant decrease in financial losses due to fraud.",
            "Faster detection of emerging fraud schemes.",
            "Improved customer experience by reducing friction for legitimate transactions.",
            "Enhanced compliance with regulatory requirements."
        ],
        # --- END NEW FIELDS ---
    },
    # --- Technology Entry ---
    "technology-ai-dev-assist": {
        "applicationTitle": "AI-Assisted Software Development Acceleration",
        # --- Relations ---
        "industrySlug": "technology",
        "relevantJediComponentSlugs": ["jedi-autotune", "jedi-deploy", "jedi-monitor"], # Example components
        "keyTechnologySlugs": ["ai-analysis-engine", "automation-tools"], # Example tech slugs (Ensure these exist or comment out)
        "relatedUseCaseSlugs": [],
        # --- Fields ---
        "relevantEngine": "aiAnalysisEngine", # Core engine area
        "tagline": "Boosting developer productivity and code quality with intelligent tools.",
        "industryChallenge": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "The demand for faster software delivery cycles and higher quality code puts immense pressure on development teams. Manual coding, testing, and deployment processes can be slow, error-prone, and resource-intensive. Identifying potential bugs early and optimizing complex codebases remains a significant challenge."}]}
                ]
            }
        },
        "jediApproach": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "Jedi Labs integrates AI capabilities directly into the software development lifecycle."}]},
                    {"type": "paragraph", "children": [{"text": "JEDI AutoTune™ assists developers with intelligent code completion, bug detection, and automated refactoring suggestions, leveraging large language models trained on vast code repositories. It helps write cleaner, more efficient code faster."}]},
                    {"type": "paragraph", "children": [{"text": "JEDI Deploy™ streamlines the CI/CD pipeline with automated testing based on code changes and intelligent canary deployments, reducing the risk of production issues. JEDI Monitor™ then provides insights into application performance and user experience post-deployment."}]}
                ]
            }
        },
        "keyCapabilities": [
            "Intelligent code completion and suggestion.",
            "Automated code review and bug detection.",
            "AI-powered test case generation.",
            "Optimized CI/CD pipeline management.",
            "Performance monitoring and anomaly detection in production."
        ],
        "expectedResults": [
            "15-30% increase in developer productivity.",
            "Reduction in code bugs and vulnerabilities.",
            "Faster release cycles and time-to-market.",
            "Improved application stability and performance.",
            "More efficient resource utilization in testing and deployment."
        ]
    },
    # --- Retail Entry ---
    "retail-personalization-inventory": {
        "applicationTitle": "AI-Powered Personalization & Inventory Optimization",
        # --- Relations ---
        "industrySlug": "retail",
        "relevantJediComponentSlugs": ["jedi-ensemble", "jedi-rules"], # Example components
        # "keyTechnologySlugs": ["ai-analysis-engine", "predictive-analytics"], # Example tech slugs (Ensure these exist or comment out)
        "relatedUseCaseSlugs": [],
        # --- Fields ---
        "relevantEngine": "aiAnalysisEngine", # Core engine area
        "tagline": "Boosting sales and efficiency with tailored experiences and smart stock management.",
        "industryChallenge": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "Retailers face intense competition and shrinking margins. Delivering generic customer experiences leads to low engagement and conversion rates. Simultaneously, inaccurate demand forecasting results in stockouts of popular items and overstocking of slow-moving goods, tying up capital and leading to markdowns."}]}
                ]
            }
        },
        "jediApproach": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "Jedi Labs addresses both challenges with an integrated AI approach."}]},
                    {"type": "paragraph", "children": [{"text": "JEDI Ensemble™ analyzes customer data (browsing history, purchase patterns, demographics, real-time interactions) to build highly accurate profiles and predict future behavior. This powers personalized product recommendations, targeted promotions, and dynamic website content, significantly increasing engagement and conversion."}]},
                    {"type": "paragraph", "children": [{"text": "The same predictive engine forecasts demand at a granular level (SKU, location, time), enabling optimized inventory allocation across the supply chain. JEDI Rules™ can automate reordering processes based on these forecasts and predefined stock level policies, minimizing both stockouts and overstock."}]}
                ]
            }
        },
        "keyCapabilities": [
            "Real-time customer behavior tracking and analysis.",
            "Predictive modeling for personalized product recommendations.",
            "Granular demand forecasting (SKU/location level).",
            "Automated inventory replenishment rules.",
            "Dynamic pricing suggestions based on demand and inventory.",
            "Customer segmentation for targeted marketing campaigns."
        ],
        "expectedResults": [
            "10-20% increase in online conversion rates.",
            "5-15% reduction in overall inventory costs.",
            "Significant decrease in stockout occurrences.",
            "Improved customer loyalty and lifetime value.",
            "Increased marketing campaign effectiveness.",
            "Optimized markdown strategies."
        ]
    },
    # --- Recruitment/HR Tech Entry (Associated with Technology for now) - REVISED ---
    "recruitment-candidate-matching-agentic": { # New key
        "applicationTitle": "Agentic Talent Acquisition: End-to-End AI Screening",
        # --- Relations ---
        "industrySlug": "technology", # TEMPORARY - Change if Recruitment industry is added
        "relevantJediComponentSlugs": ["jedi-ensemble", "jedi-rules", "jedi-autotune"], # Added AutoTune
        # "keyTechnologySlugs": ["nlp", "ai-analysis-engine", "automation-tools"], # Example tech slugs
        "relatedUseCaseSlugs": [],
        # --- Fields ---
        "relevantEngine": "aiAnalysisEngine",
        "tagline": "Intelligently sourcing, screening, and shortlisting top talent automatically.",
        "industryChallenge": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "High-volume recruitment pipelines overwhelm HR teams. Manual resume sifting is slow, costly, subjective, and struggles to identify nuanced skills or predict candidate potential beyond keywords. This delays hiring, increases costs, and risks missing top candidates or impacting diversity goals."}]}
                ]
            }
        },
        "jediApproach": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "Jedi Labs provides an end-to-end agentic solution for talent acquisition."}]},
                    {"type": "paragraph", "children": [{"text": "The process begins by defining ideal candidate profiles. JEDI Ensemble™ then leverages NLP to deeply understand job descriptions and resumes, extracting not just keywords but contextual skills, experience trajectories, and indicators of cultural alignment. It proactively identifies candidates across multiple sources."}]},
                    {"type": "paragraph", "children": [{"text": "Candidates are automatically scored and ranked against the profile using adaptive algorithms tuned by JEDI AutoTune™, considering both explicit requirements and predicted potential. JEDI Rules™ enforces mandatory criteria (e.g., certifications, location) and flags candidates meeting diversity targets, creating dynamic shortlists."}]},
                    {"type": "paragraph", "children": [{"text": "The system can initiate automated outreach or coordinate initial screening steps based on rule engine triggers, continuously learning and refining its matching algorithms based on recruiter feedback and hiring outcomes."}]}
                ]
            }
        },
        "keyCapabilities": [
            "Deep semantic analysis of resumes and job descriptions.",
            "Context-aware candidate-to-role matching and scoring.",
            "Automated shortlisting based on dynamic criteria.",
            "Proactive flagging for diversity and specific skillsets.",
            "Rule-based automation of initial screening/outreach steps.",
            "Continuous learning from hiring outcomes.",
            "Integration with ATS and communication platforms."
        ],
        "expectedResults": [
            "Over 70% reduction in manual screening time.",
            "Up to 40% faster time-to-fill critical roles.",
            "Measurable improvement in quality-of-hire metrics.",
            "Enhanced compliance and diversity in candidate pools.",
            "Significant reduction in cost-per-hire.",
            "Improved recruiter efficiency and focus on candidate engagement."
        ]
    },
    # --- Manufacturing Entry ---
    "manufacturing-smart-factory-agentic": {
        "applicationTitle": "Agentic Smart Factory Operations",
        # --- Relations ---
        "industrySlug": "manufacturing",
        "relevantJediComponentSlugs": ["jedi-monitor", "jedi-ensemble", "jedi-rules", "jedi-autotune"], # Added Monitor/AutoTune
        # "keyTechnologySlugs": ["computer-vision", "predictive-analytics", "iot", "automation-tools"], # Example tech slugs
        "relatedUseCaseSlugs": [],
        # --- Fields ---
        "relevantEngine": "deploymentMonitoring", # Monitoring & controlling agents
        "tagline": "Autonomous AI agents optimizing production, quality, and maintenance 24/7.",
        "industryChallenge": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "Manufacturers strive for maximum efficiency, minimal downtime, and perfect quality. However, complex production lines, unexpected equipment failures, subtle quality deviations, and supply chain disruptions create constant operational challenges. Human oversight alone cannot monitor every variable or react instantly to optimize performance across the entire factory floor."}]}
                ]
            }
        },
        "jediApproach": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "Jedi Labs deploys intelligent AI agents that act as autonomous supervisors across the manufacturing lifecycle."}]},
                    {"type": "paragraph", "children": [{"text": "AI agents powered by JEDI Monitor™ continuously ingest data from IoT sensors on machinery, computer vision systems on production lines, and supply chain feeds. JEDI Ensemble™ analyzes this real-time data stream to predict potential equipment failures *before* they occur, identify micro-deviations in product quality unseen by the human eye, and anticipate potential material shortages."}]},
                    {"type": "paragraph", "children": [{"text": "Based on these predictive insights, JEDI Rules™ triggers autonomous actions: agents can automatically adjust machine parameters for optimal performance, schedule preventative maintenance tasks dynamically, flag specific batches for enhanced quality checks, or even adjust production schedules based on supply availability. JEDI AutoTune™ ensures these predictive models and rules remain optimized over time."}]},
                     {"type": "paragraph", "children": [{"text": "This creates a self-optimizing factory environment where AI agents work A-Z, from monitoring inputs to ensuring quality outputs and maintaining operational health with minimal human intervention."}]}
                ]
            }
        },
        "keyCapabilities": [
            "Real-time IoT sensor data analysis for asset health monitoring.",
            "Predictive maintenance scheduling and alerting.",
            "AI-powered computer vision for automated quality inspection.",
            "Autonomous adjustment of machine operating parameters.",
            "Dynamic production scheduling based on real-time conditions.",
            "Supply chain disruption prediction and mitigation.",
            "Root cause analysis of production bottlenecks."
        ],
        "expectedResults": [
            "15-30% reduction in unplanned equipment downtime.",
            "Up to 50% improvement in detecting quality defects.",
            "5-10% increase in Overall Equipment Effectiveness (OEE).",
            "Reduced waste and material scrap.",
            "Improved on-time delivery rates.",
            "Enhanced operational visibility and control."
        ]
    },
    # --- Energy Entry ---
    "energy-grid-optimization-agentic": {
        "applicationTitle": "Agentic Grid Optimization & Renewable Integration",
        # --- Relations ---
        "industrySlug": "energy",
        "relevantJediComponentSlugs": ["jedi-ensemble", "jedi-rules", "jedi-monitor", "jedi-autotune"], # Components for prediction, control, monitoring
        # "keyTechnologySlugs": ["predictive-analytics", "iot", "control-systems", "renewable-energy"], # Example tech slugs
        "relatedUseCaseSlugs": [],
        # --- Fields ---
        "relevantEngine": "decisionEngine", # Core engine area for control
        "tagline": "Intelligent agents ensuring grid stability and maximizing renewable energy utilization.",
        "industryChallenge": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "Integrating intermittent renewable energy sources (solar, wind) while maintaining grid stability is a complex challenge. Balancing fluctuating supply with demand, predicting potential bottlenecks or equipment failures, and optimizing energy flow across vast networks requires sophisticated, real-time control systems that often exceed human capacity."}]}
                ]
            }
        },
        "jediApproach": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "Jedi Labs deploys a network of AI agents to manage the energy grid proactively from generation to consumption."}]},
                    {"type": "paragraph", "children": [{"text": "Agents powered by JEDI Ensemble™ continuously analyze data from weather forecasts, renewable generation sites (solar farms, wind turbines), grid sensors (voltage, frequency), and consumer demand patterns. They accurately predict energy supply and demand fluctuations minute-by-minute."}]},
                    {"type": "paragraph", "children": [{"text": "Based on these predictions, JEDI Rules™ enables agents to make autonomous decisions: dynamically adjusting output from controllable generation sources, optimizing energy storage charge/discharge cycles, rerouting power flow to prevent congestion, and managing demand-response programs. JEDI AutoTune™ ensures the predictive models adapt to changing weather patterns and grid conditions."}]},
                    {"type": "paragraph", "children": [{"text": "JEDI Monitor™ provides overall grid health oversight, identifying potential equipment faults and allowing agents to isolate issues or adjust operations to maintain stability, ensuring a resilient and efficient energy supply."}]}
                ]
            }
        },
        "keyCapabilities": [
            "Real-time renewable energy generation forecasting.",
            "Predictive grid load balancing and demand forecasting.",
            "Autonomous control of energy storage systems.",
            "Dynamic grid topology optimization and power flow control.",
            "Predictive maintenance for grid infrastructure (transformers, lines).",
            "Automated demand-response management.",
            "Integration with energy market data."
        ],
        "expectedResults": [
            "Improved grid stability and reduced frequency of blackouts/brownouts.",
            "Increased integration and utilization of renewable energy sources.",
            "Optimized efficiency of energy transmission and distribution.",
            "Lower operational costs through predictive maintenance and automation.",
            "Enhanced grid resilience against disruptions.",
            "More accurate energy market forecasting."
        ]
    },
    # --- Education Entry ---
    "education-personalized-learning-agentic": {
        "applicationTitle": "Agentic Personalized Learning Orchestration",
        # --- Relations ---
        "industrySlug": "education",
        "relevantJediComponentSlugs": ["jedi-ensemble", "jedi-rules", "jedi-autotune"], # Components for analysis, rules, optimization
        # "keyTechnologySlugs": ["adaptive-learning", "nlp", "learning-analytics"], # Example tech slugs
        "relatedUseCaseSlugs": [],
        # --- Fields ---
        "relevantEngine": "aiAnalysisEngine", # Core engine for understanding student needs
        "tagline": "AI agents crafting unique learning journeys for every student.",
        "industryChallenge": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "Traditional one-size-fits-all educational models struggle to cater to diverse student learning styles, paces, and needs. Educators lack the time and tools to continuously monitor individual progress and tailor content effectively, leading to disengagement and suboptimal learning outcomes."}]}
                ]
            }
        },
        "jediApproach": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "Jedi Labs deploys AI learning agents that act as personalized tutors and curriculum designers."}]},
                    {"type": "paragraph", "children": [{"text": "JEDI Ensemble™ analyzes real-time student interaction data (quiz performance, content engagement, query patterns, feedback) to build a dynamic profile of each learner's strengths, weaknesses, and preferred learning modalities. JEDI AutoTune™ ensures these profiles are constantly refined."}]},
                    {"type": "paragraph", "children": [{"text": "Based on this profile, JEDI Rules™ empowers agents to orchestrate an adaptive A-Z learning path: recommending specific content modules, adjusting difficulty levels, suggesting supplementary resources (videos, articles, practice exercises), identifying knowledge gaps, and providing targeted feedback or intervention prompts."}]},
                    {"type": "paragraph", "children": [{"text": "The system provides educators with dashboards highlighting class trends and students needing specific attention, while allowing students to progress at their own pace with AI-guided support."}]}
                ]
            }
        },
        "keyCapabilities": [
            "Real-time analysis of student performance and engagement data.",
            "Dynamic generation of personalized learning paths.",
            "Adaptive content difficulty adjustment.",
            "Automated recommendation of relevant learning resources.",
            "Identification of at-risk students and knowledge gaps.",
            "Rule-based triggering of interventions or support.",
            "Natural Language Processing for analyzing student queries/feedback."
        ],
        "expectedResults": [
            "Measurable improvement in student learning outcomes and test scores.",
            "Increased student engagement and motivation.",
            "Reduced educator workload for personalized planning.",
            "Better identification and support for struggling students.",
            "Improved accessibility for diverse learning needs.",
            "Data-driven insights for curriculum optimization."
        ]
    },
    # --- Media & Entertainment Entry ---
    "media-content-personalization-agentic": {
        "applicationTitle": "Agentic Content Personalization & Monetization",
        # --- Relations ---
        "industrySlug": "media-entertainment",
        "relevantJediComponentSlugs": ["jedi-ensemble", "jedi-rules", "jedi-monitor"], # Components for user analysis, rule-based delivery, monitoring
        # "keyTechnologySlugs": ["recommendation-engines", "nlp", "user-profiling", "ad-tech"], # Example tech slugs
        "relatedUseCaseSlugs": [],
        # --- Fields ---
        "relevantEngine": "aiAnalysisEngine", # Core engine for understanding users
        "tagline": "AI agents dynamically tailoring content and ads for maximum engagement and revenue.",
        "industryChallenge": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "Media platforms struggle to retain users amidst vast content libraries and intense competition. Delivering relevant content and advertisements is crucial but difficult at scale. Generic recommendations lead to user churn, while poorly targeted ads result in wasted spend and viewer fatigue."}]}
                ]
            }
        },
        "jediApproach": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "Jedi Labs employs AI agents to orchestrate the entire viewer experience from discovery to monetization."}]},
                    {"type": "paragraph", "children": [{"text": "JEDI Ensemble™ agents build deep, evolving user profiles by analyzing viewing history, content interactions, time-of-day patterns, device usage, and even sentiment expressed in comments or social media. This goes beyond simple genre preferences to understand implicit interests and predict future engagement."}]},
                    {"type": "paragraph", "children": [{"text": "Based on these dynamic profiles, JEDI Rules™ empowers agents to personalize the user interface in real-time: curating content carousels, recommending specific titles, tailoring promotional offers, and dynamically inserting highly relevant advertisements. The rules engine ensures alignment with business goals (e.g., promoting original content, maximizing ad yield)."}]},
                    {"type": "paragraph", "children": [{"text": "JEDI Monitor™ tracks key engagement metrics (watch time, click-through rates, subscription conversions) and ad performance, providing feedback to continuously refine the personalization and monetization strategies employed by the AI agents."}]}
                ]
            }
        },
        "keyCapabilities": [
            "Real-time user behavior tracking and predictive profiling.",
            "Context-aware content recommendation engine.",
            "Dynamic UI personalization based on user segments.",
            "AI-powered ad targeting and yield optimization.",
            "Automated content tagging and metadata enrichment (NLP/Vision).",
            "Churn prediction and preventative engagement strategies.",
            "Audience sentiment analysis."
        ],
        "expectedResults": [
            "20-40% increase in user engagement metrics (e.g., time spent, content consumed).",
            "Significant improvement in content discovery and user satisfaction.",
            "15-30% increase in advertising click-through rates (CTR) and revenue.",
            "Reduced user churn rates.",
            "More effective promotion of specific content or subscriptions.",
            "Deeper insights into audience preferences and content performance."
        ]
    },
    # Add more IndustryApplication entries here following the same structure...
    
}


# --- GraphQL Definitions ---
# Query to get Industry ID by Slug
GET_INDUSTRY_ID_BY_SLUG_QUERY = gql("""
  query GetIndustryId($slug: String!) {
    industries(where: { slug: $slug }, stage: DRAFT) {
      id
    }
  }
""")

CHECK_APP_EXISTS_QUERY = gql("""
  query CheckIndustryApplication($title: String!) {
    # Assuming applicationTitle is unique enough for check, or use another unique field if available
    industryApplications(where: { applicationTitle: $title }, stage: DRAFT) {
      id
    }
  }
""")

CREATE_INDUSTRY_APPLICATION_MUTATION = gql("""
  mutation CreateIndustryApplication(
    $applicationTitle: String!
    $industry: IndustryWhereUniqueInput! # Keep as single, connect by ID
    $relevantEngine: String! # Assuming this is still String or Enum ID
    $industryChallenge: RichTextAST
    $jediApproach: RichTextAST
    # --- Corrected variable names and types ---
    # $technologies: [TechnologyWhereUniqueInput!] # Commented out temporarily
    $useCases: [UseCaseWhereUniqueInput!]
    $jediComponents: [JediComponentWhereUniqueInput!]
  ) {
    createIndustryApplication(
      data: {
        applicationTitle: $applicationTitle
        industry: { connect: $industry } # Connect using the single input object {id: ...}
        relevantEngine: $relevantEngine
        industryChallenge: $industryChallenge
        jediApproach: $jediApproach
        # --- Corrected connection field names ---
        # technology: { connect: $technologies }      # Commented out temporarily
        useCase: { connect: $useCases }
        jediComponent: { connect: $jediComponents } # Use API ID 'jediComponent'
      }
    ) {
      id
      applicationTitle
    }
  }
""")

# --- ADD UPDATE MUTATION ---
UPDATE_INDUSTRY_APPLICATION_MUTATION = gql("""
  mutation UpdateIndustryApplication(
    $id: ID! # ID of the entry to update
    $applicationTitle: String!
    # We generally don't update the 'industry' connection
    $relevantEngine: String!
    $industryChallenge: RichTextAST
    $jediApproach: RichTextAST
    # --- Use 'set' for relations to replace existing connections ---
    # $technologies: [TechnologyWhereUniqueInput!] # Commented out temporarily
    $useCases: [UseCaseWhereUniqueInput!]
    $jediComponents: [JediComponentWhereUniqueInput!]
  ) {
    updateIndustryApplication(
      where: { id: $id }
      data: {
        applicationTitle: $applicationTitle
        relevantEngine: $relevantEngine
        industryChallenge: $industryChallenge
        jediApproach: $jediApproach
        # --- Using 'set' assumes you want to replace all existing relations ---
        # If you need append/disconnect, adjust the mutation structure
        # technology: { set: $technologies } # Commented out temporarily
        useCase: { set: $useCases }
        jediComponent: { set: $jediComponents }
      }
    ) {
      id
      applicationTitle
    }
  }
""")
# --- END UPDATE MUTATION ---

# TODO: Adapt publish mutation name ('publishIndustryApplication')
PUBLISH_INDUSTRY_APPLICATION_MUTATION = gql("""
  mutation PublishIndustryApplication($id: ID!) {
    publishIndustryApplication(where: { id: $id }, to: PUBLISHED) {
      id
      stage
    }
  }
""")

# --- Main Logic ---
def main():
    logging.info("Starting Industry Application population script...")
    created_count = 0
    updated_count = 0 # Track updates
    published_count = 0
    skipped_count = 0 # Keep for errors before create/update attempt
    failed_create_count = 0
    failed_update_count = 0 # Track update failures
    failed_publish_count = 0

    for app_key, details in INDUSTRY_APPLICATIONS_DATA.items():
        logging.info(f"Processing application: '{details['applicationTitle']}' (key: {app_key})")
        application_id = None
        existing_id = None

        # 1. Check if application already exists
        try:
            existing = client.execute(CHECK_APP_EXISTS_QUERY, variable_values={"title": details['applicationTitle']})
            if existing.get("industryApplications") and len(existing["industryApplications"]) > 0:
                existing_id = existing["industryApplications"][0]["id"]
                logging.info(f"  Application '{details['applicationTitle']}' already exists with ID: {existing_id}. Will attempt update.")
            else:
                 logging.info(f"  Application '{details['applicationTitle']}' does not exist. Will attempt creation.")
        except Exception as e:
            logging.error(f"  Error checking for existing application '{details['applicationTitle']}': {e}. Skipping.")
            skipped_count += 1
            continue

        # --- Get Industry ID (Needed for CREATE, optional validation for UPDATE) ---
        industry_slug = details.get("industrySlug")
        industry_id = None # Initialize industry_id for create case
        if not existing_id: # Only fetch industry ID if creating
             if not industry_slug:
                 logging.error(f"  Missing 'industrySlug' for creating application '{details['applicationTitle']}'. Skipping.")
                 skipped_count += 1
                 continue
             try:
                 id_result = client.execute(GET_INDUSTRY_ID_BY_SLUG_QUERY, variable_values={"slug": industry_slug})
                 if id_result.get("industries") and len(id_result["industries"]) > 0:
                     industry_id = id_result["industries"][0]["id"]
                     logging.info(f"  Found Industry ID: {industry_id} for slug: {industry_slug}")
                 else:
                     logging.error(f"  Industry with slug '{industry_slug}' not found for application '{details['applicationTitle']}'. Skipping creation.")
                     skipped_count += 1
                     continue
             except Exception as e:
                 logging.error(f"  Error fetching Industry ID for slug '{industry_slug}': {e}. Skipping creation.")
                 skipped_count += 1
                 continue

        # 2. Prepare variables (Common preparation logic)
        try:
            industry_challenge_raw = details.get("industryChallenge", {}).get("raw")
            jedi_approach_raw = details.get("jediApproach", {}).get("raw")

            if not industry_challenge_raw or not jedi_approach_raw:
                 logging.warning(f"  Skipping '{details['applicationTitle']}' due to missing Rich Text data (Challenge or Approach).")
                 skipped_count += 1
                 continue

            jedi_component_slugs = details.get("relevantJediComponentSlugs", [])
            # key_tech_slugs = details.get("keyTechnologySlugs", []) # Commented out temporarily
            related_uc_slugs = details.get("relatedUseCaseSlugs", [])

            # Variables common to Create and Update (excluding ID/Industry connect)
            common_data = {
                "applicationTitle": details["applicationTitle"],
                "relevantEngine": details["relevantEngine"],
                "industryChallenge": industry_challenge_raw,
                "jediApproach": jedi_approach_raw,
                # "technologies": [{"slug": s} for s in key_tech_slugs], # Commented out temporarily
                "useCases": [{"slug": s} for s in related_uc_slugs],
                "jediComponents": [{"slug": s} for s in jedi_component_slugs]
            }
            # Remove keys with None/empty list values if necessary
            common_data = {k: v for k, v in common_data.items() if v not in [None, [], {}]}

        except KeyError as e:
            logging.error(f"  Missing expected key '{e}' in data for application '{app_key}'. Skipping.")
            skipped_count += 1
            continue
        except Exception as e:
             logging.error(f"  Error preparing variables for '{app_key}': {e}. Skipping.")
             skipped_count += 1
             continue

        # 3. Execute Create or Update
        mutation_successful = False
        if existing_id:
            # --- UPDATE ---
            update_variables = { "id": existing_id, **common_data }
            try:
                logging.info(f"  Updating application ID '{existing_id}'...")
                update_result = client.execute(UPDATE_INDUSTRY_APPLICATION_MUTATION, variable_values=update_variables)
                if update_result and update_result.get("updateIndustryApplication"):
                    application_id = update_result["updateIndustryApplication"]["id"] # Should be same as existing_id
                    logging.info(f"    Successfully updated application '{details['applicationTitle']}' (ID: {application_id})")
                    updated_count += 1
                    mutation_successful = True
                else:
                    error_message = "Unknown error during update."
                    if isinstance(update_result, dict) and update_result.get('errors'):
                        error_message = update_result['errors'][0].get('message', error_message)
                    logging.error(f"    Failed to update application '{details['applicationTitle']}'. Error: {error_message}")
                    logging.debug(f"    Full error details: {update_result.get('errors')}")
                    failed_update_count += 1
            except Exception as e:
                logging.error(f"  Unexpected error updating application '{app_key}': {e}")
                if hasattr(e, 'errors'): logging.error(f"    GraphQL Errors: {e.errors}")
                if hasattr(e, 'response'): logging.error(f"    Response Content: {e.response.content}")
                failed_update_count += 1
        else:
            # --- CREATE ---
            create_variables = { "industry": { "id": industry_id }, **common_data }
            try:
                logging.info(f"  Creating application '{details['applicationTitle']}'...")
                create_result = client.execute(CREATE_INDUSTRY_APPLICATION_MUTATION, variable_values=create_variables)
                if create_result and create_result.get("createIndustryApplication"):
                    application_id = create_result["createIndustryApplication"]["id"]
                    logging.info(f"    Successfully created application '{details['applicationTitle']}' with ID: {application_id}")
                    created_count += 1
                    mutation_successful = True
                else:
                    error_message = "Unknown error during creation."
                    if isinstance(create_result, dict) and create_result.get('errors'):
                        error_message = create_result['errors'][0].get('message', error_message)
                    logging.error(f"    Failed to create application '{details['applicationTitle']}'. Error: {error_message}")
                    logging.debug(f"    Full error details: {create_result.get('errors')}")
                    failed_create_count += 1
            except Exception as e:
                logging.error(f"  Unexpected error creating application '{app_key}': {e}")
                if hasattr(e, 'errors'): logging.error(f"    GraphQL Errors: {e.errors}")
                if hasattr(e, 'response'): logging.error(f"    Response Content: {e.response.content}")
                failed_create_count += 1

        # 4. Publish if Create or Update was successful
        if mutation_successful and application_id:
            try:
                logging.info(f"    Publishing application '{details['applicationTitle']}' (ID: {application_id})...")
                publish_result = client.execute(PUBLISH_INDUSTRY_APPLICATION_MUTATION, variable_values={"id": application_id})
                if publish_result and publish_result.get("publishIndustryApplication"):
                    logging.info(f"      Successfully published application '{details['applicationTitle']}'.")
                    published_count +=1
                else:
                    logging.warning(f"      Failed to publish application '{details['applicationTitle']}' after mutation. Response: {publish_result}")
                    failed_publish_count += 1
            except Exception as e:
                logging.error(f"    Error publishing application with ID '{application_id}': {e}")
                failed_publish_count += 1

    logging.info("Industry Application population finished.")
    # Updated summary log
    logging.info(f"Summary: Skipped={skipped_count}, Created={created_count}, Updated={updated_count}, Published={published_count}, CreateFailed={failed_create_count}, UpdateFailed={failed_update_count}, PublishFailed={failed_publish_count}")

if __name__ == "__main__":
    main() 