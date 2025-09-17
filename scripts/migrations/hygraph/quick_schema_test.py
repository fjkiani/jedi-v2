#!/usr/bin/env python3
"""
Quick Technology Schema Test

Run this to quickly test the basic schema structure for technologies.
"""

import os
import json
from dotenv import load_dotenv
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport

# Load environment
load_dotenv()
ENDPOINT = os.getenv("VITE_HYGRAPH_ENDPOINT")
TOKEN = os.getenv("VITE_HYGRAPH_TOKEN")

# Setup client
transport = RequestsHTTPTransport(
    url=ENDPOINT,
    headers={"Authorization": f"Bearer {TOKEN}", "gcms-stage": "DRAFT"},
    verify=True,
)
client = Client(transport=transport, fetch_schema_from_transport=False)

def quick_test():
    print("🔍 Quick Technology Schema Test")
    print("=" * 40)
    
    # Test 1: Basic queries
    tests = [
        ("Technologies (plural)", "technologies"),
        ("TechnologyS (plural S)", "technologyS"), 
        ("Technology (singular)", "technology"),
        ("Categories (plural)", "categories"),
        ("CategoryS (plural S)", "categoryS"),
        ("Category (singular)", "category")
    ]
    
    for name, query_name in tests:
        try:
            query = gql(f"""
                query {{
                    {query_name}(first: 3) {{
                        id
                        name
                        slug
                    }}
                }}
            """)
            result = client.execute(query)
            data = result.get(query_name, [])
            print(f"✅ {name}: Found {len(data)} items")
            if data:
                print(f"   Sample: {data[0].get('name', 'Unknown')}")
        except Exception as e:
            print(f"❌ {name}: Error - {str(e)[:100]}...")
    
    print("\n🔍 Testing Technology Fields...")
    
    # Test 2: Technology fields
    field_tests = [
        "features", "businessMetrics", "architecture", "integration", 
        "jediUsage", "category", "subcategories", "services", 
        "primaryUses", "metrics", "deployment", "compatibleWith", 
        "apis", "documentation", "github", "website", "dependencies"
    ]
    
    available_fields = []
    for field in field_tests:
        try:
            query = gql(f"""
                query {{
                    technologies(first: 1) {{
                        id
                        name
                        {field}
                    }}
                }}
            """)
            result = client.execute(query)
            available_fields.append(field)
            print(f"✅ {field}: Available")
        except Exception as e:
            print(f"❌ {field}: Not available - {str(e)[:50]}...")
    
    print(f"\n📊 Available fields: {available_fields}")
    
    # Test 3: Count existing data
    print("\n🔍 Counting Existing Data...")
    try:
        count_query = gql("""
            query {
                technologiesConnection {
                    aggregate {
                        count
                    }
                }
            }
        """)
        result = client.execute(count_query)
        count = result.get('technologiesConnection', {}).get('aggregate', {}).get('count', 0)
        print(f"📊 Total technologies: {count}")
    except Exception as e:
        print(f"❌ Count query failed: {e}")
    
    try:
        count_query = gql("""
            query {
                categoriesConnection {
                    aggregate {
                        count
                    }
                }
            }
        """)
        result = client.execute(count_query)
        count = result.get('categoriesConnection', {}).get('aggregate', {}).get('count', 0)
        print(f"📊 Total categories: {count}")
    except Exception as e:
        print(f"❌ Category count query failed: {e}")

if __name__ == "__main__":
    quick_test()


