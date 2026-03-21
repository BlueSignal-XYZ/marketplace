/**
 * RevealOnScroll — scroll-triggered fade-up animation wrapper.
 * Adapted from the BlueSignal landing page pattern.
 */

import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const SPRING_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

const Wrapper = styled.div`
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.7s ${SPRING_EASE},
              transform 0.7s ${SPRING_EASE};
  transition-delay: ${({ $delay }) => $delay || 0}s;
  min-width: 0;
  max-width: 100%;

  &.visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    transform: none;
    transition: none;
  }
`;

export default function RevealOnScroll({ children, delay = 0, threshold = 0.08, rootMargin = '0px 0px -40px 0px', className }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <Wrapper ref={ref} $delay={delay} className={className}>
      {children}
    </Wrapper>
  );
}
