// import { useMemo } from 'react';
// import { motion } from 'framer-motion';
// import { parseResponseSection } from '@/utils/responseMappers';
// import { SectionCard } from './SectionCard';

// export const DynamicResponseGrid = ({ response, type }) => {
//   const parsedSections = useMemo(() => {
//     return parseResponseSection(response, type);
//   }, [response, type]);

//   if (!parsedSections || parsedSections.length === 0) {
//     return null;
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-n-8 rounded-lg p-6">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//             <h2 className="text-white font-medium">{response.title}</h2>
//           </div>
//           <span className="text-xs text-n-3">
//             Response ID: {response.responseId}
//           </span>
//         </div>
//       </div>

//       {/* Sections Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {parsedSections.map((section, index) => (
//           <motion.div
//             key={index}
//             layout
//             className={section.fullWidth ? 'md:col-span-2' : ''}
//           >
//             <SectionCard section={section} />
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }; 