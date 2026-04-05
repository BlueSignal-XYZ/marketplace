import { motion } from 'framer-motion';

const spinnerVariants = {
  animation: {
    rotate: 360,
    transition: {
      loop: Infinity,
      ease: 'linear',
      duration: 1,
    },
  },
};

const Spinner = () => (
  <motion.svg
    variants={spinnerVariants}
    animate="animation"
    xmlns="http://www.w3.org/2000/svg"
    width="50"
    height="50"
    viewBox="0 0 50 50"
  >
    <motion.circle
      cx="25"
      cy="25"
      r="20"
      stroke="dodgerblue"
      strokeWidth="4"
      strokeLinecap="round"
      fill="transparent"
      initial={{
        pathLength: 0,
        opacity: [0, 1, 1, 0],
      }}
      animate={{
        pathLength: [0, 0.9, 0.9, 0],
        opacity: [0, 1, 1, 0],
        rotate: [0, 360],
      }}
      transition={{
        loop: Infinity,
        ease: 'linear',
        times: [0, 0.25, 0.75, 1],
        duration: 1.5,
      }}
    />
  </motion.svg>
);

export default Spinner;
