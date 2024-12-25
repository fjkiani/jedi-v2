import { Tab } from "@headlessui/react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const TabsRoot = ({ value, onValueChange, children }) => {
  return (
    <Tab.Group
      value={value}
      onValueChange={(newValue) => {
        console.log('Tab changing to:', newValue); // Debug log
        onValueChange(newValue);
      }}
    >
      {children}
    </Tab.Group>
  );
};

export const TabsList = ({ children }) => (
  <Tab.List className="flex space-x-1 rounded-2xl bg-n-7/50 p-1.5 backdrop-blur border border-n-6">
    {children}
  </Tab.List>
);

export const TabTrigger = ({ children }) => (
  <Tab className={({ selected }) => cn(
    "relative w-full rounded-xl py-3 px-6 text-sm font-medium transition-all",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-color-1",
    selected
      ? "text-white"
      : "text-n-3 hover:text-white hover:bg-n-6/50"
  )}>
    {({ selected }) => (
      <>
        <span className="relative z-10">{children}</span>
        {selected && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-gradient-to-r from-color-1/80 to-color-2/80 rounded-xl"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </>
    )}
  </Tab>
);

export const TabContent = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
);

export const TabsContent = ({ children }) => (
  <Tab.Panels className="mt-8">
    {children}
  </Tab.Panels>
);

export const TabPanel = ({ children }) => (
  <Tab.Panel>
    <TabContent>{children}</TabContent>
  </Tab.Panel>
); 