/**
 * AudienceToggle — dark-themed pill switcher for Homeowner / Utility.
 * Matches the hero section Eyebrow aesthetic.
 */

import styled from 'styled-components';

const SPRING = 'cubic-bezier(0.16, 1, 0.3, 1)';

const Track = styled.div`
  position: relative;
  display: inline-flex;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  padding: 3px;
`;

const Indicator = styled.div`
  position: absolute;
  top: 3px;
  left: 3px;
  width: calc(50% - 3px);
  height: calc(100% - 6px);
  border-radius: 100px;
  background: ${({ $audience }) =>
    $audience === 'utility'
      ? 'rgba(59, 130, 246, 0.15)'
      : 'rgba(6, 182, 212, 0.15)'};
  border: 1px solid
    ${({ $audience }) =>
      $audience === 'utility'
        ? 'rgba(59, 130, 246, 0.25)'
        : 'rgba(6, 182, 212, 0.25)'};
  transition: transform 200ms ${SPRING}, background 200ms ease, border-color 200ms ease;
  transform: translateX(${({ $audience }) => ($audience === 'utility' ? '100%' : '0')});
  pointer-events: none;
`;

const Segment = styled.button`
  position: relative;
  z-index: 1;
  background: none;
  border: none;
  padding: 7px 20px;
  font-family: ${({ theme }) => theme.fonts?.mono || "'IBM Plex Mono', monospace"};
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ $active, $audience }) =>
    $active
      ? $audience === 'utility'
        ? 'rgba(59, 130, 246, 0.9)'
        : 'rgba(6, 182, 212, 0.9)'
      : 'rgba(255, 255, 255, 0.35)'};
  cursor: pointer;
  transition: color 200ms ease;
  white-space: nowrap;

  &:hover:not([data-active='true']) {
    color: rgba(255, 255, 255, 0.55);
  }
`;

export function AudienceToggle({ audience, onToggle }) {
  return (
    <Track role="radiogroup" aria-label="Select audience">
      <Indicator $audience={audience} />
      <Segment
        type="button"
        role="radio"
        aria-checked={audience === 'homeowner'}
        data-active={audience === 'homeowner'}
        $active={audience === 'homeowner'}
        $audience={audience}
        onClick={() => onToggle('homeowner')}
      >
        Homeowner
      </Segment>
      <Segment
        type="button"
        role="radio"
        aria-checked={audience === 'utility'}
        data-active={audience === 'utility'}
        $active={audience === 'utility'}
        $audience={audience}
        onClick={() => onToggle('utility')}
      >
        Utility
      </Segment>
    </Track>
  );
}
