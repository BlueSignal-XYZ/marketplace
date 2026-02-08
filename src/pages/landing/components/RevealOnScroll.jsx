import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.7s ${({ theme }) => theme.ease},
              transform 0.7s ${({ theme }) => theme.ease};
  transition-delay: ${({ $delay }) => $delay || 0}s;
  min-width: 0;
  max-width: 100%;

  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

const RevealOnScroll = ({ children, delay = 0, threshold = 0.08, rootMargin = '0px 0px -40px 0px', className }) => {
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
};

export default RevealOnScroll;
