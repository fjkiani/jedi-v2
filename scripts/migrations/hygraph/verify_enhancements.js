#!/usr/bin/env node

/**
 * Verify Enhanced Technologies
 * Check that JEDI enhancements were applied correctly to Machine-Learning technologies
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

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

async function verifyEnhancedTechnologies() {
    console.log('🔍 Verifying Enhanced Machine-Learning Technologies');
    console.log('==================================================');
    
    // Query all technologies and filter for Machine-Learning category
    const verificationQuery = `
        query VerifyEnhancedTechnologies {
            technologyS(first: 50, orderBy: priority_ASC) {
                id
                name
                slug
                description
                features
                businessMetrics
                additonalDetails
                category {
                    name
                    slug
                }
            }
        }
    `;
    
    const result = await makeRequest(verificationQuery);
    
    if (result.error) {
        console.log(`❌ Verification query failed: ${result.error}`);
        return;
    }
    
    if (result.errors) {
        console.log(`❌ Verification query failed: ${result.errors[0].message}`);
        return;
    }
    
    const allTechnologies = result.data?.technologyS || [];
    
    // Filter for Machine-Learning category technologies
    const technologies = allTechnologies.filter(tech => 
        tech.category && tech.category.some(cat => cat.slug === 'ml')
    );
    
    console.log(`📊 Found ${technologies.length} Machine-Learning technologies (from ${allTechnologies.length} total)\n`);
    
    // Verify each technology
    technologies.forEach((tech, index) => {
        console.log(`${index + 1}. ${tech.name} (${tech.slug})`);
        console.log('─'.repeat(50));
        
        // Check content completeness
        const hasDescription = tech.description && tech.description.trim() !== '';
        const hasFeatures = tech.features && tech.features.trim() !== '';
        const hasBusinessMetrics = tech.businessMetrics && tech.businessMetrics.trim() !== '';
        const hasAdditionalDetails = tech.additonalDetails && tech.additonalDetails.trim() !== '';
        
        console.log(`   Description: ${hasDescription ? '✅' : '❌'}`);
        console.log(`   Features: ${hasFeatures ? '✅' : '❌'}`);
        console.log(`   Business Metrics: ${hasBusinessMetrics ? '✅' : '❌'}`);
        console.log(`   Additional Details: ${hasAdditionalDetails ? '✅' : '❌'}`);
        
        if (hasAdditionalDetails) {
            const detailsLength = tech.additonalDetails.length;
            console.log(`   Details Length: ${detailsLength} characters`);
            
            // Check for JEDI-specific content
            const hasJediContent = tech.additonalDetails.includes('JEDI') || 
                                 tech.additonalDetails.includes('Go Answer') || 
                                 tech.additonalDetails.includes('CrisPRO') ||
                                 tech.additonalDetails.includes('AISO') ||
                                 tech.additonalDetails.includes('GEO');
            
            console.log(`   JEDI Content: ${hasJediContent ? '✅' : '❌'}`);
            
            // Show first few lines of additional details
            const firstLines = tech.additonalDetails.split('\n').slice(0, 3).join('\n');
            console.log(`   Preview:`);
            console.log(`   ${firstLines.substring(0, 100)}...`);
        }
        
        console.log('');
    });
    
    // Summary
    const enhancedCount = technologies.filter(tech => 
        tech.additonalDetails && tech.additonalDetails.trim() !== ''
    ).length;
    
    const jediEnhancedCount = technologies.filter(tech => 
        tech.additonalDetails && (
            tech.additonalDetails.includes('JEDI') || 
            tech.additonalDetails.includes('Go Answer') || 
            tech.additonalDetails.includes('CrisPRO') ||
            tech.additonalDetails.includes('AISO') ||
            tech.additonalDetails.includes('GEO')
        )
    ).length;
    
    console.log('📊 Enhancement Summary:');
    console.log(`   Total Technologies: ${technologies.length}`);
    console.log(`   With Additional Details: ${enhancedCount}`);
    console.log(`   With JEDI Content: ${jediEnhancedCount}`);
    console.log(`   Enhancement Rate: ${((enhancedCount / technologies.length) * 100).toFixed(1)}%`);
    
    if (jediEnhancedCount > 0) {
        console.log('\n✅ JEDI enhancements successfully applied!');
        console.log('\n🚀 Next Steps:');
        console.log('1. Test technology pages on the website');
        console.log('2. Verify content displays correctly in UI');
        console.log('3. Move to AI Agents category for next enhancement');
        console.log('4. Scale approach to other high-priority categories');
    } else {
        console.log('\n⚠️  JEDI enhancements may not have been applied correctly');
    }
}

// Run verification
verifyEnhancedTechnologies().catch(console.error);
