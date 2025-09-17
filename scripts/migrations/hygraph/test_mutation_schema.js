#!/usr/bin/env node

/**
 * Test Technology Mutation Schema
 * Understanding the exact requirements for creating technologies
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

async function testMutationSchema() {
    console.log('🔍 Testing Technology Mutation Schema');
    console.log('=====================================');
    
    // Test 1: Minimal technology creation
    console.log('\n🔍 Testing minimal technology creation...');
    const minimalMutation = `
        mutation {
            createTechnology(data: {
                name: "Test Technology"
                slug: "test-technology-${Date.now()}"
                description: "Test description"
                icon: "test-icon"
                priority: 1
            }) {
                id
                name
                slug
                description
                icon
                priority
            }
        }
    `;
    
    const minimalResult = await makeRequest(minimalMutation);
    if (minimalResult.error) {
        console.log(`❌ Minimal mutation failed: ${minimalResult.error}`);
    } else if (minimalResult.errors) {
        console.log(`❌ Minimal mutation failed: ${minimalResult.errors[0].message}`);
    } else {
        console.log('✅ Minimal technology creation works');
        console.log(`   Created: ${minimalResult.data?.createTechnology?.name}`);
    }
    
    // Test 2: Technology with category
    console.log('\n🔍 Testing technology with category...');
    const categoryMutation = `
        mutation {
            createTechnology(data: {
                name: "Test Technology with Category"
                slug: "test-tech-category-${Date.now()}"
                description: "Test description with category"
                icon: "test-icon"
                priority: 1
                category: {
                    connect: {
                        slug: "ml"
                    }
                }
            }) {
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
    
    const categoryResult = await makeRequest(categoryMutation);
    if (categoryResult.error) {
        console.log(`❌ Category mutation failed: ${categoryResult.error}`);
    } else if (categoryResult.errors) {
        console.log(`❌ Category mutation failed: ${categoryResult.errors[0].message}`);
    } else {
        console.log('✅ Technology with category creation works');
        console.log(`   Created: ${categoryResult.data?.createTechnology?.name}`);
        console.log(`   Category: ${categoryResult.data?.createTechnology?.category?.name}`);
    }
    
    // Test 3: Technology with features and business metrics
    console.log('\n🔍 Testing technology with features and metrics...');
    const featuresMutation = `
        mutation {
            createTechnology(data: {
                name: "Test Technology with Features"
                slug: "test-tech-features-${Date.now()}"
                description: "Test description with features"
                icon: "test-icon"
                priority: 1
                features: ["Feature 1", "Feature 2", "Feature 3"]
                businessMetrics: ["Metric 1", "Metric 2", "Metric 3"]
            }) {
                id
                name
                slug
                features
                businessMetrics
            }
        }
    `;
    
    const featuresResult = await makeRequest(featuresMutation);
    if (featuresResult.error) {
        console.log(`❌ Features mutation failed: ${featuresResult.error}`);
    } else if (featuresResult.errors) {
        console.log(`❌ Features mutation failed: ${featuresResult.errors[0].message}`);
    } else {
        console.log('✅ Technology with features creation works');
        console.log(`   Created: ${featuresResult.data?.createTechnology?.name}`);
        console.log(`   Features: ${featuresResult.data?.createTechnology?.features?.length} items`);
        console.log(`   Business Metrics: ${featuresResult.data?.createTechnology?.businessMetrics?.length} items`);
    }
    
    // Test 4: Check what fields are available for update
    console.log('\n🔍 Testing technology update...');
    const updateMutation = `
        mutation {
            updateTechnology(
                where: { slug: "test-technology-${Date.now() - 1000}" }
                data: {
                    description: "Updated description"
                    features: ["Updated Feature 1", "Updated Feature 2"]
                    businessMetrics: ["Updated Metric 1", "Updated Metric 2"]
                }
            ) {
                id
                name
                slug
                description
                features
                businessMetrics
            }
        }
    `;
    
    const updateResult = await makeRequest(updateMutation);
    if (updateResult.error) {
        console.log(`❌ Update mutation failed: ${updateResult.error}`);
    } else if (updateResult.errors) {
        console.log(`❌ Update mutation failed: ${updateResult.errors[0].message}`);
    } else {
        console.log('✅ Technology update works');
        console.log(`   Updated: ${updateResult.data?.updateTechnology?.name}`);
    }
    
    // Test 5: Get schema introspection for Technology type
    console.log('\n🔍 Getting Technology type schema...');
    const introspectionQuery = `
        query {
            __type(name: "Technology") {
                name
                fields {
                    name
                    type {
                        name
                        kind
                        ofType {
                            name
                            kind
                        }
                    }
                }
            }
        }
    `;
    
    const introspectionResult = await makeRequest(introspectionQuery);
    if (introspectionResult.error) {
        console.log(`❌ Introspection failed: ${introspectionResult.error}`);
    } else if (introspectionResult.errors) {
        console.log(`❌ Introspection failed: ${introspectionResult.errors[0].message}`);
    } else {
        const techType = introspectionResult.data?.__type;
        if (techType) {
            console.log('✅ Technology type fields:');
            techType.fields.forEach(field => {
                const typeName = field.type.name || field.type.ofType?.name || 'Unknown';
                const typeKind = field.type.kind || field.type.ofType?.kind || 'Unknown';
                console.log(`   - ${field.name}: ${typeName} (${typeKind})`);
            });
        }
    }
    
    console.log('\n✅ Mutation schema test completed!');
    console.log('\n📋 Summary:');
    console.log('   - Required fields: name, slug, description, icon, priority');
    console.log('   - Optional fields: category, features, businessMetrics');
    console.log('   - Use "technologyS" for queries');
    console.log('   - Use "createTechnology" for mutations');
    console.log('   - Use "updateTechnology" for updates');
}

// Run the test
testMutationSchema().catch(console.error);


