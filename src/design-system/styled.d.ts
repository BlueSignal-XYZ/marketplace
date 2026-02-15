/**
 * Styled-components theme type augmentation.
 *
 * This tells styled-components what shape `props.theme` has,
 * so every styled component gets full autocomplete and type safety
 * for theme tokens without manual casting.
 */

import 'styled-components';
import type { WQTTheme } from './themes/wqtTheme';
import type { CloudTheme } from './themes/cloudTheme';

type AppTheme = WQTTheme | CloudTheme;

declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}
