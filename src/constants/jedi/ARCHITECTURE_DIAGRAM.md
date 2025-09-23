# JEDI Components - Modular Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    JEDI Components Structure                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  JEDI Ensemble  │    │   JEDI Rules    │    │ JEDI Automate   │
│  Multi-Model    │    │ Business Logic  │    │ Model Optimize  │
│  Orchestration  │    │     Engine      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   JEDI Core     │
                    │   Components    │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │  Real Client    │
                    │ Implementations │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Architecture  │
                    │   & Integration │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Helper        │
                    │   Functions     │
                    └─────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        File Structure                          │
└─────────────────────────────────────────────────────────────────┘

src/constants/jedi/
├── components/
│   ├── ensemble.js      ──► JEDI Ensemble™ definition
│   ├── rules.js         ──► JEDI Rules™ definition  
│   └── automate.js      ──► JEDI Automate™ definition
├── implementations/
│   ├── ensemble.js      ──► Go Answer, AISO, Interactive Agents
│   ├── rules.js         ──► Marketing, Finance, Healthcare
│   └── automate.js      ──► E-commerce, Fraud, Manufacturing
├── architecture/
│   └── index.js         ──► How components work together
├── utils/
│   └── helpers.js       ──► Utility functions
├── index.js             ──► Main export file
└── README.md            ──► Documentation

┌─────────────────────────────────────────────────────────────────┐
│                      Usage Examples                            │
└─────────────────────────────────────────────────────────────────┘

// Import individual components
import { JEDI_ENSEMBLE, JEDI_RULES, JEDI_AUTOMATE } from '@/constants/jedi';

// Import implementations
import { ENSEMBLE_IMPLEMENTATIONS } from '@/constants/jedi';

// Import helper functions
import { getJediComponentById, getImplementationsByIndustry } from '@/constants/jedi';

// Import everything
import * as JEDI from '@/constants/jedi';

┌─────────────────────────────────────────────────────────────────┐
│                    Key Benefits                                 │
└─────────────────────────────────────────────────────────────────┘

✅ Modular Structure    - Easy to maintain and extend
✅ Separation of Concerns - Components vs Implementations
✅ Reusable Components  - Can be combined for any use case
✅ Scalable Architecture - Grows with business needs
✅ Type Safety         - Clear interfaces and contracts
✅ Backward Compatible - Old code still works
✅ Well Documented     - Clear README and examples
✅ Helper Functions    - Easy data access and manipulation

