# JEDI Components - Reusable Component System

This directory contains a complete set of reusable components for displaying JEDI content throughout the application. All components are designed to work with the JEDI data structure and can be easily customized and extended.

## Component Overview

### 1. **JediComponentCard** - Display JEDI Components
Displays a single JEDI component (Ensemble, Rules, Automate) with all its information.

```jsx
import { JediComponentCard } from '@/components/jedi';
import { JEDI_ENSEMBLE } from '@/constants/jedi';

<JediComponentCard 
  component={JEDI_ENSEMBLE}
  variant="detailed" // 'default', 'compact', 'detailed'
  showCapabilities={true}
  showProblem={true}
  showUserExperience={true}
/>
```

### 2. **JediImplementationCard** - Display Client Implementations
Shows real client implementations with results, business impact, and technical details.

```jsx
import { JediImplementationCard } from '@/components/jedi';
import { ENSEMBLE_IMPLEMENTATIONS } from '@/constants/jedi';

<JediImplementationCard 
  implementation={ENSEMBLE_IMPLEMENTATIONS[0]}
  variant="detailed" // 'default', 'compact', 'detailed'
  showTechnicalDetails={true}
  showBusinessImpact={true}
  showScalability={true}
/>
```

### 3. **JediCapabilityList** - Display Capabilities
Shows component capabilities in different layouts and formats.

```jsx
import { JediCapabilityList } from '@/components/jedi';
import { JEDI_ENSEMBLE } from '@/constants/jedi';

<JediCapabilityList 
  capabilities={JEDI_ENSEMBLE.capabilities}
  variant="grid" // 'default', 'compact', 'detailed', 'grid'
  showSecondary={true}
/>
```

### 4. **JediResultsGrid** - Display Results/Metrics
Shows results and metrics in various formats.

```jsx
import { JediResultsGrid } from '@/components/jedi';

<JediResultsGrid 
  results={{
    responseTime: '80% faster',
    customerSatisfaction: '60% improvement',
    costReduction: '40% lower costs'
  }}
  variant="default" // 'default', 'compact', 'detailed', 'horizontal'
  showLabels={true}
/>
```

### 5. **JediComponentShowcase** - Complete Showcase
Combines all components into a complete showcase with tabs.

```jsx
import { JediComponentShowcase } from '@/components/jedi';
import { JEDI_ENSEMBLE, ENSEMBLE_IMPLEMENTATIONS } from '@/constants/jedi';

<JediComponentShowcase 
  component={JEDI_ENSEMBLE}
  implementations={ENSEMBLE_IMPLEMENTATIONS}
/>
```

### 6. **JediComparisonTable** - Compare Components
Compares multiple JEDI components side by side.

```jsx
import { JediComparisonTable } from '@/components/jedi';
import { JEDI_ENSEMBLE, JEDI_RULES, JEDI_AUTOMATE } from '@/constants/jedi';

<JediComparisonTable 
  components={[JEDI_ENSEMBLE, JEDI_RULES, JEDI_AUTOMATE]}
  comparisonFields={['name', 'tagline', 'capabilities', 'userExperience']}
/>
```

## Usage Examples

### Technology Page Integration
```jsx
import { JediComponentShowcase } from '@/components/jedi';
import { JEDI_ENSEMBLE, ENSEMBLE_IMPLEMENTATIONS } from '@/constants/jedi';

const TechnologyPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <JediComponentShowcase 
        component={JEDI_ENSEMBLE}
        implementations={ENSEMBLE_IMPLEMENTATIONS}
      />
    </div>
  );
};
```

### Industry Application Page
```jsx
import { JediImplementationCard, JediResultsGrid } from '@/components/jedi';
import { getImplementationsByIndustry } from '@/constants/jedi';

const IndustryPage = ({ industry }) => {
  const implementations = getImplementationsByIndustry(industry);
  
  return (
    <div className="space-y-8">
      {implementations.map((impl, index) => (
        <JediImplementationCard 
          key={index}
          implementation={impl}
          variant="detailed"
        />
      ))}
    </div>
  );
};
```

### Solutions Page
```jsx
import { JediComparisonTable, JediComponentCard } from '@/components/jedi';
import { ALL_JEDI_COMPONENTS } from '@/constants/jedi';

const SolutionsPage = () => {
  return (
    <div className="space-y-8">
      <JediComparisonTable 
        components={ALL_JEDI_COMPONENTS}
        comparisonFields={['name', 'tagline', 'capabilities']}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ALL_JEDI_COMPONENTS.map((component, index) => (
          <JediComponentCard 
            key={index}
            component={component}
            variant="compact"
          />
        ))}
      </div>
    </div>
  );
};
```

## Component Props

### JediComponentCard
- `component` (object): JEDI component data
- `variant` (string): 'default', 'compact', 'detailed'
- `showCapabilities` (boolean): Show capabilities section
- `showProblem` (boolean): Show problem section
- `showUserExperience` (boolean): Show user experience section
- `className` (string): Additional CSS classes

### JediImplementationCard
- `implementation` (object): Implementation data
- `variant` (string): 'default', 'compact', 'detailed'
- `showTechnicalDetails` (boolean): Show technical details
- `showBusinessImpact` (boolean): Show business impact
- `showScalability` (boolean): Show scalability info
- `className` (string): Additional CSS classes

### JediCapabilityList
- `capabilities` (object): Capabilities data
- `variant` (string): 'default', 'compact', 'detailed', 'grid'
- `showSecondary` (boolean): Show secondary capabilities
- `className` (string): Additional CSS classes

### JediResultsGrid
- `results` (object): Results data
- `variant` (string): 'default', 'compact', 'detailed', 'horizontal'
- `showLabels` (boolean): Show result labels
- `className` (string): Additional CSS classes

## Styling

All components use Tailwind CSS classes and support dark mode. They include:
- Responsive design (mobile-first)
- Dark mode support
- Smooth animations with Framer Motion
- Consistent color scheme
- Accessible design patterns

## Customization

### Adding New Variants
To add a new variant to a component:

1. Add the variant to the component's switch statement
2. Create the render function for the new variant
3. Update the component's prop types
4. Document the new variant

### Adding New Fields
To add new fields to comparison tables:

1. Add the field to the `getFieldValue` function
2. Add the field label to the `getFieldLabel` function
3. Update the `comparisonFields` prop default

### Custom Styling
All components accept a `className` prop for additional styling. You can also modify the Tailwind classes directly in the component files.

## Data Structure

All components expect data in the JEDI data structure format. See `src/constants/jedi/README.md` for the complete data structure documentation.

## Performance

- Components use React.memo where appropriate
- Animations are optimized with Framer Motion
- Images and heavy content are lazy-loaded
- Components are tree-shakeable

## Accessibility

- All components include proper ARIA labels
- Keyboard navigation is supported
- Screen reader friendly
- High contrast support
- Focus management

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers
- IE11+ (with polyfills)
- Progressive enhancement
