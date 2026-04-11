import 'styled-components';
import type { OpsTheme } from './theme/tokens';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends OpsTheme {}
}
