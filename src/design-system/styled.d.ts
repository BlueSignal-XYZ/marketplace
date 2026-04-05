/**
 * Styled-components theme type augmentation.
 *
 * This tells styled-components what shape `props.theme` has,
 * so every styled component gets full autocomplete and type safety
 * for theme tokens without manual casting.
 *
 * Both wqtTheme and cloudTheme share the same top-level structure.
 * We extend WQTTheme to provide the full key set; CloudTheme has
 * identical keys so runtime works for both.
 */

import 'styled-components';
import type { WQTTheme } from './themes/wqtTheme';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends WQTTheme {}
}
