#!/usr/bin/env node

/**
 * Test Weaviate Technology Data
 * Query Weaviate specifically to see what data exists and what's missing
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

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

// Test query matching what the component expects
const GET_WEAVIATE_DETAILS = `
  query GetWeaviateDetails {
    technology(where: { slug: "weaviate" }) {
      id
      name
      slug
      description
      icon {
        url
      }
      category {
        id
        name
        slug
        technologies(where: { NOT: { slug: "weaviate" } }, first: 5) {
          id
          name
          slug
          description
          icon {
            url
          }
        }
      }
      subcategories {
        id
        name
        slug
        technologies(where: { NOT: { slug: "weaviate" } }, first: 5) {
          id
          name
          slug
          description
          icon {
            url
          }
        }
      }
      features {
        id
        title
        description
      }
      services {
        id
        name
        description
      }
      primaryUses {
        id
        name
        description
      }
      metrics {
        id
        name
        value
        description
      }
      deployment {
        id
        type
        details
      }
      documentation
      github
      website
      useCases {
        id
        title
        slug
        description
        queries
        capabilities
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
        implementation
        technologies {
          id
          name
          slug
          icon {
            url
          }
          description
        }
        industry {
          id
          name
          slug
          description
        }
      }
    }
  }
`;

// Also test with technologyS (plural) to see what fields actually exist
const GET_WEAVIATE_PLURAL = `
  query GetWeaviatePlural {
    technologyS(where: { slug: "weaviate" }, first: 1) {
      id
      name
      slug
      description
      icon
      features
      businessMetrics
      additonalDetails
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
      useCases {
        id
        title
        slug
      }
    }
  }
`;

async function testWeaviateData() {
    console.log('🔍 Testing Weaviate Technology Data');
    console.log('====================================\n');
    
    // Test with technology (singular) - what component uses
    console.log('📊 Testing with technology (singular) query...');
    const result1 = await makeRequest(GET_WEAVIATE_DETAILS);
    
    if (result1.error) {
        console.log('❌ Error with technology (singular) query:', result1.error);
        if (result1.errors) {
            result1.errors.forEach(err => {
                console.log(`   - ${err.message}`);
            });
        }
    } else {
        const tech = result1.technology;
        if (tech) {
            console.log('✅ Technology found:', tech.name);
            console.log('\n📋 Available Data:');
            console.log(`   Description: ${tech.description ? '✅' : '❌'}`);
            console.log(`   Category: ${tech.category ? `✅ ${tech.category.name}` : '❌'}`);
            console.log(`   Subcategories: ${tech.subcategories?.length || 0}`);
            console.log(`   Features (relation): ${tech.features?.length || 0}`);
            console.log(`   Services (relation): ${tech.services?.length || 0}`);
            console.log(`   Primary Uses (relation): ${tech.primaryUses?.length || 0}`);
            console.log(`   Metrics (relation): ${tech.metrics?.length || 0}`);
            console.log(`   Deployment (relation): ${tech.deployment ? '✅' : '❌'}`);
            console.log(`   Documentation (string): ${tech.documentation ? '✅' : '❌'}`);
            console.log(`   GitHub (string): ${tech.github ? '✅' : '❌'}`);
            console.log(`   Website (string): ${tech.website ? '✅' : '❌'}`);
            console.log(`   Use Cases: ${tech.useCases?.length || 0}`);
        } else {
            console.log('❌ Technology not found');
        }
    }
    
    console.log('\n📊 Testing with technologyS (plural) query...');
    const result2 = await makeRequest(GET_WEAVIATE_PLURAL);
    
    if (result2.error) {
        console.log('❌ Error with technologyS (plural) query:', result2.error);
    } else {
        const techs = result2.technologyS || [];
        if (techs.length > 0) {
            const tech = techs[0];
            console.log('✅ Technology found:', tech.name);
            console.log('\n📋 Available Data:');
            console.log(`   Description: ${tech.description ? '✅' : '❌'}`);
            console.log(`   Features (string): ${tech.features ? `✅ (${tech.features.length} chars)` : '❌'}`);
            console.log(`   Business Metrics (string): ${tech.businessMetrics ? `✅ (${tech.businessMetrics.length} chars)` : '❌'}`);
            console.log(`   Additional Details (string): ${tech.additonalDetails ? `✅ (${tech.additonalDetails.length} chars)` : '❌'}`);
            console.log(`   Category: ${tech.category ? `✅ ${tech.category.name}` : '❌'}`);
            console.log(`   Subcategories: ${tech.subcategories?.length || 0}`);
            console.log(`   Use Cases: ${tech.useCases?.length || 0}`);
            
            if (tech.features) {
                console.log(`\n   Features Preview: ${tech.features.substring(0, 150)}...`);
            }
            if (tech.businessMetrics) {
                console.log(`\n   Business Metrics Preview: ${tech.businessMetrics.substring(0, 150)}...`);
            }
        } else {
            console.log('❌ Technology not found');
        }
    }
}

testWeaviateData()
    .then(() => {
        console.log('\n✅ Test completed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Test failed:', error);
        process.exit(1);
    });

