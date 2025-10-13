#!/usr/bin/env node

/**
 * Query Category Technologies
 * Get detailed information about what technologies are connected to each category
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const ENDPOINT = process.env.VITE_HYGRAPH_ENDPOINT;
const TOKEN = process.env.VITE_HYGRAPH_TOKEN;

async function makeRequest(query) {
    try {
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`,
                'gcms-stage': 'DRAFT'
            },
            body: JSON.stringify({ query })
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        return { error: error.message };
    }
}

async function queryCategoryTechnologies() {
    console.log('🔍 Querying Category Technologies');
    console.log('=================================');
    
    // First, get all categories
    const categoriesQuery = `
        query {
            categories(first: 20) {
                id
                name
                slug
                description
            }
        }
    `;
    
    const categoriesResult = await makeRequest(categoriesQuery);
    if (categoriesResult.error) {
        console.log(`❌ Categories query failed: ${categoriesResult.error}`);
        return;
    }
    
    const categories = categoriesResult.data?.categories || [];
    console.log(`📊 Found ${categories.length} categories\n`);
    
    // Query each category for its technologies
    for (const category of categories) {
        console.log(`🔍 Category: ${category.name} (${category.slug})`);
        console.log('─'.repeat(50));
        
        const categoryTechQuery = `
            query {
                categories(where: { slug: "${category.slug}" }) {
                    id
                    name
                    slug
                    description
                    technologies {
                        id
                        name
                        slug
                        description
                        features
                        businessMetrics
                        priority
                    }
                }
            }
        `;
        
        const techResult = await makeRequest(categoryTechQuery);
        if (techResult.error) {
            console.log(`❌ Query failed: ${techResult.error}`);
        } else if (techResult.errors) {
            console.log(`❌ Query failed: ${techResult.errors[0].message}`);
        } else {
            const categoryData = techResult.data?.categories?.[0];
            if (categoryData && categoryData.technologies) {
                const technologies = categoryData.technologies;
                console.log(`   Technologies: ${technologies.length}`);
                
                if (technologies.length > 0) {
                    technologies.forEach((tech, index) => {
                        console.log(`   ${index + 1}. ${tech.name} (${tech.slug})`);
                        console.log(`      Description: ${tech.description ? tech.description.substring(0, 100) + '...' : 'Missing'}`);
                        console.log(`      Features: ${tech.features ? tech.features.split(',').length + ' items' : 'Missing'}`);
                        console.log(`      Business Metrics: ${tech.businessMetrics ? tech.businessMetrics.split(',').length + ' items' : 'Missing'}`);
                        console.log(`      Priority: ${tech.priority || 'Not set'}`);
                        console.log('');
                    });
                } else {
                    console.log('   No technologies connected');
                }
            } else {
                console.log('   No category data found');
            }
        }
        
        console.log(''); // Empty line between categories
    }
    
    // Also query all technologies to see which ones don't have categories
    console.log('🔍 Technologies Without Categories');
    console.log('==================================');
    
    const allTechQuery = `
        query {
            technologyS(first: 20) {
                id
                name
                slug
                description
                category {
                    id
                    name
                    slug
                }
            }
        }
    `;
    
    const allTechResult = await makeRequest(allTechQuery);
    if (allTechResult.error) {
        console.log(`❌ All technologies query failed: ${allTechResult.error}`);
    } else if (allTechResult.errors) {
        console.log(`❌ All technologies query failed: ${allTechResult.errors[0].message}`);
    } else {
        const allTechnologies = allTechResult.data?.technologyS || [];
        const uncategorized = allTechnologies.filter(tech => !tech.category);
        
        console.log(`📊 Total technologies: ${allTechnologies.length}`);
        console.log(`📊 Uncategorized technologies: ${uncategorized.length}`);
        
        if (uncategorized.length > 0) {
            console.log('\nUncategorized technologies:');
            uncategorized.forEach((tech, index) => {
                console.log(`   ${index + 1}. ${tech.name} (${tech.slug})`);
            });
        }
    }
    
    console.log('\n✅ Category technology query completed!');
}

// Run the query
queryCategoryTechnologies().catch(console.error);



