#!/usr/bin/env node

/**
 * Technology Schema Test Script
 * Tests the Hygraph GraphQL schema for technologies
 */

import { hygraphClient } from '../../../src/lib/hygraph.js';

async function testSchema() {
    console.log('🔍 Testing Technology Schema');
    console.log('============================');
    
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
    
    console.log('\n🔍 Testing basic queries...');
    for (const test of basicTests) {
        try {
            const result = await hygraphClient.request(test.query);
            const data = result[Object.keys(result)[0]] || [];
            console.log(`✅ ${test.name}: Found ${data.length} items`);
            if (data.length > 0) {
                console.log(`   Sample: ${data[0].name || 'Unknown'}`);
            }
        } catch (error) {
            console.log(`❌ ${test.name}: ${error.message}`);
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
        try {
            const query = `
                query {
                    technologies(first: 1) {
                        id
                        name
                        ${field}
                    }
                }
            `;
            await hygraphClient.request(query);
            availableFields.push(field);
            console.log(`✅ ${field}: Available`);
        } catch (error) {
            console.log(`❌ ${field}: ${error.message.split('\n')[0]}`);
        }
    }
    
    console.log(`\n📊 Available fields: ${availableFields.join(', ')}`);
    
    // Test 3: Count existing data
    console.log('\n🔍 Counting existing data...');
    
    try {
        const countQuery = `
            query {
                technologiesConnection {
                    aggregate {
                        count
                    }
                }
            }
        `;
        const result = await hygraphClient.request(countQuery);
        const count = result.technologiesConnection?.aggregate?.count || 0;
        console.log(`📊 Total technologies: ${count}`);
    } catch (error) {
        console.log(`❌ Technology count failed: ${error.message}`);
    }
    
    try {
        const countQuery = `
            query {
                categoriesConnection {
                    aggregate {
                        count
                    }
                }
            }
        `;
        const result = await hygraphClient.request(countQuery);
        const count = result.categoriesConnection?.aggregate?.count || 0;
        console.log(`📊 Total categories: ${count}`);
    } catch (error) {
        console.log(`❌ Category count failed: ${error.message}`);
    }
    
    // Test 4: Sample data structure
    console.log('\n🔍 Testing sample data structure...');
    try {
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
        const result = await hygraphClient.request(sampleQuery);
        const tech = result.technologies?.[0];
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
    } catch (error) {
        console.log(`❌ Sample data test failed: ${error.message}`);
    }
    
    console.log('\n✅ Schema test completed!');
    console.log('📊 Review the results above to understand the correct schema structure');
}

// Run the test
testSchema().catch(console.error);
