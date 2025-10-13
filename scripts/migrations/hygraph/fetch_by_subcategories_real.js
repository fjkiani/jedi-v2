#!/usr/bin/env node

/**
 * Fetch Technologies by Subcategories
 * Get the actual subcategories and their connected technologies
 * This will show us the real technology organization structure
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

async function fetchTechnologiesBySubcategories() {
    console.log('🔍 Fetching Technologies by Subcategories');
    console.log('==========================================');
    
    // First, get all subcategories
    const subcategoriesQuery = `
        query {
            subcategories(first: 100, orderBy: name_ASC) {
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
    
    if (subcategories.length === 0) {
        console.log('⚠️  No subcategories found. Let me check the actual schema structure...');
        
        // Let's check what's actually in the technology schema
        const techQuery = `
            query {
                technologyS(first: 5) {
                    id
                    name
                    slug
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
        
        const techResult = await makeRequest(techQuery);
        if (techResult.error) {
            console.log(`❌ Technology query failed: ${techResult.error}`);
        } else {
            const technologies = techResult.data?.technologyS || [];
            console.log(`\n📊 Sample technologies and their relationships:`);
            technologies.forEach(tech => {
                console.log(`\n${tech.name} (${tech.slug}):`);
                console.log(`  Categories: ${tech.category?.map(c => c.name).join(', ') || 'None'}`);
                console.log(`  Subcategories: ${tech.subcategories?.map(s => s.name).join(', ') || 'None'}`);
            });
        }
        return;
    }
    
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
        console.log(`\n${category}: ${subs.length} subcategories`);
        subs.forEach(sub => {
            console.log(`  - ${sub.name} (${sub.slug})`);
        });
    });
    
    // Now fetch technologies for each subcategory
    const subcategoryTechnologies = {};
    
    for (const subcategory of subcategories.slice(0, 10)) { // Limit to first 10 for testing
        console.log(`\n🔍 Fetching technologies for: ${subcategory.name}`);
        console.log('─'.repeat(50));
        
        const technologiesQuery = `
            query GetTechnologiesBySubcategory($subcategorySlug: String!) {
                technologyS(where: { subcategories: { slug: $subcategorySlug } }) {
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
                // Show first few technologies
                technologies.slice(0, 3).forEach((tech, index) => {
                    console.log(`   ${index + 1}. ${tech.name} (${tech.slug})`);
                    console.log(`      Features: ${tech.features ? '✅' : '❌'}`);
                    console.log(`      Business Metrics: ${tech.businessMetrics ? '✅' : '❌'}`);
                    console.log(`      Additional Details: ${tech.additonalDetails ? '✅' : '❌'}`);
                });
                
                if (technologies.length > 3) {
                    console.log(`   ... and ${technologies.length - 3} more technologies`);
                }
            } else {
                console.log('   No technologies found in this subcategory');
            }
        }
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log('\n✅ Subcategory analysis completed!');
    console.log('\n🚀 Next Steps:');
    console.log('1. Identify subcategories with technologies that need enhancement');
    console.log('2. Create enhancement scripts for specific subcategories');
    console.log('3. Focus on high-impact subcategories first');
}

// Run the analysis
fetchTechnologiesBySubcategories().catch(console.error);
