#!/usr/bin/env python3

import os
import logging
import json
from dotenv import load_dotenv
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport

# --- Configuration ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
load_dotenv()

ENDPOINT = os.getenv("VITE_HYGRAPH_ENDPOINT")
TOKEN = os.getenv("VITE_HYGRAPH_TOKEN")

if not ENDPOINT or not TOKEN:
    logging.error("Hygraph configuration missing in .env file")
    exit(1)

# --- GraphQL Client Setup ---
transport = RequestsHTTPTransport(
    url=ENDPOINT,
    headers={
        "Authorization": f"Bearer {TOKEN}",
        "gcms-stage": "PUBLISHED"
    },
    verify=True,
    retries=3,
)
client = Client(transport=transport, fetch_schema_from_transport=False)

# --- GraphQL Queries ---
GET_INDUSTRY_APPLICATIONS = gql("""
  query GetIndustryApplications {
    industryApplications(stage: PUBLISHED) {
      id
      title
      description
      industryChallenge
      jediApproach
      industry {
        id
        name
        slug
      }
      jediComponents {
        id
        name
      }
    }
  }
""")

def audit_industry_applications():
    """Audit current industry applications to understand content depth"""
    logging.info("Starting industry applications audit...")
    
    try:
        # Get all industry applications
        result = client.execute(GET_INDUSTRY_APPLICATIONS)
        applications = result.get('industryApplications', [])
        
        logging.info(f"Found {len(applications)} industry applications")
        
        # Analyze each application
        analysis = {
            'total_applications': len(applications),
            'by_industry': {},
            'content_analysis': {
                'has_description': 0,
                'has_challenge': 0,
                'has_approach': 0,
                'has_components': 0,
                'missing_content': []
            },
            'applications': []
        }
        
        for app in applications:
            industry_name = app['industry']['name'] if app['industry'] else 'Unknown'
            
            # Track by industry
            if industry_name not in analysis['by_industry']:
                analysis['by_industry'][industry_name] = 0
            analysis['by_industry'][industry_name] += 1
            
            # Analyze content completeness
            has_description = bool(app.get('description') and len(app['description'].strip()) > 50)
            has_challenge = bool(app.get('industryChallenge') and len(app['industryChallenge'].strip()) > 50)
            has_approach = bool(app.get('jediApproach') and len(app['jediApproach'].strip()) > 50)
            has_components = bool(app.get('jediComponents') and len(app['jediComponents']) > 0)
            
            if has_description:
                analysis['content_analysis']['has_description'] += 1
            if has_challenge:
                analysis['content_analysis']['has_challenge'] += 1
            if has_approach:
                analysis['content_analysis']['has_approach'] += 1
            if has_components:
                analysis['content_analysis']['has_components'] += 1
            
            # Track applications that need enhancement
            missing_fields = []
            if not has_description:
                missing_fields.append('description')
            if not has_challenge:
                missing_fields.append('industryChallenge')
            if not has_approach:
                missing_fields.append('jediApproach')
            if not has_components:
                missing_fields.append('jediComponents')
            
            if missing_fields:
                analysis['content_analysis']['missing_content'].append({
                    'id': app['id'],
                    'title': app['title'],
                    'industry': industry_name,
                    'missing_fields': missing_fields
                })
            
            # Store application details
            analysis['applications'].append({
                'id': app['id'],
                'title': app['title'],
                'industry': industry_name,
                'industry_slug': app['industry']['slug'] if app['industry'] else None,
                'content_completeness': {
                    'description': has_description,
                    'challenge': has_challenge,
                    'approach': has_approach,
                    'components': has_components
                },
                'component_count': len(app.get('jediComponents', [])),
                'description_length': len(app.get('description', '')),
                'challenge_length': len(app.get('industryChallenge', '')),
                'approach_length': len(app.get('jediApproach', ''))
            })
        
        # Print analysis results
        print("\n" + "="*80)
        print("INDUSTRY APPLICATIONS AUDIT RESULTS")
        print("="*80)
        
        print(f"\nTOTAL APPLICATIONS: {analysis['total_applications']}")
        
        print(f"\nAPPLICATIONS BY INDUSTRY:")
        for industry, count in sorted(analysis['by_industry'].items()):
            print(f"  {industry}: {count}")
        
        print(f"\nCONTENT COMPLETENESS:")
        total = analysis['total_applications']
        content = analysis['content_analysis']
        print(f"  Has Description (>50 chars): {content['has_description']}/{total} ({content['has_description']/total*100:.1f}%)")
        print(f"  Has Industry Challenge: {content['has_challenge']}/{total} ({content['has_challenge']/total*100:.1f}%)")
        print(f"  Has JEDI Approach: {content['has_approach']}/{total} ({content['has_approach']/total*100:.1f}%)")
        print(f"  Has Components Linked: {content['has_components']}/{total} ({content['has_components']/total*100:.1f}%)")
        
        print(f"\nAPPLICATIONS NEEDING ENHANCEMENT: {len(content['missing_content'])}")
        if content['missing_content']:
            for app in content['missing_content']:
                print(f"  {app['title']} ({app['industry']}) - Missing: {', '.join(app['missing_fields'])}")
        
        print(f"\nDETAILED APPLICATION ANALYSIS:")
        for app in analysis['applications']:
            completeness = sum(app['content_completeness'].values())
            print(f"\n  {app['title']} ({app['industry']})")
            print(f"    Completeness: {completeness}/4 fields")
            print(f"    Description: {app['description_length']} chars")
            print(f"    Challenge: {app['challenge_length']} chars")
            print(f"    Approach: {app['approach_length']} chars")
            print(f"    Components: {app['component_count']} linked")
        
        # Save detailed analysis to file
        with open('industry_applications_audit.json', 'w') as f:
            json.dump(analysis, f, indent=2)
        
        logging.info("Audit completed. Detailed results saved to industry_applications_audit.json")
        
        return analysis
        
    except Exception as e:
        logging.error(f"Error during audit: {e}")
        return None

if __name__ == "__main__":
    audit_industry_applications() 