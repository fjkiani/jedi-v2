#!/usr/bin/env node

/**
 * Fetch All Technologies
 * Comprehensive script to fetch ALL technologies from Hygraph with full details
 * Includes subtechnologies and all related data
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

async function fetchAllTechnologies() {
    console.log('🔍 Fetching ALL Technologies from Hygraph');
    console.log('==========================================');
    
    // First, get total count
    const countQuery = `
        query {
            technologySConnection {
                aggregate {
                    count
                }
            }
        }
    `;
    
    const countResult = await makeRequest(countQuery);
    if (countResult.error) {
        console.log(`❌ Count query failed: ${countResult.error}`);
        return;
    }
    
    const totalCount = countResult.data?.technologySConnection?.aggregate?.count || 0;
    console.log(`📊 Total technologies in system: ${totalCount}\n`);
    
    // Fetch all technologies with core details
    const allTechnologiesQuery = `
        query GetAllTechnologies($first: Int!, $skip: Int!) {
            technologyS(first: $first, skip: $skip, orderBy: priority_ASC) {
                id
                name
                slug
                description
                icon
                priority
                stage
                features
                businessMetrics
                additonalDetails
                
                # Category information
                category {
                    id
                    name
                    slug
                    description
                }
                
                # System fields
                publishedAt
                updatedAt
                createdAt
            }
        }
    `;
    
    const batchSize = 50; // Process in batches to avoid rate limits
    const allTechnologies = [];
    let skip = 0;
    let hasMore = true;
    
    while (hasMore) {
        console.log(`📥 Fetching batch ${Math.floor(skip / batchSize) + 1} (${skip + 1}-${Math.min(skip + batchSize, totalCount)})...`);
        
        const batchResult = await makeRequest(allTechnologiesQuery, {
            first: batchSize,
            skip: skip
        });
        
        if (batchResult.error) {
            console.log(`❌ Batch query failed: ${batchResult.error}`);
            break;
        }
        
        if (batchResult.errors) {
            console.log(`❌ Batch query failed: ${batchResult.errors[0].message}`);
            break;
        }
        
        const batch = batchResult.data?.technologyS || [];
        allTechnologies.push(...batch);
        
        console.log(`   ✅ Fetched ${batch.length} technologies`);
        
        if (batch.length < batchSize) {
            hasMore = false;
        } else {
            skip += batchSize;
            // Small delay to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    console.log(`\n📊 Successfully fetched ${allTechnologies.length} technologies\n`);
    
    // Analyze the data
    console.log('📈 Technology Analysis');
    console.log('====================');
    
    // Count by category
    const categoryCounts = {};
    const missingContent = {
        features: 0,
        businessMetrics: 0,
        additonalDetails: 0,
        category: 0
    };
    
    allTechnologies.forEach(tech => {
        // Category analysis
        if (tech.category) {
            const categoryName = tech.category.name;
            categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
        } else {
            missingContent.category++;
        }
        
        // Content analysis
        if (!tech.features || tech.features.trim() === '') missingContent.features++;
        if (!tech.businessMetrics || tech.businessMetrics.trim() === '') missingContent.businessMetrics++;
        if (!tech.additonalDetails || tech.additonalDetails.trim() === '') missingContent.additonalDetails++;
    });
    
    console.log('📊 Technologies by Category:');
    Object.entries(categoryCounts)
        .sort(([,a], [,b]) => b - a)
        .forEach(([category, count]) => {
            console.log(`   ${category}: ${count} technologies`);
        });
    
    console.log('\n📊 Missing Content Analysis:');
    console.log(`   Missing features: ${missingContent.features}`);
    console.log(`   Missing business metrics: ${missingContent.businessMetrics}`);
    console.log(`   Missing additional details: ${missingContent.additonalDetails}`);
    console.log(`   Missing category: ${missingContent.category}`);
    
    // Identify technologies needing enhancement
    console.log('\n🎯 Technologies Needing Enhancement:');
    console.log('=====================================');
    
    const needsEnhancement = allTechnologies.filter(tech => 
        !tech.features || 
        !tech.businessMetrics || 
        !tech.additonalDetails ||
        !tech.category
    );
    
    console.log(`📊 ${needsEnhancement.length} technologies need enhancement:`);
    needsEnhancement.forEach((tech, index) => {
        const missing = [];
        if (!tech.features) missing.push('features');
        if (!tech.businessMetrics) missing.push('business metrics');
        if (!tech.additonalDetails) missing.push('additional details');
        if (!tech.category) missing.push('category');
        
        console.log(`   ${index + 1}. ${tech.name} (${tech.slug})`);
        console.log(`      Missing: ${missing.join(', ')}`);
        console.log(`      Category: ${tech.category?.name || 'None'}`);
        console.log('');
    });
    
    // Save raw data to file
    const outputFile = 'all_technologies_raw.json';
    fs.writeFileSync(outputFile, JSON.stringify(allTechnologies, null, 2));
    console.log(`💾 Raw data saved to: ${outputFile}`);
    
    // Create enhancement-ready data structure
    const enhancementData = allTechnologies.map(tech => ({
        id: tech.id,
        name: tech.name,
        slug: tech.slug,
        currentContent: {
            description: tech.description,
            features: tech.features,
            businessMetrics: tech.businessMetrics,
            additonalDetails: tech.additonalDetails
        },
        relationships: {
            category: tech.category
        },
        needsEnhancement: {
            features: !tech.features || tech.features.trim() === '',
            businessMetrics: !tech.businessMetrics || tech.businessMetrics.trim() === '',
            additonalDetails: !tech.additonalDetails || tech.additonalDetails.trim() === '',
            category: !tech.category
        },
        priority: tech.priority,
        stage: tech.stage
    }));
    
    const enhancementFile = 'technologies_for_enhancement.json';
    fs.writeFileSync(enhancementFile, JSON.stringify(enhancementData, null, 2));
    console.log(`🎯 Enhancement data saved to: ${enhancementFile}`);
    
    console.log('\n✅ Technology fetch completed!');
    console.log('\n🚀 Next Steps:');
    console.log('1. Review the enhancement data file');
    console.log('2. Create JEDI-specific content for each technology');
    console.log('3. Update technologies in Hygraph with enhanced content');
    console.log('4. Test technology pages to ensure content displays correctly');
}

// Run the fetch
fetchAllTechnologies().catch(console.error);
