#!/usr/bin/env node

/**
 * Fetch Technologies by Actual Subcategories
 * Get technologies organized by their real subcategories
 * Focus on subcategories that actually have technologies
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

async function fetchTechnologiesByActualSubcategories() {
    console.log('🔍 Fetching Technologies by Actual Subcategories');
    console.log('=================================================');
    
    // First, get all technologies with their subcategories
    const allTechnologiesQuery = `
        query GetAllTechnologiesWithSubcategories {
            technologyS(first: 100, orderBy: priority_ASC) {
                id
                name
                slug
                description
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
    
    const result = await makeRequest(allTechnologiesQuery);
    if (result.error) {
        console.log(`❌ Technologies query failed: ${result.error}`);
        return;
    }
    
    const allTechnologies = result.data?.technologyS || [];
    console.log(`📊 Found ${allTechnologies.length} technologies\n`);
    
    // Group technologies by subcategory
    const subcategoryTechnologies = {};
    const uncategorized = [];
    
    allTechnologies.forEach(tech => {
        if (tech.subcategories && tech.subcategories.length > 0) {
            tech.subcategories.forEach(sub => {
                if (!subcategoryTechnologies[sub.slug]) {
                    subcategoryTechnologies[sub.slug] = {
                        subcategory: sub,
                        technologies: []
                    };
                }
                subcategoryTechnologies[sub.slug].technologies.push(tech);
            });
        } else {
            uncategorized.push(tech);
        }
    });
    
    console.log('📊 Technologies by Subcategory:');
    Object.entries(subcategoryTechnologies).forEach(([slug, data]) => {
        console.log(`\n${data.subcategory.name} (${slug}): ${data.technologies.length} technologies`);
        data.technologies.forEach(tech => {
            console.log(`  - ${tech.name} (${tech.slug})`);
        });
    });
    
    if (uncategorized.length > 0) {
        console.log(`\nUncategorized (no subcategories): ${uncategorized.length} technologies`);
        uncategorized.slice(0, 5).forEach(tech => {
            console.log(`  - ${tech.name} (${tech.slug})`);
        });
        if (uncategorized.length > 5) {
            console.log(`  ... and ${uncategorized.length - 5} more`);
        }
    }
    
    // Analyze each subcategory
    console.log('\n🎯 Subcategory Enhancement Analysis');
    console.log('===================================');
    
    const subcategoryStats = Object.entries(subcategoryTechnologies).map(([slug, data]) => {
        const { subcategory, technologies } = data;
        const totalTechs = technologies.length;
        
        const missingContent = {
            features: technologies.filter(t => !t.features || t.features.trim() === '').length,
            businessMetrics: technologies.filter(t => !t.businessMetrics || t.businessMetrics.trim() === '').length,
            additonalDetails: technologies.filter(t => !t.additonalDetails || t.additonalDetails.trim() === '').length
        };
        
        const enhancementScore = (missingContent.features + missingContent.businessMetrics + missingContent.additonalDetails) / (totalTechs * 3);
        
        return {
            subcategory,
            totalTechs,
            missingContent,
            enhancementScore,
            priority: enhancementScore > 0.5 ? 'HIGH' : enhancementScore > 0.2 ? 'MEDIUM' : 'LOW',
            technologies: technologies
        };
    });
    
    // Sort by enhancement score (highest first)
    subcategoryStats.sort((a, b) => b.enhancementScore - a.enhancementScore);
    
    console.log('📊 Subcategory Enhancement Priority:');
    subcategoryStats.forEach((stat, index) => {
        const { subcategory, totalTechs, missingContent, enhancementScore, priority } = stat;
        console.log(`\n${index + 1}. ${subcategory.name} (${subcategory.slug})`);
        console.log(`   Priority: ${priority} (Score: ${(enhancementScore * 100).toFixed(1)}%)`);
        console.log(`   Technologies: ${totalTechs}`);
        console.log(`   Missing: ${missingContent.features} features, ${missingContent.businessMetrics} metrics, ${missingContent.additonalDetails} details`);
        
        // Show key technologies needing enhancement
        const needsEnhancement = stat.technologies.filter(tech => 
            !tech.features || !tech.businessMetrics || !tech.additonalDetails
        );
        
        if (needsEnhancement.length > 0) {
            console.log(`   Technologies needing enhancement:`);
            needsEnhancement.slice(0, 3).forEach(tech => {
                const missing = [];
                if (!tech.features) missing.push('features');
                if (!tech.businessMetrics) missing.push('metrics');
                if (!tech.additonalDetails) missing.push('details');
                console.log(`     - ${tech.name}: missing ${missing.join(', ')}`);
            });
            if (needsEnhancement.length > 3) {
                console.log(`     ... and ${needsEnhancement.length - 3} more`);
            }
        }
    });
    
    // Save data for enhancement
    const enhancementData = {
        subcategories: subcategoryStats,
        uncategorized: uncategorized,
        summary: {
            totalSubcategories: subcategoryStats.length,
            totalTechnologies: allTechnologies.length,
            technologiesWithSubcategories: allTechnologies.length - uncategorized.length,
            uncategorizedTechnologies: uncategorized.length,
            highPriority: subcategoryStats.filter(s => s.priority === 'HIGH').length,
            mediumPriority: subcategoryStats.filter(s => s.priority === 'MEDIUM').length,
            lowPriority: subcategoryStats.filter(s => s.priority === 'LOW').length
        }
    };
    
    const outputFile = 'subcategory_enhancement_analysis.json';
    fs.writeFileSync(outputFile, JSON.stringify(enhancementData, null, 2));
    console.log(`\n💾 Enhancement data saved to: ${outputFile}`);
    
    // Create JEDI-focused recommendations
    console.log('\n🚀 JEDI Enhancement Recommendations');
    console.log('===================================');
    
    const jediRelevantSubcategories = subcategoryStats.filter(stat => {
        const subcategoryName = stat.subcategory.name.toLowerCase();
        return subcategoryName.includes('agent') || 
               subcategoryName.includes('ai') || 
               subcategoryName.includes('ml') || 
               subcategoryName.includes('framework') ||
               subcategoryName.includes('database') ||
               subcategoryName.includes('integration') ||
               subcategoryName.includes('automation');
    });
    
    console.log('🎯 JEDI-Relevant Subcategories:');
    jediRelevantSubcategories.forEach((stat, index) => {
        console.log(`\n${index + 1}. ${stat.subcategory.name}`);
        console.log(`   Priority: ${stat.priority} (${stat.totalTechs} technologies)`);
        console.log(`   Enhancement Score: ${(stat.enhancementScore * 100).toFixed(1)}%`);
        
        // Show key technologies in this subcategory
        const keyTechs = stat.technologies.slice(0, 3);
        if (keyTechs.length > 0) {
            console.log(`   Key Technologies:`);
            keyTechs.forEach(tech => {
                const status = [];
                if (tech.features) status.push('✅ features');
                if (tech.businessMetrics) status.push('✅ metrics');
                if (tech.additonalDetails) status.push('✅ details');
                console.log(`     - ${tech.name}: ${status.length > 0 ? status.join(', ') : '❌ needs enhancement'}`);
            });
        }
    });
    
    console.log('\n✅ Subcategory analysis completed!');
    console.log('\n🚀 Next Steps:');
    console.log('1. Choose a high-priority subcategory to start with');
    console.log('2. Create JEDI-specific content for technologies in that subcategory');
    console.log('3. Test the enhancement approach with 2-3 technologies');
    console.log('4. Scale to other subcategories based on success');
}

// Run the analysis
fetchTechnologiesByActualSubcategories().catch(console.error);
