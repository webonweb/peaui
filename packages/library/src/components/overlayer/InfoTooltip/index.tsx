import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { InfoTooltipRenderer } from '@/react/renderer-entries/info-tooltip.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type InfoTooltipProps = PeauiReactProps<'InfoTooltip'>;

const InfoTooltip = createDirectReactComponent('InfoTooltip', InfoTooltipRenderer);

export default InfoTooltip;
