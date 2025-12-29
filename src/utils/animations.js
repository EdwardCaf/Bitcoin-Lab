// Framer Motion animation variants

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};

export const popIn = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  },
  exit: { opacity: 0, scale: 0.5 }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

export const glow = {
  animate: {
    boxShadow: [
      '0 0 10px rgba(247, 147, 26, 0.2)',
      '0 0 20px rgba(247, 147, 26, 0.4)',
      '0 0 10px rgba(247, 147, 26, 0.2)'
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

export const shake = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
  }
};

export const successPop = {
  initial: { scale: 0, rotate: -180 },
  animate: { 
    scale: 1, 
    rotate: 0,
    transition: { type: 'spring', stiffness: 200, damping: 15 }
  }
};

export const coinDrop = {
  initial: { y: -100, opacity: 0, rotate: 0 },
  animate: { 
    y: 0, 
    opacity: 1,
    rotate: 360,
    transition: { 
      type: 'spring', 
      stiffness: 100, 
      damping: 10,
      rotate: { duration: 0.5 }
    }
  }
};

export const flowRight = {
  initial: { x: -50, opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

export const hashChange = {
  initial: { opacity: 0, y: -10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.15 }
  }
};

// Transition presets
export const transitions = {
  fast: { duration: 0.15 },
  base: { duration: 0.2 },
  slow: { duration: 0.3 },
  spring: { type: 'spring', stiffness: 300, damping: 20 },
  bounce: { type: 'spring', stiffness: 400, damping: 10 }
};

// Page transition
export const pageTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3 }
};
