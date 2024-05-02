export interface UseTouchReturn {
  /**
   * Whether the device has touch capabilities
   */
  hasTouch: Ref<boolean>;
}

let areEventsBound = false;
const hasTouch = ref(false);

export function useTouch(): UseTouchReturn {
  if (!areEventsBound) {
    // Detect if touch event is working as supposed => touch device
    useEventListener(
      'touchstart',
      () => {
        hasTouch.value = true;
        document.body.classList.add('has-touch');
      },
      { once: true }
    );

    // Prevent default touchmove event to remove 'overscroll' effect
    useEventListener(
      'touchmove',
      event => {
        event.preventDefault();
        return false;
      },
      { passive: false }
    );

    // Fake scroll by 1 to hide address bar in mobile
    useEventListener('load', () => {
      window.scrollTo(0, 1);
    });

    // Prevent touchmove defaults on everything in order to hide the address bar in chrome android
    document.querySelectorAll('*').forEach(element =>
      useEventListener(element, 'touchmove', event => event.preventDefault(), {
        passive: false,
      })
    );

    // Only bind events once
    areEventsBound = true;
  }
  return {
    hasTouch,
  };
}
