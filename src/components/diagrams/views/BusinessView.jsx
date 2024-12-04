import React from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../../../components/icons';
import { SectionHeader } from '../shared/SectionHeader';

export const BusinessView = ({ diagram }) => {
  return (
    <motion.div className="space-y-8">
      {/* Business Value Section */}
      <motion.div className="space-y-4">
        <SectionHeader 
          title="Business Value" 
          count={diagram?.useCase?.businessValue?.length || 0}
        />
        <div className="grid grid-cols-2 gap-4">
          {diagram?.useCase?.businessValue?.map((value, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-3 p-4 bg-[#252631] rounded-xl"
            >
              <div className="mt-1">
                <Icons.checkCircle className="w-4 h-4 text-primary-1" />
              </div>
              <p className="text-n-3 text-sm">{value}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Capabilities Section */}
      <motion.div className="space-y-4">
        <SectionHeader 
          title="Capabilities" 
          count={diagram?.useCase?.capabilities?.length || 0}
        />
        <div className="grid grid-cols-2 gap-4">
          {diagram?.useCase?.capabilities?.map((capability, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-3 p-4 bg-[#252631] rounded-xl"
            >
              <div className="mt-1">
                <Icons.zap className="w-4 h-4 text-primary-1" />
              </div>
              <p className="text-n-3 text-sm">{capability}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Examples Section */}
      <motion.div className="space-y-4">
        <SectionHeader 
          title="Examples" 
          count={diagram?.useCase?.examples?.length || 0}
        />
        <div className="grid grid-cols-2 gap-4">
          {diagram?.useCase?.examples?.map((example, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-3 p-4 bg-[#252631] rounded-xl"
            >
              <div className="mt-1">
                <Icons.lightbulb className="w-4 h-4 text-primary-1" />
              </div>
              <p className="text-n-3 text-sm">{example}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}; 