#!/usr/bin/env node

/**
 * Simple Technology Schema Test
 * Tests the Hygraph GraphQL schema using fetch directly
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const ENDPOINT = process.env.VITE_HYGRAPH_ENDPOINT;
const TOKEN = process.env.VITE_HYGRAPH_TOKEN;

if (!ENDPOINT || !TOKEN) {
    console.error('❌ Missing Hygraph environment variables');
    process.exit(1);
}

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

async function testSchema() {
    console.log('🔍 Testing Technology Schema');
    console.log('============================');
    console.log(`📡 Endpoint: ${ENDPOINT}`);
    console.log(`🔑 Token: ${TOKEN.substring(0, 10)}...`);
    console.log('');
    
    // Test 1: Basic queries
    const basicTests = [
        {
            name: 'technologies (plural)',
            query: `
                query {
                    technologies(first: 3) {
                        id
                        name
                        slug
                    }
                }
            `
        },
        {
            name: 'technologyS (plural with S)',
            query: `
                query {
                    technologyS(first: 3) {
                        id
                        name
                        slug
                    }
                }
            `
        },
        {
            name: 'categories (plural)',
            query: `
                query {
                    categories(first: 3) {
                        id
                        name
                        slug
                    }
                }
            `
        }
    ];
    
    console.log('🔍 Testing basic queries...');
    for (const test of basicTests) {
        const result = await makeRequest(test.query);
        if (result.error) {
            console.log(`❌ ${test.name}: ${result.error}`);
        } else if (result.errors) {
            console.log(`❌ ${test.name}: ${result.errors[0].message}`);
        } else {
            const data = result.data[Object.keys(result.data)[0]] || [];
            console.log(`✅ ${test.name}: Found ${data.length} items`);
            if (data.length > 0) {
                console.log(`   Sample: ${data[0].name || 'Unknown'}`);
            }
        }
    }
    
    // Test 2: Field availability
    console.log('\n🔍 Testing field availability...');
    const fields = [
        'features', 'businessMetrics', 'architecture', 'integration', 
        'jediUsage', 'category', 'subcategories', 'services', 
        'primaryUses', 'metrics', 'deployment', 'compatibleWith', 
        'apis', 'documentation', 'github', 'website', 'dependencies'
    ];
    
    const availableFields = [];
    for (const field of fields) {
        const query = `
            query {
                technologies(first: 1) {
                    id
                    name
                    ${field}
                }
            }
        `;
        const result = await makeRequest(query);
        if (result.error) {
            console.log(`❌ ${field}: ${result.error}`);
        } else if (result.errors) {
            console.log(`❌ ${field}: ${result.errors[0].message}`);
        } else {
            availableFields.push(field);
            console.log(`✅ ${field}: Available`);
        }
    }
    
    console.log(`\n📊 Available fields: ${availableFields.join(', ')}`);
    
    // Test 3: Count existing data
    console.log('\n🔍 Counting existing data...');
    
    const countQuery = `
        query {
            technologiesConnection {
                aggregate {
                    count
                }
            }
        }
    `;
    const countResult = await makeRequest(countQuery);
    if (countResult.error) {
        console.log(`❌ Technology count failed: ${countResult.error}`);
    } else if (countResult.errors) {
        console.log(`❌ Technology count failed: ${countResult.errors[0].message}`);
    } else {
        const count = countResult.data?.technologiesConnection?.aggregate?.count || 0;
        console.log(`📊 Total technologies: ${count}`);
    }
    
    const categoryCountQuery = `
        query {
            categoriesConnection {
                aggregate {
                    count
                }
            }
        }
    `;
    const categoryCountResult = await makeRequest(categoryCountQuery);
    if (categoryCountResult.error) {
        console.log(`❌ Category count failed: ${categoryCountResult.error}`);
    } else if (categoryCountResult.errors) {
        console.log(`❌ Category count failed: ${categoryCountResult.errors[0].message}`);
    } else {
        const count = categoryCountResult.data?.categoriesConnection?.aggregate?.count || 0;
        console.log(`📊 Total categories: ${count}`);
    }
    
    // Test 4: Sample data structure
    console.log('\n🔍 Testing sample data structure...');
    const sampleQuery = `
        query {
            technologies(first: 1) {
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
    const sampleResult = await makeRequest(sampleQuery);
    if (sampleResult.error) {
        console.log(`❌ Sample data test failed: ${sampleResult.error}`);
    } else if (sampleResult.errors) {
        console.log(`❌ Sample data test failed: ${sampleResult.errors[0].message}`);
    } else {
        const tech = sampleResult.data?.technologies?.[0];
        if (tech) {
            console.log('✅ Sample technology structure:');
            console.log(`   ID: ${tech.id}`);
            console.log(`   Name: ${tech.name}`);
            console.log(`   Slug: ${tech.slug}`);
            console.log(`   Description: ${tech.description ? 'Present' : 'Missing'}`);
            console.log(`   Features: ${tech.features ? `${tech.features.length} items` : 'Missing'}`);
            console.log(`   Business Metrics: ${tech.businessMetrics ? `${tech.businessMetrics.length} items` : 'Missing'}`);
            console.log(`   Category: ${tech.category ? tech.category.name : 'Missing'}`);
        } else {
            console.log('❌ No technologies found');
        }
    }
    
    console.log('\n✅ Schema test completed!');
    console.log('📊 Review the results above to understand the correct schema structure');
}

// Run the test
testSchema().catch(console.error);





