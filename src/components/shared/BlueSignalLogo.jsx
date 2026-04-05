// Inline SVG logo — the blue curved lines mark from bluesignal.xyz
const BlueSignalLogo = ({ size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="BlueSignal"
  >
    <path d="M4 8 C8 5, 16 5, 24 8" stroke="#2d8cf0" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <path d="M4 14 C8 11, 16 11, 24 14" stroke="#2d8cf0" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <path d="M4 20 C8 17, 16 17, 24 20" stroke="#2d8cf0" strokeWidth="2.2" strokeLinecap="round" fill="none" />
  </svg>
);

export default BlueSignalLogo;
