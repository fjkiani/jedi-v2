
import { getAllSolutions } from '../constants/solutions';

// Map internal keys to display names that match TechStoryTopology icons
const CATEGORY_MAPPING = {
    userInterface: "Frontend",
    frontend: "Frontend",
    backend: "Backend",
    database: "Databases",
    databases: "Databases",
    devOps: "DevOps",
    security: "Security",
    aiMl: "AI/ML",
    machineLearning: "AI/ML",
    nlpNlu: "AI/ML",
    agentCore: "Agent Core",
    agentFrameworks: "Agent Core",
    apiLayer: "API Layer",
    integration: "API Layer",
    infrastructure: "Infrastructure",
    testing: "DevOps",
    analytics: "Databases", // or create new
    knowledgeBase: "Databases",
    taskPlanning: "Agent Core"
};

export const getAllTechnologies = () => {
    const solutions = getAllSolutions();
    const masterStack = {};

    solutions.forEach(solution => {
        if (!solution.techStack) return;

        Object.entries(solution.techStack).forEach(([catKey, techs]) => {
            // Determine the display name (bucket) for this category
            const displayName = CATEGORY_MAPPING[catKey] || formatCategoryName(catKey);

            if (!masterStack[displayName]) {
                masterStack[displayName] = {};
            }

            // Merge technologies
            Object.entries(techs).forEach(([techName, details]) => {
                // Avoid duplicates, but maybe overwrite if new details are better?
                // For now, first come first serve, or just spread.
                if (!masterStack[displayName][techName]) {
                    masterStack[displayName][techName] = details;
                }
            });
        });
    });

    return masterStack;
};

// Helper to format "camelCase" to "Title Case" if no mapping found
const formatCategoryName = (str) => {
    return str
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
};
