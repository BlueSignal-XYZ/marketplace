/**
 * Design System Themes — barrel export
 */

export { wqtTheme } from './wqtTheme';
export type { WQTTheme } from './wqtTheme';

export { cloudTheme } from './cloudTheme';
export type { CloudTheme } from './cloudTheme';

/** Union type of all platform themes — use in styled-components type augmentation */
export type AppTheme = import('./wqtTheme').WQTTheme | import('./cloudTheme').CloudTheme;
