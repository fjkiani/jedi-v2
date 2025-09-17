#!/usr/bin/env node

/**
 * Add Missing Technologies Script
 * Adds technologies from local registry that are missing in Hygraph
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { JEDI_COMPONENTS, TECHNOLOGY_JEDI_INTEGRATIONS } from './jedi_components_definition.js';

// Load environment variables
dotenv.config();

const ENDPOINT = process.env.VITE_HYGRAPH_ENDPOINT;
const TOKEN = process.env.VITE_HYGRAPH_TOKEN;

async function makeRequest(query, variables = {}) {
    try {
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`,
                'gcms-stage': 'DRAFT'
            },
            body: JSON.stringify({ query, variables })
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        return { error: error.message };
    }
}

// Missing technologies from local registry
const MISSING_TECHNOLOGIES = {
    "pytorch": {
        name: "PyTorch",
        slug: "pytorch",
        description: "Open-source machine learning framework for deep learning and neural network development",
        icon: "pytorch.png",
        priority: 1,
        categorySlug: "ml",
        features: "Deep Learning Framework, Neural Networks, Model Training, Optimization, Research Tools, Production Deployment, Distributed Computing, Mobile Support",
        businessMetrics: "50% faster model development, 95% research accuracy, 3x faster training, 99.9% production reliability, 10M+ developers",
        jediComponents: ["JEDI_AUTOTUNE", "PROTEINBIND"],
        architecture: "Deep learning framework with tensor operations, automatic differentiation, and distributed training support",
        integration: "JEDI AutoTune™ model development and optimization, ProteinBind™ molecular modeling and drug discovery",
        useCases: [
            "Deep Learning Model Development",
            "Research and Experimentation", 
            "Production Model Deployment",
            "Custom AI Model Creation",
            "Molecular Modeling",
            "Drug Discovery Research"
        ]
    },
    
    "scikit-learn": {
        name: "Scikit-learn",
        slug: "scikit-learn",
        description: "Machine learning library for Python with simple and efficient tools for data mining and data analysis",
        icon: "scikit-learn.png",
        priority: 2,
        categorySlug: "ml",
        features: "Machine Learning Algorithms, Data Preprocessing, Model Selection, Cross-validation, Feature Engineering, Model Evaluation, Pipeline Management, Clustering",
        businessMetrics: "80% faster model development, 90% accuracy improvement, 60% cost reduction, 5M+ downloads monthly, enterprise-grade reliability",
        jediComponents: ["JEDI_AUTOTUNE"],
        architecture: "Python-based ML library with NumPy and SciPy integration, scikit-learn pipelines, and model persistence",
        integration: "JEDI AutoTune™ automated model selection and hyperparameter optimization",
        useCases: [
            "Machine Learning Model Development",
            "Data Preprocessing and Feature Engineering",
            "Model Selection and Validation",
            "Production ML Pipeline Deployment",
            "Research and Experimentation",
            "Educational and Training Programs"
        ]
    },
    
    "tensorflow": {
        name: "TensorFlow",
        slug: "tensorflow",
        description: "End-to-end open-source platform for machine learning with comprehensive tools and libraries",
        icon: "tensorflow.png",
        priority: 1,
        categorySlug: "ml",
        features: "Machine Learning Platform, Neural Networks, Model Training, TensorFlow Lite, TensorFlow.js, TensorFlow Extended, Production Deployment, Distributed Training",
        businessMetrics: "60% faster model deployment, 95% accuracy improvement, 70% cost reduction, 2M+ developers, 99.9% production reliability",
        jediComponents: ["JEDI_AUTOTUNE", "JEDI_ENSEMBLE"],
        architecture: "End-to-end ML platform with TensorFlow Core, TensorFlow Lite, TensorFlow.js, and TensorFlow Extended",
        integration: "JEDI AutoTune™ model optimization and deployment, JEDI Ensemble™ multi-model orchestration",
        useCases: [
            "Machine Learning Model Development",
            "Production Model Deployment",
            "Mobile and Edge AI Applications",
            "Distributed Training and Inference",
            "Research and Experimentation",
            "Enterprise AI Platform Development"
        ]
    },
    
    "opencv": {
        name: "OpenCV",
        slug: "opencv",
        description: "Open-source computer vision and machine learning software library with 2500+ optimized algorithms",
        icon: "opencv.png",
        priority: 3,
        categorySlug: "ml",
        features: "Computer Vision, Image Processing, Machine Learning, Object Detection, Face Recognition, Video Analysis, Real-time Processing, Cross-platform Support",
        businessMetrics: "90% faster image processing, 95% accuracy in computer vision tasks, 50% development time reduction, 10M+ downloads, real-time performance",
        jediComponents: ["JEDI_AUTOTUNE", "PROTEINBIND"],
        architecture: "Computer vision library with C++ core and Python bindings, optimized algorithms, and GPU acceleration",
        integration: "JEDI AutoTune™ computer vision model optimization, ProteinBind™ molecular structure analysis and visualization",
        useCases: [
            "Computer Vision Applications",
            "Image Processing and Analysis",
            "Object Detection and Recognition",
            "Video Analysis and Processing",
            "Medical Image Analysis",
            "Scientific Research and Analysis"
        ]
    },
    
    "mongodb": {
        name: "MongoDB",
        slug: "mongodb",
        description: "Leading NoSQL document database that provides high performance, high availability, and easy scalability",
        icon: "mongodb.png",
        priority: 2,
        categorySlug: "data-engineering",
        features: "Document Database, NoSQL, High Performance, Scalability, Replication, Sharding, Indexing, Aggregation, GridFS, Atlas Cloud",
        businessMetrics: "99.9% uptime, 1M+ operations per second, 50% faster development, 60% cost reduction, enterprise-grade security",
        jediComponents: ["JEDI_RULES", "JEDI_ENSEMBLE"],
        architecture: "Document-oriented NoSQL database with horizontal scaling, replication, and sharding capabilities",
        integration: "JEDI Rules™ business logic storage, JEDI Ensemble™ knowledge base and context management",
        useCases: [
            "Document Storage and Management",
            "Real-time Analytics",
            "Content Management Systems",
            "User Profile and Session Management",
            "IoT Data Collection",
            "Big Data Processing"
        ]
    },
    
    "redis": {
        name: "Redis",
        slug: "redis",
        description: "In-memory data structure store used as database, cache, and message broker",
        icon: "redis.png",
        priority: 3,
        categorySlug: "data-engineering",
        features: "In-Memory Storage, Caching, Message Broker, Data Structures, Pub/Sub, Clustering, Persistence, High Performance, Real-time Processing",
        businessMetrics: "Sub-millisecond latency, 1M+ operations per second, 99.9% uptime, 50% faster application performance, 70% cost reduction",
        jediComponents: ["JEDI_ENSEMBLE", "JEDI_RULES"],
        architecture: "In-memory data structure store with persistence, clustering, and high availability features",
        integration: "JEDI Ensemble™ caching and session management, JEDI Rules™ real-time rule evaluation and caching",
        useCases: [
            "Application Caching",
            "Session Management",
            "Real-time Analytics",
            "Message Queuing",
            "Rate Limiting",
            "Leaderboards and Counters"
        ]
    },
    
    "docker": {
        name: "Docker",
        slug: "docker",
        description: "Containerization platform that enables developers to package applications into lightweight, portable containers",
        icon: "docker.png",
        priority: 1,
        categorySlug: "system-integration-tech",
        features: "Containerization, Application Packaging, Portability, Scalability, Microservices, DevOps, CI/CD, Security, Orchestration, Cloud Deployment",
        businessMetrics: "80% faster deployment, 50% resource utilization improvement, 90% consistency across environments, 60% cost reduction, 99.9% reliability",
        jediComponents: ["JEDI_PLATFORM"],
        architecture: "Containerization platform with Docker Engine, Docker Compose, and container orchestration capabilities",
        integration: "JEDI Platform containerized deployment and orchestration across all JEDI components",
        useCases: [
            "Application Containerization",
            "Microservices Architecture",
            "DevOps and CI/CD",
            "Cloud Migration",
            "Development Environment Standardization",
            "Scalable Application Deployment"
        ]
    },
    
    "kubernetes": {
        name: "Kubernetes",
        slug: "kubernetes",
        description: "Open-source container orchestration platform for automating deployment, scaling, and management of containerized applications",
        icon: "kubernetes.png",
        priority: 1,
        categorySlug: "system-integration-tech",
        features: "Container Orchestration, Auto-scaling, Service Discovery, Load Balancing, Rolling Updates, Health Checks, Resource Management, Multi-cloud Support",
        businessMetrics: "99.9% uptime, 90% faster scaling, 70% resource optimization, 60% operational cost reduction, enterprise-grade reliability",
        jediComponents: ["JEDI_PLATFORM"],
        architecture: "Container orchestration platform with master-worker architecture, service mesh, and cloud-native deployment",
        integration: "JEDI Platform orchestration and management of all JEDI components across cloud environments",
        useCases: [
            "Container Orchestration",
            "Microservices Management",
            "Auto-scaling Applications",
            "Multi-cloud Deployment",
            "DevOps Automation",
            "Enterprise Application Management"
        ]
    }
};

async function createTechnology(techData) {
    console.log(`\n🔧 Creating ${techData.name} (${techData.slug})...`);
    
    // Get JEDI components for this technology
    const jediIntegration = TECHNOLOGY_JEDI_INTEGRATIONS[techData.slug] || { jediComponents: [] };
    const jediComponents = jediIntegration.jediComponents.map(comp => JEDI_COMPONENTS[comp]);
    
    // Create technology mutation
    const createMutation = `
        mutation CreateTechnology(
            $name: String!
            $slug: String!
            $description: String!
            $icon: String!
            $priority: Int!
            $categorySlug: String!
            $features: String!
            $businessMetrics: String!
            $additonalDetails: String!
        ) {
            createTechnology(data: {
                name: $name
                slug: $slug
                description: $description
                icon: $icon
                priority: $priority
                category: {
                    connect: {
                        slug: $categorySlug
                    }
                }
                features: $features
                businessMetrics: $businessMetrics
                additonalDetails: $additonalDetails
            }) {
                id
                name
                slug
                description
                features
                businessMetrics
                category {
                    id
                    name
                    slug
                }
            }
        }
    `;
    
    // Create enhanced content
    const enhancedContent = `
# ${techData.name} - JEDI Integration Overview

## Overview
${techData.description}

## JEDI Integration
${jediComponents.map(comp => `
### ${comp.name}
${comp.description}

**Capabilities:**
${comp.capabilities.map(cap => `- ${cap}`).join('\n')}

**Use Cases:**
${comp.useCases.map(useCase => `- ${useCase}`).join('\n')}

**Performance Metrics:**
${Object.entries(comp.metrics).map(([key, value]) => `- ${key}: ${value}`).join('\n')}
`).join('\n')}

## Architecture
${techData.architecture}

## Integration Details
${techData.integration}

## Use Cases
${techData.useCases.map(useCase => `- ${useCase}`).join('\n')}

## Resources
- Official documentation and API references
- JEDI integration guides and tutorials
- Community support and forums
- Enterprise consulting and support
    `.trim();
    
    // Create the technology
    const createResult = await makeRequest(createMutation, {
        name: techData.name,
        slug: techData.slug,
        description: techData.description,
        icon: techData.icon,
        priority: techData.priority,
        categorySlug: techData.categorySlug,
        features: techData.features,
        businessMetrics: techData.businessMetrics,
        additonalDetails: enhancedContent
    });
    
    if (createResult.error || createResult.errors) {
        console.log(`❌ Failed to create technology: ${createResult.error || createResult.errors[0].message}`);
        return false;
    }
    
    console.log(`✅ Created ${techData.name} successfully`);
    console.log(`   - Description: ${techData.description.substring(0, 100)}...`);
    console.log(`   - Features: ${techData.features.split(',').length} items`);
    console.log(`   - Business Metrics: ${techData.businessMetrics.split(',').length} items`);
    console.log(`   - JEDI Components: ${jediComponents.length} integrated`);
    console.log(`   - Category: ${createResult.data?.createTechnology?.category?.name}`);
    
    return true;
}

async function addAllMissingTechnologies() {
    console.log('🚀 Adding Missing Technologies');
    console.log('==============================');
    
    let successCount = 0;
    let totalCount = Object.keys(MISSING_TECHNOLOGIES).length;
    
    // Add each missing technology
    for (const [techSlug, techData] of Object.entries(MISSING_TECHNOLOGIES)) {
        const success = await createTechnology(techData);
        if (success) successCount++;
    }
    
    console.log('\n✅ Missing technologies addition completed!');
    console.log('\n📊 Summary:');
    console.log(`   - Successfully created: ${successCount}/${totalCount} technologies`);
    console.log('   - Added JEDI integration examples');
    console.log('   - Connected to appropriate categories');
    console.log('   - Filled all tabs with comprehensive content');
}

// Run the addition
addAllMissingTechnologies().catch(console.error);
