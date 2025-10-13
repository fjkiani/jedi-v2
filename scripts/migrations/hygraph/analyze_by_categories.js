#!/usr/bin/env node

/**
 * Analyze Technologies by Categories
 * Analyze the already fetched technology data organized by categories
 * Create strategic enhancement plan based on categories
 */

import fs from 'fs';

async function analyzeTechnologiesByCategories() {
    console.log('🔍 Analyzing Technologies by Categories');
    console.log('=======================================');
    
    // Read the existing data
    const rawData = JSON.parse(fs.readFileSync('all_technologies_raw.json', 'utf8'));
    console.log(`📊 Analyzing ${rawData.length} technologies\n`);
    
    // Group technologies by category
    const categoryTechnologies = {};
    const uncategorized = [];
    
    rawData.forEach(tech => {
        if (tech.category && tech.category.length > 0) {
            tech.category.forEach(cat => {
                if (!categoryTechnologies[cat.slug]) {
                    categoryTechnologies[cat.slug] = {
                        category: cat,
                        technologies: []
                    };
                }
                categoryTechnologies[cat.slug].technologies.push(tech);
            });
        } else {
            uncategorized.push(tech);
        }
    });
    
    console.log('📊 Technologies by Category:');
    Object.entries(categoryTechnologies).forEach(([slug, data]) => {
        console.log(`   ${data.category.name}: ${data.technologies.length} technologies`);
    });
    
    if (uncategorized.length > 0) {
        console.log(`   Uncategorized: ${uncategorized.length} technologies`);
    }
    
    // Analyze each category
    console.log('\n🎯 Category Enhancement Analysis');
    console.log('================================');
    
    const categoryStats = Object.entries(categoryTechnologies).map(([slug, data]) => {
        const { category, technologies } = data;
        const totalTechs = technologies.length;
        
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
            priority: enhancementScore > 0.5 ? 'HIGH' : enhancementScore > 0.2 ? 'MEDIUM' : 'LOW',
            technologies: technologies
        };
    });
    
    // Sort by enhancement score (highest first)
    categoryStats.sort((a, b) => b.enhancementScore - a.enhancementScore);
    
    console.log('📊 Category Enhancement Priority:');
    categoryStats.forEach((stat, index) => {
        const { category, totalTechs, missingContent, enhancementScore, priority } = stat;
        console.log(`\n${index + 1}. ${category.name} (${category.slug})`);
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
               categoryName.includes('security') ||
               categoryName.includes('nlp');
    });
    
    console.log('🎯 JEDI-Relevant Categories (Top 5):');
    jediRelevantCategories.slice(0, 5).forEach((stat, index) => {
        console.log(`\n${index + 1}. ${stat.category.name}`);
        console.log(`   Priority: ${stat.priority} (${stat.totalTechs} technologies)`);
        console.log(`   Enhancement Score: ${(stat.enhancementScore * 100).toFixed(1)}%`);
        
        // Show key technologies in this category
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
    
    // Create enhancement plan
    console.log('\n📋 Strategic Enhancement Plan');
    console.log('============================');
    
    const highPriorityCategories = categoryStats.filter(s => s.priority === 'HIGH');
    const mediumPriorityCategories = categoryStats.filter(s => s.priority === 'MEDIUM');
    
    console.log(`\n🎯 Phase 1: High Priority Categories (${highPriorityCategories.length} categories)`);
    highPriorityCategories.forEach((stat, index) => {
        console.log(`   ${index + 1}. ${stat.category.name} - ${stat.totalTechs} technologies`);
        console.log(`      Focus: ${stat.missingContent.additonalDetails} technologies need additional details`);
    });
    
    console.log(`\n🎯 Phase 2: Medium Priority Categories (${mediumPriorityCategories.length} categories)`);
    mediumPriorityCategories.slice(0, 3).forEach((stat, index) => {
        console.log(`   ${index + 1}. ${stat.category.name} - ${stat.totalTechs} technologies`);
    });
    
    // Save detailed enhancement data
    const enhancementData = {
        categories: categoryStats,
        summary: {
            totalCategories: categoryStats.length,
            highPriority: highPriorityCategories.length,
            mediumPriority: mediumPriorityCategories.length,
            lowPriority: categoryStats.filter(s => s.priority === 'LOW').length,
            totalTechnologies: rawData.length,
            technologiesNeedingEnhancement: rawData.filter(t => !t.features || !t.businessMetrics || !t.additonalDetails).length
        },
        jediRelevantCategories: jediRelevantCategories.slice(0, 5)
    };
    
    const outputFile = 'category_enhancement_analysis.json';
    fs.writeFileSync(outputFile, JSON.stringify(enhancementData, null, 2));
    console.log(`\n💾 Detailed analysis saved to: ${outputFile}`);
    
    console.log('\n✅ Category analysis completed!');
    console.log('\n🚀 Recommended Next Steps:');
    console.log('1. Start with Machine-Learning category (LangChain, Hugging Face)');
    console.log('2. Focus on AI Agents category (conversational AI technologies)');
    console.log('3. Enhance Data Engineering category (MongoDB, PostgreSQL)');
    console.log('4. Create JEDI-specific content for each technology');
    console.log('5. Test enhancement approach with 2-3 technologies per category');
}

// Run the analysis
analyzeTechnologiesByCategories().catch(console.error);
