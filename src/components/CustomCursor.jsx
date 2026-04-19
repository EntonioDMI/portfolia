import { motion, useMotionValue, useSpring } from 'motion/react';
import { useEffect, useState } from 'react';

const spring = { stiffness: 220, damping: 28, mass: 0.45 };

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const x = useMotionValue(-160);
  const y = useMotionValue(-160);
  const smoothX = useSpring(x, spring);
  const smoothY = useSpring(y, spring);

  useEffect(() => {
    const pointerMedia = window.matchMedia('(pointer: fine) and (hover: hover)');
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateState = () => {
      const shouldEnable = pointerMedia.matches && !motionMedia.matches;
      setEnabled(shouldEnable);
      document.documentElement.classList.toggle('has-custom-cursor', shouldEnable);
    };

    updateState();
    pointerMedia.addEventListener('change', updateState);
    motionMedia.addEventListener('change', updateState);

    return () => {
      pointerMedia.removeEventListener('change', updateState);
      motionMedia.removeEventListener('change', updateState);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const handlePointerMove = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    const handlePointerOver = (event) => {
      setActive(Boolean(event.target.closest('button, a, [data-cursor="active"]')));
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerover', handlePointerOver);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerover', handlePointerOver);
    };
  }, [enabled, x, y]);

  if (!enabled) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-5 w-5 rounded-full border border-white/30 bg-white/8 backdrop-blur-sm md:block"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        scale: active ? 2.35 : 1,
        opacity: active ? 0.72 : 0.42,
      }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
