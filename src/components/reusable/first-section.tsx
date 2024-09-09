import { Check } from "lucide-react";
import { motion } from 'framer-motion';
import { staggerContainer } from '../../../utils/motion';
import { styles } from '../../../styles';

// Define the fade in variants for animation
const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const FirstSection = ({ projectDetails }) => {
  const { title, subtitle, description, videoSrc, benefits } = projectDetails;

  return (
    <div className="py-10 md:py-20">
      <div className="space-y-4 px-5 md:px-10">
        {/* <motion.p
          className="text-base md:text-xl lg:text-2xl font-light text-gray-600 leading-normal text-center max-w-3xl mx-auto"
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.25 }}
        >
          {description}
        </motion.p> */}

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.25 }}
          className={`${styles.innerWidth} mx-auto flex flex-col`}
        >
          <motion.div
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.25 }}
            className="pt-10 md:pt-20 flex justify-center"
          >
            <video
              className="rounded-xl md:rounded-xl shadow-lg w-full max-w-5xl mx-auto"
              controls
              autoPlay
              muted
              loop
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </motion.div>
        
      </div>
    </div>
  );
};

export default FirstSection;
