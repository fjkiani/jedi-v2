// const UseCaseGrid = ({ useCase }) => {
//   const components = useCase?.implementation?.architecture?.components || [];
//   const flow = useCase?.implementation?.architecture?.flow || [];
//   const benefits = useCase?.implementation?.benefits || [];

//   if (!useCase?.implementation) {
//     return <div>No implementation details available</div>;
//   }

//   return (
//     <div className="space-y-8">
//       {/* Architecture Components */}
//       {components.length > 0 && (
//         <div>
//           <h3 className="text-lg font-semibold text-n-1 mb-4">Architecture Components</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {components.map((component, index) => (
//               <div
//                 key={index}
//                 className="bg-n-8 rounded-lg p-6 border border-n-6 hover:border-primary-1 transition-all duration-200"
//               >
//                 <h3 className="text-lg font-semibold text-n-1 mb-2">{component.name}</h3>
//                 <p className="text-n-3 text-sm mb-4">{component.description}</p>
//                 <div className="flex flex-wrap gap-2">
//                   {component.tech?.map((tech, techIndex) => (
//                     <span
//                       key={techIndex}
//                       className="px-2 py-1 text-xs rounded-full bg-n-7 text-n-2"
//                     >
//                       {tech}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Flow Steps */}
//       {flow.length > 0 && (
//         <div>
//           <h3 className="text-lg font-semibold text-n-1 mb-4">Process Flow</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {flow.map((step, index) => (
//               <div
//                 key={index}
//                 className="flex items-center space-x-3 p-4 bg-n-8 rounded-lg border border-n-6"
//               >
//                 <span className="text-primary-1 font-semibold">{index + 1}</span>
//                 <p className="text-n-2">{step}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Benefits */}
//       {benefits.length > 0 && (
//         <div>
//           <h3 className="text-lg font-semibold text-n-1 mb-4">Key Benefits</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {benefits.map((benefit, index) => (
//               <div
//                 key={index}
//                 className="p-4 bg-n-8 rounded-lg border border-n-6"
//               >
//                 <p className="text-n-2">{benefit}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UseCaseGrid; 