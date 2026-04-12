// Re-export the composed cap table panel.
// The panel itself lives at ./TeamCap/index.tsx; this module is kept as a
// thin shim so DashboardLayout.tsx's existing import (`../panels/TeamCapPanel`)
// continues to work unchanged.
export { default } from './TeamCap';
