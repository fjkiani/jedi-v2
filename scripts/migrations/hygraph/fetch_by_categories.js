#!/usr/bin/env node

/**
 * Fetch Technologies by Categories
 * Strategic approach to enhance technologies organized by categories
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

async function fetchTechnologiesByCategories() {
    console.log('🔍 Fetching Technologies by Categories');
    console.log('=====================================');
    
    // First, get all categories
    const categoriesQuery = `
        query {
            categories(first: 50, orderBy: name_ASC) {
                id
                name
                slug
                description
            }
        }
    `;
    
    const categoriesResult = await makeRequest(categoriesQuery);
    if (categoriesResult.error) {
        console.log(`❌ Categories query failed: ${categoriesResult.error}`);
        return;
    }
    
    const categories = categoriesResult.data?.categories || [];
    console.log(`📊 Found ${categories.length} categories\n`);
    
    console.log('📊 Available Categories:');
    categories.forEach((cat, index) => {
        console.log(`   ${index + 1}. ${cat.name} (${cat.slug})`);
        console.log(`      Description: ${cat.description || 'No description'}`);
    });
    
    // Now fetch technologies for each category
    const categoryTechnologies = {};
    
    for (const category of categories) {
        console.log(`\n🔍 Fetching technologies for: ${category.name}`);
        console.log('─'.repeat(50));
        
        const technologiesQuery = `
            query GetTechnologiesByCategory($categorySlug: String!) {
                technologyS(where: { category: { slug: $categorySlug } }) {
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
                }
            }
        `;
        
        const techResult = await makeRequest(technologiesQuery, {
            categorySlug: category.slug
        });
        
        if (techResult.error) {
            console.log(`❌ Query failed: ${techResult.error}`);
        } else if (techResult.errors) {
            console.log(`❌ Query failed: ${techResult.errors[0].message}`);
        } else {
            const technologies = techResult.data?.technologyS || [];
            categoryTechnologies[category.slug] = {
                category: category,
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
                console.log('   No technologies found in this category');
            }
        }
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Analyze and prioritize categories
    console.log('\n🎯 Category Enhancement Analysis');
    console.log('================================');
    
    const categoryStats = Object.entries(categoryTechnologies).map(([slug, data]) => {
        const { category, technologies } = data;
        const totalTechs = technologies.length;
        
        if (totalTechs === 0) return null;
        
        const missingContent = {
            features: technologies.filter(t => !t.features || t.features.trim() === '').length,
            businessMetrics: technologies.filter(t => !t.businessMetrics || t.businessMetrics.trim() === '').length,
            additonalDetails: technologies.filter(t => !t.additonalDetails || t.additonalDetails.trim() === '').length
        };
        
        const enhancementScore = (missingContent.features + missingContent.businessMetrics + missingContent.additonalDetails) / (totalTechs * 3);
        
        return {
            category,
            totalTechs,
            missingContent,
            enhancementScore,
            priority: enhancementScore > 0.5 ? 'HIGH' : enhancementScore > 0.2 ? 'MEDIUM' : 'LOW'
        };
    }).filter(Boolean);
    
    // Sort by enhancement score (highest first)
    categoryStats.sort((a, b) => b.enhancementScore - a.enhancementScore);
    
    console.log('📊 Category Enhancement Priority:');
    categoryStats.forEach((stat, index) => {
        const { category, totalTechs, missingContent, enhancementScore, priority } = stat;
        console.log(`\n${index + 1}. ${category.name} (${category.slug})`);
        console.log(`   Priority: ${priority} (Score: ${(enhancementScore * 100).toFixed(1)}%)`);
        console.log(`   Technologies: ${totalTechs}`);
        console.log(`   Missing: ${missingContent.features} features, ${missingContent.businessMetrics} metrics, ${missingContent.additonalDetails} details`);
    });
    
    // Save data for enhancement
    const enhancementData = {
        categories: categoryStats,
        rawData: categoryTechnologies,
        summary: {
            totalCategories: categories.length,
            categoriesWithTechs: categoryStats.length,
            highPriority: categoryStats.filter(s => s.priority === 'HIGH').length,
            mediumPriority: categoryStats.filter(s => s.priority === 'MEDIUM').length,
            lowPriority: categoryStats.filter(s => s.priority === 'LOW').length
        }
    };
    
    const outputFile = 'category_enhancement_data.json';
    fs.writeFileSync(outputFile, JSON.stringify(enhancementData, null, 2));
    console.log(`\n💾 Enhancement data saved to: ${outputFile}`);
    
    // Create JEDI-focused recommendations
    console.log('\n🚀 JEDI Enhancement Recommendations');
    console.log('===================================');
    
    const jediRelevantCategories = categoryStats.filter(stat => {
        const categoryName = stat.category.name.toLowerCase();
        return categoryName.includes('ai') || 
               categoryName.includes('ml') || 
               categoryName.includes('automation') ||
               categoryName.includes('data') ||
               categoryName.includes('integration') ||
               categoryName.includes('frontend') ||
               categoryName.includes('security');
    });
    
    console.log('🎯 JEDI-Relevant Categories (Top 5):');
    jediRelevantCategories.slice(0, 5).forEach((stat, index) => {
        console.log(`\n${index + 1}. ${stat.category.name}`);
        console.log(`   Priority: ${stat.priority} (${stat.totalTechs} technologies)`);
        console.log(`   Enhancement Score: ${(stat.enhancementScore * 100).toFixed(1)}%`);
        
        // Show key technologies in this category
        const keyTechs = stat.rawData?.technologies?.slice(0, 3) || [];
        if (keyTechs.length > 0) {
            console.log(`   Key Technologies:`);
            keyTechs.forEach(tech => {
                console.log(`     - ${tech.name} (${tech.slug})`);
            });
        }
    });
    
    console.log('\n✅ Category analysis completed!');
    console.log('\n🚀 Next Steps:');
    console.log('1. Choose a high-priority category to start with');
    console.log('2. Create JEDI-specific content for technologies in that category');
    console.log('3. Test the enhancement approach with 2-3 technologies');
    console.log('4. Scale to other categories based on success');
}

// Run the analysis
fetchTechnologiesByCategories().catch(console.error);
