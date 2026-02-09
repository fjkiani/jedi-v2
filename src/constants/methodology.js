import { FiCpu, FiCode, FiZap, FiTrendingUp } from 'react-icons/fi';

export const JEDI_METHODOLOGY_STEPS = [
    {
        number: '01',
        slug: 'architect',
        title: 'ARCHITECT',
        subtitle: 'The Blueprint',
        description: 'We deconstruct your manual workflows into autonomous agentic components, designing a neural architecture that maps perfectly to your business objectives.',
        features: [
            'Workflow Deconstruction',
            'Agent Persona Definition',
            'Interface Design',
            'Security Protocol'
        ],
        technicalModules: [
            {
                title: "Interface Layer",
                description: "The Human-Agent Bridge. Designing the UI/UX for seamless collaboration between biological and artificial intelligence.",
                techSlugs: ["react", "next-js", "tailwindcss"]
            },
            {
                title: "Cognitive Architecture",
                description: "Defining the 'Brain' of each agent. Memory systmes, context windows, and decision-making trees.",
                techSlugs: ["langchain", "pinecone"]
            }
        ],
        icon: FiCpu,
        status: 'ANALYSIS',
        involvedTech: [
            { name: 'React', slug: 'react' },
            { name: 'Figma', slug: 'figma' }
        ]
    },
    {
        number: '02',
        slug: 'forge',
        title: 'FORGE',
        subtitle: 'The Build',
        description: 'We engineer custom tools, connect critical APIs, and train the neural pathways of your specific agentic workforce using our proprietary MCP infrastructure.',
        features: [
            'Custom Tool Engineering',
            'RAG Knowledge Injection',
            'Orchestration Setup',
            'Sandbox Testing'
        ],
        technicalModules: [
            {
                title: "Intelligence Layer",
                description: "The JEDI Mind. Fine-tuning models and injecting domain-specific knowledge via RAG pipelines.",
                techSlugs: ["openai", "tensorflow", "huggingface"]
            },
            {
                title: "Tool Engineering",
                description: "Building the 'Hands' of the agent. Custom MCP servers that allow agents to interact with your internal APIs.",
                techSlugs: ["python", "nodejs"]
            }
        ],
        icon: FiCode,
        status: 'ENGINEERING',
        involvedTech: [
            { name: 'Python', slug: 'python' },
            { name: 'OpenAI', slug: 'openai' },
            { name: 'TensorFlow', slug: 'tensorflow-serving' }
        ]
    },
    {
        number: '03',
        slug: 'awaken',
        title: 'AWAKEN',
        subtitle: 'The Integration',
        description: 'We deploy the swarm into your secure infrastructure, activating the neural link between your data and our intelligence units.',
        features: [
            'Infrastructure Injection',
            'Live Data Connection',
            'Staff Handoffs',
            'Latency Optimization'
        ],
        technicalModules: [
            {
                title: "Infrastructure Layer",
                description: "The Backbone. Scalable, secure deployment on Kubernetes clusters with auto-scaling capabilities.",
                techSlugs: ["kubernetes", "docker", "aws"]
            },
            {
                title: "Data Ingestion",
                description: "Real-time pipelines that feed the agents. ETL processes, vector database syncing, and event streams.",
                techSlugs: ["kafka", "airflow", "postgresql"]
            }
        ],
        icon: FiZap,
        status: 'DEPLOYMENT',
        involvedTech: [
            { name: 'AWS', slug: 'aws' },
            { name: 'Docker', slug: 'docker' },
            { name: 'Kubernetes', slug: 'kubernetes' }
        ]
    },
    {
        number: '04',
        slug: 'evolve',
        title: 'EVOLVE',
        subtitle: 'The Optimization',
        description: 'The system is not static. It learns from every interaction, becoming smarter, faster, and more efficient with every task it completes.',
        features: [
            'Performance Tuning',
            'Feedback Integration',
            'Capability Expansion',
            'Predictive Scaling'
        ],
        technicalModules: [
            {
                title: "Feedback Loops",
                description: "Reinforcement Learning from Human Feedback (RLHF). Agents get smarter as your team corrects them.",
                techSlugs: ["langsmith", "arize"]
            },
            {
                title: "Predictive Scaling",
                description: "Auto-scaling infrastructure based on predicted load and agent complexity.",
                techSlugs: ["keda", "prometheus"]
            }
        ],
        icon: FiTrendingUp,
        status: 'EVOLUTION',
        involvedTech: [
            { name: 'PostgreSQL', slug: 'postgresql' },
            { name: 'Hygraph', slug: 'hygraph-cms' }
        ]
    }
];
