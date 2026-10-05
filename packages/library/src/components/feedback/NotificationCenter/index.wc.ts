import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '../../../constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';
import NotificationCenterVueComponent from './index.ce.vue';

const NotificationCenterVueElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(NotificationCenterVueComponent, `${UIKIT_NAME}-notification-center`, { hostRole: 'region' });

export class NotificationCenterElement extends NotificationCenterVueElement {
  static readonly tagName = NotificationCenterVueElement.tagName;

  override dispatchEvent(event: Event): boolean {
    if (event instanceof CustomEvent) {
      return super.dispatchEvent(
        new CustomEvent(event.type, {
          bubbles: true,
          cancelable: event.cancelable,
          composed: true,
          detail: event.detail,
        }),
      );
    }

    return super.dispatchEvent(event);
  }
}

export function defineNotificationCenter(): void {
  definePeauiCustomElement(NotificationCenterElement);
}

defineNotificationCenter();

export default NotificationCenterElement;
