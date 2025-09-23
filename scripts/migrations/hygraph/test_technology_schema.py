#!/usr/bin/env python3
"""
Technology Schema Test Script for Hygraph CMS

This script tests the Hygraph schema to understand the exact structure
for technologies, categories, and related entities.

Usage: python test_technology_schema.py
"""

import os
import json
import logging
from dotenv import load_dotenv
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Hygraph configuration
ENDPOINT = os.getenv("VITE_HYGRAPH_ENDPOINT")
TOKEN = os.getenv("VITE_HYGRAPH_TOKEN")

if not ENDPOINT or not TOKEN:
    logger.error("Hygraph configuration missing in .env file")
    exit(1)

# GraphQL client setup
transport = RequestsHTTPTransport(
    url=ENDPOINT,
    headers={
        "Authorization": f"Bearer {TOKEN}",
        "gcms-stage": "DRAFT"  # Test both DRAFT and PUBLISHED
    },
    verify=True,
    retries=3,
)
client = Client(transport=transport, fetch_schema_from_transport=False)

def test_schema_introspection():
    """Test schema introspection to understand available types"""
    logger.info("🔍 Testing schema introspection...")
    
    introspection_query = gql("""
        query IntrospectionQuery {
            __schema {
                types {
                    name
                    kind
                    fields {
                        name
                        type {
                            name
                            kind
                        }
                    }
                }
            }
        }
    """)
    
    try:
        result = client.execute(introspection_query)
        types = result.get('__schema', {}).get('types', [])
        
        # Find technology-related types
        tech_types = [t for t in types if 'tech' in t.get('name', '').lower() or 'category' in t.get('name', '').lower()]
        
        logger.info(f"Found {len(tech_types)} technology-related types:")
        for tech_type in tech_types:
            logger.info(f"  - {tech_type['name']} ({tech_type['kind']})")
            if tech_type.get('fields'):
                logger.info(f"    Fields: {[f['name'] for f in tech_type['fields']]}")
        
        return tech_types
    except Exception as e:
        logger.error(f"Error in schema introspection: {e}")
        return []

def test_technology_queries():
    """Test various technology query patterns"""
    logger.info("🔍 Testing technology queries...")
    
    # Test 1: Basic technology query
    test_queries = [
        {
            "name": "Basic Technologies Query",
            "query": gql("""
                query TestBasicTechnologies {
                    technologies {
                        id
                        name
                        slug
                    }
                }
            """)
        },
        {
            "name": "TechnologyS Query (plural)",
            "query": gql("""
                query TestTechnologyS {
                    technologyS {
                        id
                        name
                        slug
                    }
                }
            """)
        },
        {
            "name": "Technology Query (singular)",
            "query": gql("""
                query TestTechnology {
                    technology {
                        id
                        name
                        slug
                    }
                }
            """)
        },
        {
            "name": "Categories Query",
            "query": gql("""
                query TestCategories {
                    categories {
                        id
                        name
                        slug
                        description
                    }
                }
            """)
        },
        {
            "name": "CategoryS Query (plural)",
            "query": gql("""
                query TestCategoryS {
                    categoryS {
                        id
                        name
                        slug
                        description
                    }
                }
            """)
        }
    ]
    
    results = {}
    for test in test_queries:
        try:
            logger.info(f"Testing: {test['name']}")
            result = client.execute(test['query'])
            results[test['name']] = result
            logger.info(f"✅ {test['name']} - Success: {len(result.get(list(result.keys())[0], []))} items")
        except Exception as e:
            logger.error(f"❌ {test['name']} - Error: {e}")
            results[test['name']] = {"error": str(e)}
    
    return results

def test_technology_fields():
    """Test specific technology fields"""
    logger.info("🔍 Testing technology fields...")
    
    field_tests = [
        {
            "name": "Technology with all possible fields",
            "query": gql("""
                query TestTechnologyFields {
                    technologies(first: 1) {
                        id
                        name
                        slug
                        description
                        icon {
                            url
                        }
                        features
                        businessMetrics
                        architecture
                        integration
                        jediUsage
                        category {
                            id
                            name
                            slug
                        }
                        subcategories
                        services
                        primaryUses
                        metrics
                        deployment
                        compatibleWith
                        apis
                        documentation
                        github
                        website
                        dependencies
                        useCases {
                            id
                            title
                            slug
                        }
                    }
                }
            """)
        },
        {
            "name": "TechnologyS with all possible fields",
            "query": gql("""
                query TestTechnologySFields {
                    technologyS(first: 1) {
                        id
                        name
                        slug
                        description
                        icon {
                            url
                        }
                        features
                        businessMetrics
                        architecture
                        integration
                        jediUsage
                        category {
                            id
                            name
                            slug
                        }
                        subcategories
                        services
                        primaryUses
                        metrics
                        deployment
                        compatibleWith
                        apis
                        documentation
                        github
                        website
                        dependencies
                        useCases {
                            id
                            title
                            slug
                        }
                    }
                }
            """)
        }
    ]
    
    results = {}
    for test in field_tests:
        try:
            logger.info(f"Testing: {test['name']}")
            result = client.execute(test['query'])
            results[test['name']] = result
            
            # Check which fields returned data
            if result.get('technologies') or result.get('technologyS'):
                tech_data = result.get('technologies', result.get('technologyS', []))
                if tech_data:
                    tech = tech_data[0]
                    available_fields = [k for k, v in tech.items() if v is not None]
                    logger.info(f"✅ Available fields: {available_fields}")
                else:
                    logger.info("✅ Query successful but no technologies found")
            else:
                logger.info("✅ Query successful but no data returned")
                
        except Exception as e:
            logger.error(f"❌ {test['name']} - Error: {e}")
            results[test['name']] = {"error": str(e)}
    
    return results

