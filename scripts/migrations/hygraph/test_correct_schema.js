#!/usr/bin/env node

/**
 * Test Correct Technology Schema
 * Based on the test results, we know:
 * - Use 'technologyS' (plural with S) not 'technologies'
 * - Use 'categories' (plural) for categories
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

async function testCorrectSchema() {
    console.log('🔍 Testing Correct Technology Schema');
    console.log('====================================');
    
    // Test 1: Get existing technologies
    console.log('\n🔍 Testing technologyS query...');
    const techQuery = `
        query {
            technologyS(first: 5) {
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
    
    const techResult = await makeRequest(techQuery);
    if (techResult.error) {
        console.log(`❌ Technology query failed: ${techResult.error}`);
    } else if (techResult.errors) {
        console.log(`❌ Technology query failed: ${techResult.errors[0].message}`);
    } else {
        const technologies = techResult.data?.technologyS || [];
        console.log(`✅ Found ${technologies.length} technologies`);
        
        if (technologies.length > 0) {
            console.log('\n📊 Sample technologies:');
            technologies.forEach((tech, index) => {
                console.log(`   ${index + 1}. ${tech.name} (${tech.slug})`);
                console.log(`      Description: ${tech.description ? 'Present' : 'Missing'}`);
                console.log(`      Features: ${tech.features ? `${tech.features.length} items` : 'Missing'}`);
                console.log(`      Business Metrics: ${tech.businessMetrics ? `${tech.businessMetrics.length} items` : 'Missing'}`);
                console.log(`      Category: ${tech.category ? tech.category.name : 'Missing'}`);
                console.log('');
            });
        }
    }
    
    // Test 2: Get existing categories
    console.log('🔍 Testing categories query...');
    const categoryQuery = `
        query {
            categories(first: 10) {
                id
                name
                slug
                description
                technologies {
                    id
                    name
                    slug
                }
            }
        }
    `;
    
    const categoryResult = await makeRequest(categoryQuery);
    if (categoryResult.error) {
        console.log(`❌ Category query failed: ${categoryResult.error}`);
    } else if (categoryResult.errors) {
        console.log(`❌ Category query failed: ${categoryResult.errors[0].message}`);
    } else {
        const categories = categoryResult.data?.categories || [];
        console.log(`✅ Found ${categories.length} categories`);
        
        if (categories.length > 0) {
            console.log('\n📊 Categories with technologies:');
            categories.forEach((category, index) => {
                const techCount = category.technologies ? category.technologies.length : 0;
                console.log(`   ${index + 1}. ${category.name} (${category.slug}) - ${techCount} technologies`);
                if (category.technologies && category.technologies.length > 0) {
                    console.log(`      Technologies: ${category.technologies.map(t => t.name).join(', ')}`);
                }
            });
        }
    }
    
    // Test 3: Test specific technology fields
    console.log('\n🔍 Testing technology fields...');
    const fieldQuery = `
        query {
            technologyS(first: 1) {
                id
                name
                slug
                description
                features
                businessMetrics
                architecture
                integration
                jediUsage
                category {
                    id
                    name
                    slug
                }
                subcategories
                services
                primaryUses
                metrics
                deployment
                compatibleWith
                apis
                documentation
                github
                website
                dependencies
            }
        }
    `;
    
    const fieldResult = await makeRequest(fieldQuery);
    if (fieldResult.error) {
        console.log(`❌ Field test failed: ${fieldResult.error}`);
    } else if (fieldResult.errors) {
        console.log(`❌ Field test failed: ${fieldResult.errors[0].message}`);
    } else {
        const tech = fieldResult.data?.technologyS?.[0];
        if (tech) {
            console.log('✅ Technology field structure:');
            const fields = [
                'features', 'businessMetrics', 'architecture', 'integration', 
                'jediUsage', 'subcategories', 'services', 'primaryUses', 
                'metrics', 'deployment', 'compatibleWith', 'apis', 
                'documentation', 'github', 'website', 'dependencies'
            ];
            
            fields.forEach(field => {
                const value = tech[field];
                if (value !== undefined && value !== null) {
                    if (Array.isArray(value)) {
                        console.log(`   ✅ ${field}: Array with ${value.length} items`);
                    } else if (typeof value === 'string') {
                        console.log(`   ✅ ${field}: String (${value.length} chars)`);
                    } else {
                        console.log(`   ✅ ${field}: ${typeof value}`);
                    }
                } else {
                    console.log(`   ❌ ${field}: Not available`);
                }
            });
        }
    }
    
    // Test 4: Test mutations
    console.log('\n🔍 Testing mutation schema...');
    const mutationQuery = `
        mutation {
            createTechnology(data: {
                name: "Test Technology"
                slug: "test-technology-${Date.now()}"
                description: "Test description"
            }) {
                id
                name
                slug
            }
        }
    `;
    
    const mutationResult = await makeRequest(mutationQuery);
    if (mutationResult.error) {
        console.log(`❌ Mutation test failed: ${mutationResult.error}`);
    } else if (mutationResult.errors) {
        console.log(`❌ Mutation test failed: ${mutationResult.errors[0].message}`);
    } else {
        console.log('✅ Technology creation mutation works');
        console.log(`   Created: ${mutationResult.data?.createTechnology?.name}`);
    }
    
    console.log('\n✅ Schema test completed!');
    console.log('\n📋 Summary:');
    console.log('   - Use "technologyS" (plural with S) for technologies');
    console.log('   - Use "categories" (plural) for categories');
    console.log('   - Technologies can be created via mutations');
    console.log('   - Check which fields are available for enhancement');
}

// Run the test
testCorrectSchema().catch(console.error);


