#!/usr/bin/env node

/**
 * Technology Tabs Audit
 * Comprehensive audit of technology detail pages to identify:
 * 1. What data exists in Hygraph for each technology
 * 2. What tabs are empty and why
 * 3. How to populate empty tabs with existing data
 * 4. Mapping between Hygraph fields and UI tabs
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import fs from 'fs';

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
            },
            body: JSON.stringify({ query, variables })
        });
        
        const result = await response.json();
        if (result.errors) {
            console.error('GraphQL Errors:', result.errors);
            return { error: result.errors[0].message, errors: result.errors };
        }
        return result.data || result;
    } catch (error) {
        return { error: error.message };
    }
}

// Comprehensive query to get all technology data
const GET_ALL_TECHNOLOGIES_DETAILED = `
  query GetAllTechnologiesDetailed {
    technologyS(first: 200, orderBy: priority_ASC) {
      id
      name
      slug
      description
      icon
      priority
      stage
      
      # Content fields
      features
      businessMetrics
      additonalDetails
      
      # Relations
      category {
        id
        name
        slug
      }
      subcategories {
        id
        name
        slug
      }
      
      # Tab-specific data - useCases relation
      useCases {
        id
        title
        slug
        description
        architecture {
          id
          description
          components {
            id
            name
            description
            details
            explanation
          }
          flow {
            id
            step
            description
            details
          }
        }
        industry {
          id
          name
          slug
        }
      }
    }
  }
`;

// Get categories and subcategories structure
const GET_CATEGORIES_STRUCTURE = `
  query GetCategoriesStructure {
    categories {
      id
      name
      slug
      technologies {
        id
        name
        slug
      }
      technologySubcategory {
        id
        name
        slug
        technology {
          id
          name
          slug
        }
      }
    }
  }
`;

async function auditTechnologyTabs() {
    console.log('🔍 Technology Tabs Comprehensive Audit');
    console.log('========================================\n');
    
    // Fetch all technologies
    console.log('📊 Fetching all technologies from Hygraph...');
    const techResult = await makeRequest(GET_ALL_TECHNOLOGIES_DETAILED);
    
    if (techResult.error) {
        console.error('❌ Error fetching technologies:', techResult.error);
        return;
    }
    
    const technologies = techResult.technologyS || [];
    console.log(`✅ Found ${technologies.length} technologies\n`);
    
    // Fetch category structure
    console.log('📊 Fetching category structure...');
    const categoryResult = await makeRequest(GET_CATEGORIES_STRUCTURE);
    const categories = categoryResult.categories || [];
    console.log(`✅ Found ${categories.length} categories\n`);
    
    // Analyze each technology
    const auditResults = {
        totalTechnologies: technologies.length,
        technologies: [],
        tabAnalysis: {
            overview: { hasData: 0, missingData: 0 },
            features: { hasData: 0, missingData: 0 },
            architecture: { hasData: 0, missingData: 0 },
            integration: { hasData: 0, missingData: 0 },
            useCases: { hasData: 0, missingData: 0 },
            resources: { hasData: 0, missingData: 0 }
        },
        categoryBreakdown: {},
        subcategoryBreakdown: {}
    };
    
    console.log('🔍 Analyzing each technology...\n');
    
    technologies.forEach((tech, index) => {
        const analysis = {
            id: tech.id,
            name: tech.name,
            slug: tech.slug,
            category: tech.category?.name || 'Uncategorized',
            subcategories: tech.subcategories?.map(s => s.name) || [],
            tabs: {
                overview: {
                    hasData: false,
                    dataSources: [],
                    missingFields: []
                },
                features: {
                    hasData: false,
                    dataSources: [],
                    missingFields: []
                },
                architecture: {
                    hasData: false,
                    dataSources: [],
                    missingFields: []
                },
                integration: {
                    hasData: false,
                    dataSources: [],
                    missingFields: []
                },
                useCases: {
                    hasData: false,
                    dataSources: [],
                    missingFields: []
                },
                resources: {
                    hasData: false,
                    dataSources: [],
                    missingFields: []
                }
            },
            contentStatus: {
                hasDescription: !!tech.description,
                hasFeatures: !!tech.features,
                hasBusinessMetrics: !!tech.businessMetrics,
                hasAdditionalDetails: !!tech.additonalDetails,
                hasUseCases: (tech.useCases?.length || 0) > 0,
                hasDocumentation: !!tech.documentation,
                hasGithub: !!tech.github,
                hasWebsite: !!tech.website
            }
        };
        
        // Overview Tab Analysis
        if (tech.description || tech.category || tech.subcategories?.length > 0 || tech.metrics?.length > 0 || tech.deployment) {
            analysis.tabs.overview.hasData = true;
            if (tech.description) analysis.tabs.overview.dataSources.push('description');
            if (tech.category) analysis.tabs.overview.dataSources.push('category');
            if (tech.subcategories?.length > 0) analysis.tabs.overview.dataSources.push('subcategories');
            if (tech.metrics?.length > 0) analysis.tabs.overview.dataSources.push('metrics');
            if (tech.deployment) analysis.tabs.overview.dataSources.push('deployment');
            auditResults.tabAnalysis.overview.hasData++;
        } else {
            auditResults.tabAnalysis.overview.missingData++;
            analysis.tabs.overview.missingFields.push('description', 'category', 'metrics', 'deployment');
        }
        
        // Features Tab Analysis
        if (tech.features || tech.primaryUses?.length > 0 || tech.services?.length > 0) {
            analysis.tabs.features.hasData = true;
            if (tech.features) analysis.tabs.features.dataSources.push('features');
            if (tech.primaryUses?.length > 0) analysis.tabs.features.dataSources.push('primaryUses');
            if (tech.services?.length > 0) analysis.tabs.features.dataSources.push('services');
            auditResults.tabAnalysis.features.hasData++;
        } else {
            auditResults.tabAnalysis.features.missingData++;
            analysis.tabs.features.missingFields.push('features', 'primaryUses', 'services');
        }
        
        // Architecture Tab Analysis
        const hasArchitecture = tech.useCases?.some(uc => uc.architecture) || false;
        if (hasArchitecture) {
            analysis.tabs.architecture.hasData = true;
            analysis.tabs.architecture.dataSources.push('useCases.architecture');
            auditResults.tabAnalysis.architecture.hasData++;
        } else {
            auditResults.tabAnalysis.architecture.missingData++;
            analysis.tabs.architecture.missingFields.push('architecture (from useCases)');
        }
        
        // Integration Tab Analysis
        if (tech.documentation || tech.github || tech.website) {
            analysis.tabs.integration.hasData = true;
            if (tech.documentation) analysis.tabs.integration.dataSources.push('documentation');
            if (tech.github) analysis.tabs.integration.dataSources.push('github');
            if (tech.website) analysis.tabs.integration.dataSources.push('website');
            auditResults.tabAnalysis.integration.hasData++;
        } else {
            auditResults.tabAnalysis.integration.missingData++;
            analysis.tabs.integration.missingFields.push('documentation', 'github', 'website');
        }
        
        // Use Cases Tab Analysis
        if (tech.useCases?.length > 0) {
            analysis.tabs.useCases.hasData = true;
            analysis.tabs.useCases.dataSources.push(`useCases (${tech.useCases.length} cases)`);
            auditResults.tabAnalysis.useCases.hasData++;
        } else {
            auditResults.tabAnalysis.useCases.missingData++;
            analysis.tabs.useCases.missingFields.push('useCases');
        }
        
        // Resources Tab Analysis
        if (tech.documentation || tech.github || tech.website) {
            analysis.tabs.resources.hasData = true;
            if (tech.documentation) analysis.tabs.resources.dataSources.push('documentation');
            if (tech.github) analysis.tabs.resources.dataSources.push('github');
            if (tech.website) analysis.tabs.resources.dataSources.push('website');
            auditResults.tabAnalysis.resources.hasData++;
        } else {
            auditResults.tabAnalysis.resources.missingData++;
            analysis.tabs.resources.missingFields.push('documentation', 'github', 'website');
        }
        
        auditResults.technologies.push(analysis);
        
        // Category breakdown
        const categoryName = tech.category?.name || 'Uncategorized';
        if (!auditResults.categoryBreakdown[categoryName]) {
            auditResults.categoryBreakdown[categoryName] = {
                total: 0,
                withContent: 0,
                withoutContent: 0
            };
        }
        auditResults.categoryBreakdown[categoryName].total++;
        if (analysis.contentStatus.hasDescription && analysis.contentStatus.hasFeatures) {
            auditResults.categoryBreakdown[categoryName].withContent++;
        } else {
            auditResults.categoryBreakdown[categoryName].withoutContent++;
        }
    });
    
    // Generate report
    console.log('\n📊 AUDIT RESULTS');
    console.log('=================\n');
    
    console.log(`Total Technologies: ${auditResults.totalTechnologies}\n`);
    
    console.log('📑 Tab Analysis:');
    console.log('─'.repeat(50));
    Object.entries(auditResults.tabAnalysis).forEach(([tab, stats]) => {
        const percentage = ((stats.hasData / auditResults.totalTechnologies) * 100).toFixed(1);
        console.log(`${tab.toUpperCase().padEnd(15)}: ${stats.hasData.toString().padStart(3)} with data, ${stats.missingData.toString().padStart(3)} missing (${percentage}% complete)`);
    });
    
    console.log('\n📂 Category Breakdown:');
    console.log('─'.repeat(50));
    Object.entries(auditResults.categoryBreakdown)
        .sort((a, b) => b[1].total - a[1].total)
        .forEach(([category, stats]) => {
            const completion = ((stats.withContent / stats.total) * 100).toFixed(1);
            console.log(`${category.padEnd(25)}: ${stats.total.toString().padStart(3)} techs, ${stats.withContent.toString().padStart(3)} with content (${completion}% complete)`);
        });
    
    // Find technologies with empty tabs
    console.log('\n❌ Technologies with Empty Tabs:');
    console.log('─'.repeat(50));
    const emptyTabTechs = auditResults.technologies.filter(tech => {
        const emptyTabs = Object.entries(tech.tabs).filter(([_, tab]) => !tab.hasData);
        return emptyTabs.length > 0;
    });
    
    emptyTabTechs.slice(0, 20).forEach(tech => {
        const emptyTabs = Object.entries(tech.tabs)
            .filter(([_, tab]) => !tab.hasData)
            .map(([name, _]) => name);
        console.log(`${tech.name.padEnd(30)} (${tech.category}): Missing ${emptyTabs.join(', ')}`);
    });
    
    if (emptyTabTechs.length > 20) {
        console.log(`\n... and ${emptyTabTechs.length - 20} more technologies with empty tabs`);
    }
    
    // Example: Weaviate analysis
    console.log('\n🔍 Example: Weaviate Analysis');
    console.log('─'.repeat(50));
    const weaviate = auditResults.technologies.find(t => t.slug === 'weaviate');
    if (weaviate) {
        console.log(`Name: ${weaviate.name}`);
        console.log(`Category: ${weaviate.category}`);
        console.log(`Subcategories: ${weaviate.subcategories.join(', ') || 'None'}`);
        console.log('\nTab Status:');
        Object.entries(weaviate.tabs).forEach(([tab, data]) => {
            const status = data.hasData ? '✅' : '❌';
            console.log(`  ${status} ${tab}: ${data.hasData ? data.dataSources.join(', ') : 'No data'}`);
            if (!data.hasData && data.missingFields.length > 0) {
                console.log(`     Missing: ${data.missingFields.join(', ')}`);
            }
        });
        console.log('\nContent Status:');
        Object.entries(weaviate.contentStatus).forEach(([field, hasData]) => {
            const status = hasData ? '✅' : '❌';
            console.log(`  ${status} ${field}`);
        });
    } else {
        console.log('Weaviate not found in technologies');
    }
    
    // Save detailed report
    const reportFile = 'technology_tabs_audit_report.json';
    fs.writeFileSync(reportFile, JSON.stringify(auditResults, null, 2));
    console.log(`\n✅ Detailed report saved to: ${reportFile}`);
    
    // Generate recommendations
    console.log('\n💡 RECOMMENDATIONS');
    console.log('─'.repeat(50));
    console.log('\n1. Overview Tab:');
    console.log('   - All technologies have description (required field)');
    console.log('   - Add metrics and deployment info for better overview');
    console.log('   - Use category and subcategories for navigation');
    
    console.log('\n2. Features Tab:');
    console.log('   - Populate "features" field (comma-separated string)');
    console.log('   - Add primaryUses and services if schema supports them');
    console.log('   - Can parse features from additonalDetails if needed');
    
    console.log('\n3. Architecture Tab:');
    console.log('   - Architecture comes from useCases.architecture');
    console.log('   - Connect technologies to use cases that have architecture');
    console.log('   - Or create architecture data directly on technology');
    
    console.log('\n4. Integration Tab:');
    console.log('   - Add documentation, github, website URLs');
    console.log('   - These are simple string fields in Hygraph');
    
    console.log('\n5. Use Cases Tab:');
    console.log('   - Connect technologies to existing use cases');
    console.log('   - Use useCases relation field');
    
    console.log('\n6. Resources Tab:');
    console.log('   - Same as Integration tab (documentation, github, website)');
    console.log('   - Can be populated from same fields');
    
    return auditResults;
}

// Run the audit
auditTechnologyTabs()
    .then(() => {
        console.log('\n✅ Audit completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Audit failed:', error);
        process.exit(1);
    });

