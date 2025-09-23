#!/bin/bash

# Quick Technology Schema Test using curl
# This script tests the Hygraph GraphQL endpoint directly

echo "🔍 Testing Technology Schema with curl"
echo "======================================"

# Load environment variables
if [ -f "../../../.env" ]; then
    source ../../../.env
else
    echo "❌ .env file not found"
    exit 1
fi

if [ -z "$VITE_HYGRAPH_ENDPOINT" ] || [ -z "$VITE_HYGRAPH_TOKEN" ]; then
    echo "❌ Hygraph environment variables not set"
    exit 1
fi

echo "📡 Endpoint: $VITE_HYGRAPH_ENDPOINT"
echo "🔑 Token: ${VITE_HYGRAPH_TOKEN:0:10}..."
echo ""

# Test 1: Basic technology queries
echo "🔍 Testing basic queries..."

# Test technologies (plural)
echo "Testing: technologies"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $VITE_HYGRAPH_TOKEN" \
  -d '{"query": "query { technologies(first: 3) { id name slug } }"}' \
  "$VITE_HYGRAPH_ENDPOINT" | jq '.data.technologies | length' 2>/dev/null || echo "❌ Failed"

# Test technologyS (plural with S)
echo "Testing: technologyS"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $VITE_HYGRAPH_TOKEN" \
  -d '{"query": "query { technologyS(first: 3) { id name slug } }"}' \
  "$VITE_HYGRAPH_ENDPOINT" | jq '.data.technologyS | length' 2>/dev/null || echo "❌ Failed"

# Test categories
echo "Testing: categories"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $VITE_HYGRAPH_TOKEN" \
  -d '{"query": "query { categories(first: 3) { id name slug } }"}' \
  "$VITE_HYGRAPH_ENDPOINT" | jq '.data.categories | length' 2>/dev/null || echo "❌ Failed"

echo ""
echo "🔍 Testing field availability..."

# Test specific fields
fields=("features" "businessMetrics" "architecture" "integration" "jediUsage" "category" "subcategories")

for field in "${fields[@]}"; do
    echo "Testing field: $field"
    curl -s -X POST \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $VITE_HYGRAPH_TOKEN" \
      -d "{\"query\": \"query { technologies(first: 1) { id name $field } }\"}" \
      "$VITE_HYGRAPH_ENDPOINT" | jq -r '.errors[0].message // "✅ Available"' 2>/dev/null || echo "❌ Failed"
done

echo ""
echo "🔍 Testing data counts..."

# Count technologies
echo "Counting technologies:"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $VITE_HYGRAPH_TOKEN" \
  -d '{"query": "query { technologiesConnection { aggregate { count } } }"}' \
  "$VITE_HYGRAPH_ENDPOINT" | jq '.data.technologiesConnection.aggregate.count' 2>/dev/null || echo "❌ Failed"

# Count categories
echo "Counting categories:"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $VITE_HYGRAPH_TOKEN" \
  -d '{"query": "query { categoriesConnection { aggregate { count } } }"}' \
  "$VITE_HYGRAPH_ENDPOINT" | jq '.data.categoriesConnection.aggregate.count' 2>/dev/null || echo "❌ Failed"

echo ""
echo "✅ Schema test completed!"
echo "📊 Review the results above to understand the correct schema structure"



