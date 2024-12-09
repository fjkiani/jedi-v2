// import { motion } from 'framer-motion';

// export const SectionCard = ({ section }) => {
//   const isDiscoverySection = section.title === 'MAJOR DISCOVERIES';
  
//   return (
//     <div className="bg-n-8 rounded-lg p-6">
//       {/* Section Header */}
//       <div className="flex items-center gap-2 mb-4">
//         {section.icon && <span className="text-xl">{section.icon}</span>}
//         <h3 className="text-white font-medium text-lg">
//           {section.title}
//         </h3>
//       </div>

//       {/* Discovery Items */}
//       {isDiscoverySection ? (
//         <div className="space-y-6">
//           <p className="text-n-3">{section.description}</p>
//           {section.discoveries?.map((discovery, idx) => (
//             <div key={idx} className="space-y-4">
//               {/* Discovery Title */}
//               <div className="flex items-center gap-2">
//                 <span className="text-amber-500">♦</span>
//                 <h4 className="text-white font-medium">{discovery.title}</h4>
//               </div>

//               {/* How AI Helped Section */}
//               {discovery.process && (
//                 <div className="space-y-2">
//                   <p className="text-n-3">How AI Helped:</p>
//                   <div className="space-y-2 pl-4">
//                     {discovery.process.steps.map((step, stepIdx) => (
//                       <div key={stepIdx} className="flex items-start gap-2 text-n-3">
//                         <span className="text-n-4">-</span>
//                         <span>{step}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Breakthrough Result Section */}
//               {discovery.result && (
//                 <div className="space-y-2 mt-4 pt-4 border-t border-n-6">
//                   <p className="text-white">BREAKTHROUGH RESULT</p>
//                   <div className="text-primary-1 font-medium">
//                     ✨ {discovery.result.highlight}
//                   </div>
//                   <div className="space-y-2 pl-4">
//                     {discovery.result.points.map((point, pointIdx) => (
//                       <div key={pointIdx} className="flex items-start gap-2 text-n-3">
//                         <span>•</span>
//                         <span>{point}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       ) : (
//         // Regular Section Content
//         <div className="space-y-2">
//           {section.items?.map((item, idx) => (
//             <div key={idx} className="flex items-start gap-2">
//               <span className="text-primary-1">•</span>
//               <span className="text-n-3">{item.text}</span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }; 