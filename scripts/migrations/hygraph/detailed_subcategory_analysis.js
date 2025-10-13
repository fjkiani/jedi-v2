#!/usr/bin/env node

/**
 * Detailed Subcategory Technology Analysis
 * Analyze specific technologies in high-priority subcategories
 * Gather detailed information about missing content and enhancement opportunities
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

async function analyzeHighPrioritySubcategories() {
    console.log('🔍 Detailed Analysis of High-Priority Subcategories');
    console.log('===================================================');
    
    // High-priority subcategories to analyze
    const highPrioritySubcategories = [
        'structured-data',
        'unstructured-data', 
        'streaming-data',
        'api-data-sources',
        'data-ingestion',
        'security'
    ];
    
    const detailedAnalysis = {};
    
    for (const subcategorySlug of highPrioritySubcategories) {
        console.log(`\n🔍 Analyzing subcategory: ${subcategorySlug}`);
        console.log('─'.repeat(50));
        
        // Get technologies in this subcategory
        const technologiesQuery = `
            query GetTechnologiesBySubcategory($subcategorySlug: String!) {
                technologyS(where: { subcategories_some: { slug: $subcategorySlug } }) {
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
                }
            }
        `;
        
        const result = await makeRequest(technologiesQuery, {
            subcategorySlug: subcategorySlug
        });
        
        if (result.error) {
            console.log(`❌ Query failed: ${result.error}`);
            continue;
        }
        
        if (result.errors) {
            console.log(`❌ Query failed: ${result.errors[0].message}`);
            continue;
        }
        
        const technologies = result.data?.technologyS || [];
        detailedAnalysis[subcategorySlug] = {
            subcategorySlug,
            technologies: technologies,
            analysis: {}
        };
        
        console.log(`📊 Found ${technologies.length} technologies`);
        
        // Analyze each technology in detail
        technologies.forEach((tech, index) => {
            console.log(`\n${index + 1}. ${tech.name} (${tech.slug})`);
            
            // Content analysis
            const hasDescription = tech.description && tech.description.trim() !== '';
            const hasFeatures = tech.features && tech.features.trim() !== '';
            const hasBusinessMetrics = tech.businessMetrics && tech.businessMetrics.trim() !== '';
            const hasAdditionalDetails = tech.additonalDetails && tech.additonalDetails.trim() !== '';
            
            console.log(`   Description: ${hasDescription ? '✅' : '❌'} (${tech.description?.length || 0} chars)`);
            console.log(`   Features: ${hasFeatures ? '✅' : '❌'} (${tech.features?.length || 0} chars)`);
            console.log(`   Business Metrics: ${hasBusinessMetrics ? '✅' : '❌'} (${tech.businessMetrics?.length || 0} chars)`);
            console.log(`   Additional Details: ${hasAdditionalDetails ? '✅' : '❌'} (${tech.additonalDetails?.length || 0} chars)`);
            
            // Show current content preview
            if (hasDescription) {
                console.log(`   Description Preview: ${tech.description.substring(0, 100)}...`);
            }
            
            if (hasFeatures) {
                console.log(`   Features Preview: ${tech.features.substring(0, 100)}...`);
            }
            
            if (hasBusinessMetrics) {
                console.log(`   Business Metrics Preview: ${tech.businessMetrics.substring(0, 100)}...`);
            }
            
            if (hasAdditionalDetails) {
                console.log(`   Additional Details Preview: ${tech.additonalDetails.substring(0, 100)}...`);
            }
            
            // Enhancement recommendations
            const needsEnhancement = [];
            if (!hasBusinessMetrics) needsEnhancement.push('business metrics');
            if (!hasAdditionalDetails) needsEnhancement.push('additional details');
            
            // Suggest JEDI implementation focus
            let jediFocus = '';
            switch (tech.slug) {
                case 'sql-databases':
                    jediFocus = 'JEDI Rules™ business logic storage, PostgreSQL implementations';
                    break;
                case 'nosql-databases':
                    jediFocus = 'JEDI Rules™ document-based workflows, MongoDB implementations';
                    break;
                case 'text-files':
                    jediFocus = 'JEDI Rules™ document processing, text analysis implementations';
                    break;
                case 'images':
                    jediFocus = 'Computer vision, image analysis, JEDI AutoTune™ implementations';
                    break;
                case 'audio':
                    jediFocus = 'Voice processing, speech recognition, audio analysis';
                    break;
                case 'apache-kafka':
                    jediFocus = 'Real-time data processing, event streaming, JEDI Ensemble™ integration';
                    break;
                case 'aws-kinesis':
                    jediFocus = 'Cloud-native streaming, real-time analytics, AWS integration';
                    break;
                case 'third-party-apis':
                    jediFocus = 'API integration patterns, data acquisition, JEDI Rules™ automation';
                    break;
                case 'web-scraping':
                    jediFocus = 'Automated data collection, web data extraction, JEDI AutoTune™ optimization';
                    break;
                case 'apache-nifi':
                    jediFocus = 'Data pipeline automation, ETL processes, JEDI Rules™ orchestration';
                    break;
                case 'hashicorp-vault':
                    jediFocus = 'Secrets management, security compliance, JEDI Rules™ security';
                    break;
                case 'apache-ranger':
                    jediFocus = 'Data security, access control, compliance management';
                    break;
                default:
                    jediFocus = 'JEDI component integration, real client implementations';
            }
            
            if (needsEnhancement.length > 0) {
                console.log(`   🎯 Needs Enhancement: ${needsEnhancement.join(', ')}`);
                console.log(`   💡 JEDI Focus: ${jediFocus}`);
            }
            
            // Store detailed analysis
            detailedAnalysis[subcategorySlug].analysis[tech.slug] = {
                technology: tech,
                contentStatus: {
                    description: hasDescription,
                    features: hasFeatures,
                    businessMetrics: hasBusinessMetrics,
                    additionalDetails: hasAdditionalDetails
                },
                contentLengths: {
                    description: tech.description?.length || 0,
                    features: tech.features?.length || 0,
                    businessMetrics: tech.businessMetrics?.length || 0,
                    additionalDetails: tech.additonalDetails?.length || 0
                },
                needsEnhancement: needsEnhancement,
                jediFocus: jediFocus || 'JEDI component integration, real client implementations'
            };
        });
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Generate enhancement plan
    console.log('\n📋 Enhancement Plan Summary');
    console.log('===========================');
    
    const enhancementPlan = {
        highPrioritySubcategories: [],
        totalTechnologies: 0,
        technologiesNeedingEnhancement: 0,
        estimatedEnhancementWork: {}
    };
    
    Object.entries(detailedAnalysis).forEach(([subcategorySlug, data]) => {
        const subcategoryName = data.technologies[0]?.subcategories?.[0]?.name || subcategorySlug;
        const technologies = data.technologies;
        const needsEnhancement = technologies.filter(tech => 
            !tech.businessMetrics || !tech.additonalDetails
        );
        
        enhancementPlan.highPrioritySubcategories.push({
            subcategorySlug,
            subcategoryName,
            totalTechnologies: technologies.length,
            needsEnhancement: needsEnhancement.length,
            technologies: technologies.map(tech => ({
                name: tech.name,
                slug: tech.slug,
                needsBusinessMetrics: !tech.businessMetrics,
                needsAdditionalDetails: !tech.additonalDetails,
                jediFocus: data.analysis[tech.slug]?.jediFocus || 'JEDI integration'
            }))
        });
        
        enhancementPlan.totalTechnologies += technologies.length;
        enhancementPlan.technologiesNeedingEnhancement += needsEnhancement.length;
        
        enhancementPlan.estimatedEnhancementWork[subcategorySlug] = {
            businessMetrics: technologies.filter(t => !t.businessMetrics).length,
            additionalDetails: technologies.filter(t => !t.additonalDetails).length,
            totalEnhancements: needsEnhancement.length
        };
    });
    
    console.log(`📊 Total Technologies: ${enhancementPlan.totalTechnologies}`);
    console.log(`📊 Technologies Needing Enhancement: ${enhancementPlan.technologiesNeedingEnhancement}`);
    console.log(`📊 Enhancement Rate: ${((enhancementPlan.technologiesNeedingEnhancement / enhancementPlan.totalTechnologies) * 100).toFixed(1)}%`);
    
    console.log('\n🎯 Subcategory Enhancement Breakdown:');
    enhancementPlan.highPrioritySubcategories.forEach(sub => {
        console.log(`\n${sub.subcategoryName}:`);
        console.log(`  Total Technologies: ${sub.totalTechnologies}`);
        console.log(`  Needs Enhancement: ${sub.needsEnhancement}`);
        console.log(`  Technologies:`);
        sub.technologies.forEach(tech => {
            const needs = [];
            if (tech.needsBusinessMetrics) needs.push('metrics');
            if (tech.needsAdditionalDetails) needs.push('details');
            console.log(`    - ${tech.name}: ${needs.length > 0 ? `needs ${needs.join(', ')}` : 'complete'}`);
        });
    });
    
    // Save detailed analysis
    const outputFile = 'detailed_subcategory_analysis.json';
    fs.writeFileSync(outputFile, JSON.stringify({
        detailedAnalysis,
        enhancementPlan
    }, null, 2));
    
    console.log(`\n💾 Detailed analysis saved to: ${outputFile}`);
    
    console.log('\n✅ Detailed subcategory analysis completed!');
    console.log('\n🚀 Next Steps:');
    console.log('1. Review detailed analysis for each subcategory');
    console.log('2. Create enhancement scripts for high-priority subcategories');
    console.log('3. Start with subcategories with most technologies needing enhancement');
    console.log('4. Focus on JEDI-specific implementations and real client results');
}

// Run the detailed analysis
analyzeHighPrioritySubcategories().catch(console.error);
