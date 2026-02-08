/**
 * BlueSignal Logo — Three Wavy Lines
 *
 * Three horizontal wave strokes that evoke water currents and signal waves.
 * Used across the landing page: navigation, footer, and anywhere the brand
 * mark is needed.
 *
 * @param {number} size  - Width & height of the logo in px (square viewBox).
 * @param {string} color - Stroke color. Defaults to currentColor.
 * @param {string} className - Optional class (for styled-components).
 */
const BlueSignalLogo = ({ size = 28, color = 'currentColor', className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="BlueSignal"
  >
    <path d="M4 8 C8 5, 16 5, 24 8" stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <path d="M4 14 C8 11, 16 11, 24 14" stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <path d="M4 20 C8 17, 16 17, 24 20" stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none" />
  </svg>
);

export default BlueSignalLogo;