def test_mutation_schema():
    """Test mutation schema for technologies"""
    logger.info("🔍 Testing mutation schema...")
    
    mutation_tests = [
        {
            "name": "Create Technology Mutation",
            "query": gql("""
                mutation TestCreateTechnology {
                    createTechnology(data: {
                        name: "Test Technology"
                        slug: "test-technology"
                        description: "Test description"
                    }) {
                        id
                        name
                        slug
                    }
                }
            """)
        },
        {
            "name": "Create Category Mutation",
            "query": gql("""
                mutation TestCreateCategory {
                    createCategory(data: {
                        name: "Test Category"
                        slug: "test-category"
                        description: "Test category description"
                    }) {
                        id
                        name
                        slug
                    }
                }
            """)
        }
    ]
    
    results = {}
    for test in mutation_tests:
        try:
            logger.info(f"Testing: {test['name']}")
            result = client.execute(test['query'])
            results[test['name']] = result
            logger.info(f"✅ {test['name']} - Success")
        except Exception as e:
            logger.error(f"❌ {test['name']} - Error: {e}")
            results[test['name']] = {"error": str(e)}
    
    return results

def test_existing_data():
    """Test what data already exists"""
    logger.info("🔍 Testing existing data...")
    
    existing_data_tests = [
        {
            "name": "Count Technologies",
            "query": gql("""
                query CountTechnologies {
                    technologiesConnection {
                        aggregate {
                            count
                        }
                    }
                }
            """)
        },
        {
            "name": "Count TechnologyS",
            "query": gql("""
                query CountTechnologyS {
                    technologySConnection {
                        aggregate {
                            count
                        }
                    }
                }
            """)
        },
        {
            "name": "Count Categories",
            "query": gql("""
                query CountCategories {
                    categoriesConnection {
                        aggregate {
                            count
                        }
                    }
                }
            """)
        },
        {
            "name": "Sample Technologies",
            "query": gql("""
                query SampleTechnologies {
                    technologies(first: 5) {
                        id
                        name
                        slug
                        description
                    }
                }
            """)
        },
        {
            "name": "Sample TechnologyS",
            "query": gql("""
                query SampleTechnologyS {
                    technologyS(first: 5) {
                        id
                        name
                        slug
                        description
                    }
                }
            """)
        }
    ]
    
    results = {}
    for test in existing_data_tests:
        try:
            logger.info(f"Testing: {test['name']}")
            result = client.execute(test['query'])
            results[test['name']] = result
            
            # Extract count or data
            if 'Connection' in test['name']:
                count = result.get(list(result.keys())[0], {}).get('aggregate', {}).get('count', 0)
                logger.info(f"✅ {test['name']} - Count: {count}")
            else:
                data = result.get(list(result.keys())[0], [])
                logger.info(f"✅ {test['name']} - Found {len(data)} items")
                if data:
                    logger.info(f"   Sample: {data[0].get('name', 'Unknown')}")
                    
        except Exception as e:
            logger.error(f"❌ {test['name']} - Error: {e}")
            results[test['name']] = {"error": str(e)}
    
    return results

def main():
    """Run all schema tests"""
    logger.info("🚀 Starting Technology Schema Tests...")
    
    # Run all tests
    schema_types = test_schema_introspection()
    query_results = test_technology_queries()
    field_results = test_technology_fields()
    mutation_results = test_mutation_schema()
    existing_data_results = test_existing_data()
    
    # Compile results
    all_results = {
        "schema_types": schema_types,
        "query_results": query_results,
        "field_results": field_results,
        "mutation_results": mutation_results,
        "existing_data_results": existing_data_results
    }
    
    # Save results to file
    with open('technology_schema_test_results.json', 'w') as f:
        json.dump(all_results, f, indent=2, default=str)
    
    logger.info("📊 Test Results Summary:")
    logger.info("=" * 50)
    
    # Summary
    logger.info(f"Schema Types Found: {len(schema_types)}")
    logger.info(f"Query Tests: {len([r for r in query_results.values() if 'error' not in r])} successful")
    logger.info(f"Field Tests: {len([r for r in field_results.values() if 'error' not in r])} successful")
    logger.info(f"Mutation Tests: {len([r for r in mutation_results.values() if 'error' not in r])} successful")
    
    logger.info("\n📁 Results saved to: technology_schema_test_results.json")
    logger.info("🔍 Review the results to understand the correct schema structure")

if __name__ == "__main__":
    main()



