import { service1, service2, service3 } from '../assets';

// Intelligence Units Data for the Agent Registry Preview
// Icons map to src/components/Icon.jsx names

export const INTELLIGENCE_UNITS = [
    {
        id: 'unit-01',
        name: 'THE ONCOLOGIST',
        codename: 'CrisPRO',
        tagline: 'Precision Medicine Agent',
        description: 'Specialized in metastasis interception, AlphaFold protein folding integration, and clinical trial matching.',
        icon: 'heart',
        capabilities: [
            { name: 'AlphaFold Integration', description: 'Predicts protein structures for drug targets.' },
            { name: 'Trial Matching', description: 'Matches patients to clinical trials with high precision.' },
            { name: 'Metastasis Pattern Recognition', description: 'Identifies potential spread vectors.' }
        ],
        status: 'ACTIVE_DUTY',
        imageUrl: service1,
        color: 'from-pink-500 to-rose-500'
    },
    {
        id: 'unit-02',
        name: 'THE OPERATOR',
        codename: 'FrappeBot',
        tagline: 'Business Operations Agent',
        description: 'Autonomous CRM management, lead qualification, and multi-channel pipeline orchestration.',
        icon: 'message-circle',
        capabilities: [
            { name: 'Autonomous CRM Entry', description: 'Logs and updates deals without human input.' },
            { name: 'WhatsApp Automation', description: 'Engages leads via chat with context.' },
            { name: 'Pipeline Velocity Tracking', description: 'Monitors multiple deal stages simultaneously.' }
        ],
        status: 'DEPLOYED',
        imageUrl: service2,
        color: 'from-blue-500 to-indigo-500'
    },
    {
        id: 'unit-03',
        name: 'THE ORCHESTRATOR',
        codename: 'Omni',
        tagline: 'Universal Task Agent',
        description: 'The central brain connecting all tools, APIs, and data sources into a unified intelligence network.',
        icon: 'cpu',
        capabilities: [
            { name: 'Universal API Connector', description: 'Interacts with any MCP-enabled tool.' },
            { name: 'Context Management', description: 'Maintains long-term memory across sessions.' },
            { name: 'Recursive Problem Solving', description: 'Breaks down complex tasks into sub-agents.' }
        ],
        status: 'LEARNING',
        imageUrl: service3,
        color: 'from-purple-500 to-violet-500'
    }
];
