# Technology Update Strategy

## 🔍 Audit Summary

Based on comprehensive audit of 100 technologies in Hygraph:

### Key Findings

1. **Schema Mismatch**: Component queries `technology` (singular) with `icon { url }`, but schema uses `technologyS` (plural) with `icon` as String
2. **Missing Fields**: `documentation`, `github`, `website` fields don't exist in Technology schema
3. **Relation Fields**: `features`, `services`, `primaryUses`, `metrics`, `deployment` are queried as relations but may not exist or be empty
4. **Data Structure**: 
   - `features` and `businessMetrics` are **strings** (comma-separated), not arrays
   - `additonalDetails` is a string field (note: typo in schema "additonal")
   - Category shows as "Uncategorized" for many technologies (category relation issue)

---

## 📊 Current State: Weaviate Example

### What Exists in Hygraph:
- ✅ `description` (String)
- ✅ `features` (String - comma-separated): "Vector Similarity Search, GraphQL API Interface, Multi-modal Data Support..."
- ✅ `businessMetrics` (String - comma-separated): "Improves search relevance by 85%, enables sub-100ms query response times..."
- ✅ `category` (Relation - but shows as undefined/null)
- ✅ `subcategories[]` (Relation array - 1 subcategory: "Vector Databases")
- ✅ `useCases[]` (Relation array - 3 use cases connected)
- ❌ `additonalDetails` (String - empty)
- ❌ `documentation` (String - doesn't exist in schema)
- ❌ `github` (String - doesn't exist in schema)
- ❌ `website` (String - doesn't exist in schema)

### What Component Expects:
- `icon { url }` - But icon is String, not Asset
- `features[]` - But features is String, not array
- `services[]` - Relation that may not exist
- `primaryUses[]` - Relation that may not exist
- `metrics[]` - Relation that may not exist
- `deployment` - Relation that may not exist
- `documentation` - String that doesn't exist
- `github` - String that doesn't exist
- `website` - String that doesn't exist

---

## 🎯 Update Strategy

### Phase 1: Fix Component Query (Immediate)

**Problem**: Component uses `technology` (singular) but should use `technologyS` (plural), and icon is String not Asset.

**Solution**: Update `HygraphTechnologyDetail.jsx` query:

```graphql
# Change from:
technology(where: { slug: $slug }) {
  icon {
    url
  }
}

# To:
technologyS(where: { slug: $slug }, first: 1) {
  icon  # String, not Asset
}
```

**Also fix**: Parse `features` string into array in component:
```javascript
const featuresArray = technology.features 
  ? technology.features.split(',').map(f => f.trim())
  : [];
```

---

### Phase 2: Add Missing Schema Fields (High Priority)

**Add to Hygraph Technology Model**:
- `documentation` (String, optional)
- `github` (String, optional)  
- `website` (String, optional)

**Migration Script**:
```javascript
// scripts/migrations/hygraph/add_resource_fields.js
const technologies = [
  {
    slug: 'weaviate',
    documentation: 'https://weaviate.io/developers/weaviate',
    github: 'https://github.com/weaviate/weaviate',
    website: 'https://weaviate.io'
  },
  // ... more technologies
];
```

---

### Phase 3: Populate Missing Content (Medium Priority)

#### 3.1 Connect Technologies to Use Cases
**Current**: Only 7 technologies have use cases connected
**Target**: Connect top 50 technologies to relevant use cases

**Script**: `scripts/migrations/hygraph/connect_technologies_to_usecases.js`

#### 3.2 Add Resource Links
**Current**: 0 technologies have documentation/github/website
**Target**: Add for all 100 technologies

**Data Sources**:
- Official documentation sites
- GitHub repositories
- Technology websites

#### 3.3 Fix Category Assignments
**Current**: Many show "Uncategorized"
**Target**: Properly assign categories (Machine-Learning, AI-Agents, etc.)

**Example**:
- Weaviate → Category: Machine-Learning
- LangChain → Category: AI-Agents
- etc.

---

### Phase 4: Enhance Content (Low Priority)

#### 4.1 Populate `additonalDetails`
**Current**: Most technologies have empty `additonalDetails`
**Target**: Add JEDI implementation details

**Use existing migration scripts**:
- `enhance_ml_technologies.js` - For ML category
- `enhance_ai_agents.js` - For AI Agents category
- Create similar scripts for other categories

#### 4.2 Parse Features String
**Current**: Features stored as comma-separated string
**Target**: Either keep as string (and parse in UI) OR create Features relation model

**Recommendation**: Keep as string, parse in component (simpler)

---

## 📋 Tab-by-Tab Update Plan

### Overview Tab ✅ (100% Complete)
**Status**: Working, but can enhance

**Enhancements**:
- Fix category display (currently shows "Uncategorized")
- Add metrics if relation exists
- Add deployment info if relation exists

---

### Features Tab ✅ (94% Complete)
**Status**: Mostly working, needs parsing

**Fixes Needed**:
1. Parse `features` string into array in component
2. Handle 6 technologies missing features
3. Check if `primaryUses` and `services` relations exist in schema

**Component Update**:
```javascript
// Parse features string
const featuresList = technology.features
  ? technology.features.split(',').map(f => f.trim())
  : [];

// Display as list
{featuresList.map((feature, idx) => (
  <li key={idx}>{feature}</li>
))}
```

---

### Architecture Tab ❌ (7% Complete)
**Status**: Only works when technology connected to use cases with architecture

**Solution**:
1. Connect technologies to use cases that have architecture
2. Or create architecture data on use cases
3. Or add architecture field directly to Technology model

**Priority Technologies**:
- Weaviate (already has 3 use cases ✅)
- LangChain (already has use cases ✅)
- Hugging Face (already has use cases ✅)
- FAISS, ChromaDB, etc. (need connections)

---

### Integration Tab ❌ (0% Complete)
**Status**: Fields don't exist in schema

**Solution**:
1. Add `documentation`, `github`, `website` fields to Technology schema
2. Populate with actual URLs
3. Update component to display these fields

**Alternative**: If can't modify schema, store URLs in `additonalDetails` and parse them

---

### Use Cases Tab ❌ (7% Complete)
**Status**: Only 7 technologies connected to use cases

**Solution**:
1. Create mapping of technologies to use cases
2. Use GraphQL mutation to connect:
   ```graphql
   mutation ConnectTechToUseCase($techId: ID!, $useCaseId: ID!) {
     updateTechnology(
       where: { id: $techId }
       data: { useCases: { connect: { id: $useCaseId } } }
     ) { id }
   }
   ```

**Priority**: Connect top 50 technologies first

---

### Resources Tab ❌ (0% Complete)
**Status**: Same as Integration tab - fields don't exist

**Solution**: Same as Integration tab - add fields to schema

---

## 🚀 Implementation Steps

### Step 1: Fix Component Query (1-2 hours)
- [ ] Update `HygraphTechnologyDetail.jsx` to use `technologyS` (plural)
- [ ] Fix icon field (String, not Asset)
- [ ] Parse features string into array
- [ ] Handle missing fields gracefully

### Step 2: Schema Updates (2-4 hours)
- [ ] Add `documentation`, `github`, `website` fields to Technology model in Hygraph
- [ ] Test queries with new fields
- [ ] Update component to use new fields

### Step 3: Data Population (4-8 hours)
- [ ] Create script to add resource links for top 50 technologies
- [ ] Create script to connect technologies to use cases
- [ ] Fix category assignments
- [ ] Run migration scripts

### Step 4: Testing (2-4 hours)
- [ ] Test Weaviate page with all tabs
- [ ] Test other high-priority technologies
- [ ] Verify all tabs display correctly
- [ ] Check mobile responsiveness

---

## 📁 Files to Update

### Component Files
1. `src/pages/technology/HygraphTechnologyDetail.jsx`
   - Fix query (use `technologyS` plural)
   - Fix icon field
   - Parse features string
   - Handle missing fields

### Migration Scripts (Create)
1. `scripts/migrations/hygraph/add_resource_fields.js` - Add documentation/github/website
2. `scripts/migrations/hygraph/connect_tech_to_usecases.js` - Connect technologies to use cases
3. `scripts/migrations/hygraph/fix_category_assignments.js` - Fix category relations

### Documentation
1. `TECHNOLOGY_TABS_AUDIT_SUMMARY.md` - This file
2. `technology_tabs_audit_report.json` - Detailed JSON data

---

## 🎯 Priority Technologies to Update First

Based on audit, these technologies should be updated first:

1. **Weaviate** ✅ (has use cases, needs resources)
2. **LangChain** ✅ (has use cases, needs resources)
3. **Hugging Face** ✅ (has use cases, needs resources)
4. **FAISS** (needs use cases + resources)
5. **ChromaDB** (needs use cases + resources)
6. **OpenAI GPT** (needs use cases + resources)
7. **Anthropic Claude** (needs use cases + resources)

---

## 💡 Key Insights

1. **Component query mismatch**: Uses `technology` (singular) but schema uses `technologyS` (plural)
2. **Icon field type**: Component expects Asset with `url`, but schema has String
3. **Features parsing**: Features are strings, need parsing in component
4. **Missing schema fields**: `documentation`, `github`, `website` need to be added
5. **Use case connections**: Only 7% connected - major opportunity
6. **Category issue**: Many technologies show "Uncategorized" - need to fix relations

---

## ✅ Next Actions

1. **Review audit results** with team
2. **Decide on schema changes** (add resource fields)
3. **Fix component query** to match actual schema
4. **Create migration scripts** for data population
5. **Test with Weaviate** as example
6. **Roll out to other technologies** incrementally

---

**Audit Completed**: $(date)
**Technologies Audited**: 100
**Report Files**: 
- `technology_tabs_audit_report.json`
- `TECHNOLOGY_TABS_AUDIT_SUMMARY.md`
- `TECHNOLOGY_UPDATE_STRATEGY.md` (this file)

