#!/usr/bin/env node

/**
 * Fetch Technologies by Subcategories
 * Strategic approach to enhance technologies organized by subcategories
 * Focus on manageable chunks rather than all 221 technologies at once
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

async function fetchTechnologiesBySubcategories() {
    console.log('🔍 Fetching Technologies by Subcategories');
    console.log('==========================================');
    
    // First, get all subcategories
    const subcategoriesQuery = `
        query {
            subcategories(first: 50, orderBy: name_ASC) {
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
    
    const subcategoriesResult = await makeRequest(subcategoriesQuery);
    if (subcategoriesResult.error) {
        console.log(`❌ Subcategories query failed: ${subcategoriesResult.error}`);
        return;
    }
    
    const subcategories = subcategoriesResult.data?.subcategories || [];
    console.log(`📊 Found ${subcategories.length} subcategories\n`);
    
    // Group subcategories by main category
    const subcategoriesByCategory = {};
    subcategories.forEach(sub => {
        const categoryName = sub.category?.name || 'Uncategorized';
        if (!subcategoriesByCategory[categoryName]) {
            subcategoriesByCategory[categoryName] = [];
        }
        subcategoriesByCategory[categoryName].push(sub);
    });
    
    console.log('📊 Subcategories by Main Category:');
    Object.entries(subcategoriesByCategory).forEach(([category, subs]) => {
        console.log(`   ${category}: ${subs.length} subcategories`);
        subs.forEach(sub => {
            console.log(`     - ${sub.name} (${sub.slug})`);
        });
    });
    
    // Now fetch technologies for each subcategory
    const subcategoryTechnologies = {};
    
    for (const subcategory of subcategories) {
        console.log(`\n🔍 Fetching technologies for: ${subcategory.name}`);
        console.log('─'.repeat(50));
        
        const technologiesQuery = `
            query GetTechnologiesBySubcategory($subcategorySlug: String!) {
                technologyS(where: { subcategories: { slug: $subcategorySlug } }) {
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
        
        const techResult = await makeRequest(technologiesQuery, {
            subcategorySlug: subcategory.slug
        });
        
        if (techResult.error) {
            console.log(`❌ Query failed: ${techResult.error}`);
        } else if (techResult.errors) {
            console.log(`❌ Query failed: ${techResult.errors[0].message}`);
        } else {
            const technologies = techResult.data?.technologyS || [];
            subcategoryTechnologies[subcategory.slug] = {
                subcategory: subcategory,
                technologies: technologies
            };
            
            console.log(`   📊 Found ${technologies.length} technologies`);
            
            if (technologies.length > 0) {
                // Analyze content completeness
                const missingContent = {
                    features: 0,
                    businessMetrics: 0,
                    additonalDetails: 0
                };
                
                technologies.forEach(tech => {
                    if (!tech.features || tech.features.trim() === '') missingContent.features++;
                    if (!tech.businessMetrics || tech.businessMetrics.trim() === '') missingContent.businessMetrics++;
                    if (!tech.additonalDetails || tech.additonalDetails.trim() === '') missingContent.additonalDetails++;
                });
                
                console.log(`   📈 Content Analysis:`);
                console.log(`     Missing features: ${missingContent.features}/${technologies.length}`);
                console.log(`     Missing business metrics: ${missingContent.businessMetrics}/${technologies.length}`);
                console.log(`     Missing additional details: ${missingContent.additonalDetails}/${technologies.length}`);
                
                // Show first few technologies
                technologies.slice(0, 3).forEach((tech, index) => {
                    console.log(`     ${index + 1}. ${tech.name} (${tech.slug})`);
                    console.log(`        Features: ${tech.features ? '✅' : '❌'}`);
                    console.log(`        Business Metrics: ${tech.businessMetrics ? '✅' : '❌'}`);
                    console.log(`        Additional Details: ${tech.additonalDetails ? '✅' : '❌'}`);
                });
                
                if (technologies.length > 3) {
                    console.log(`     ... and ${technologies.length - 3} more technologies`);
                }
            } else {
                console.log('   No technologies found in this subcategory');
            }
        }
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Analyze and prioritize subcategories
    console.log('\n🎯 Subcategory Enhancement Analysis');
    console.log('===================================');
    
    const subcategoryStats = Object.entries(subcategoryTechnologies).map(([slug, data]) => {
        const { subcategory, technologies } = data;
        const totalTechs = technologies.length;
        
        if (totalTechs === 0) return null;
        
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
            priority: enhancementScore > 0.5 ? 'HIGH' : enhancementScore > 0.2 ? 'MEDIUM' : 'LOW'
        };
    }).filter(Boolean);
    
    // Sort by enhancement score (highest first)
    subcategoryStats.sort((a, b) => b.enhancementScore - a.enhancementScore);
    
    console.log('📊 Subcategory Enhancement Priority:');
    subcategoryStats.forEach((stat, index) => {
        const { subcategory, totalTechs, missingContent, enhancementScore, priority } = stat;
        console.log(`\n${index + 1}. ${subcategory.name} (${subcategory.category?.name || 'Uncategorized'})`);
        console.log(`   Priority: ${priority} (Score: ${(enhancementScore * 100).toFixed(1)}%)`);
        console.log(`   Technologies: ${totalTechs}`);
        console.log(`   Missing: ${missingContent.features} features, ${missingContent.businessMetrics} metrics, ${missingContent.additonalDetails} details`);
    });
    
    // Save data for enhancement
    const enhancementData = {
        subcategories: subcategoryStats,
        rawData: subcategoryTechnologies,
        summary: {
            totalSubcategories: subcategories.length,
            subcategoriesWithTechs: subcategoryStats.length,
            highPriority: subcategoryStats.filter(s => s.priority === 'HIGH').length,
            mediumPriority: subcategoryStats.filter(s => s.priority === 'MEDIUM').length,
            lowPriority: subcategoryStats.filter(s => s.priority === 'LOW').length
        }
    };
    
    const outputFile = 'subcategory_enhancement_data.json';
    fs.writeFileSync(outputFile, JSON.stringify(enhancementData, null, 2));
    console.log(`\n💾 Enhancement data saved to: ${outputFile}`);
    
    // Create JEDI-focused recommendations
    console.log('\n🚀 JEDI Enhancement Recommendations');
    console.log('===================================');
    
    const jediRelevantSubcategories = subcategoryStats.filter(stat => {
        const subcategoryName = stat.subcategory.name.toLowerCase();
        return subcategoryName.includes('ai') || 
               subcategoryName.includes('ml') || 
               subcategoryName.includes('automation') ||
               subcategoryName.includes('voice') ||
               subcategoryName.includes('conversational') ||
               subcategoryName.includes('search') ||
               subcategoryName.includes('database') ||
               subcategoryName.includes('integration');
    });
    
    console.log('🎯 JEDI-Relevant Subcategories (Top 5):');
    jediRelevantSubcategories.slice(0, 5).forEach((stat, index) => {
        console.log(`\n${index + 1}. ${stat.subcategory.name}`);
        console.log(`   Category: ${stat.subcategory.category?.name || 'Uncategorized'}`);
        console.log(`   Priority: ${stat.priority} (${stat.totalTechs} technologies)`);
        console.log(`   Enhancement Score: ${(stat.enhancementScore * 100).toFixed(1)}%`);
    });
    
    console.log('\n✅ Subcategory analysis completed!');
    console.log('\n🚀 Next Steps:');
    console.log('1. Choose a high-priority subcategory to start with');
    console.log('2. Create JEDI-specific content for technologies in that subcategory');
    console.log('3. Test the enhancement approach with 2-3 technologies');
    console.log('4. Scale to other subcategories based on success');
}

// Run the analysis
fetchTechnologiesBySubcategories().catch(console.error);
