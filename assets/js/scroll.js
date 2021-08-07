const keys = {37: 1, 38: 1, 39: 1, 40: 1}

function scroll(status) {
  if (!status) {
    windowScroll(true);
  } else {
    windowScroll(false);
  }
}

function windowScroll(disable = false) {
  let supportsPassive = false;
  try {
    window.addEventListener(
        'scroldis',
        null,
        Object.defineProperty({}, 'passive', {
          get: function() {
            supportsPassive = true;
          },
        })
    );
  } catch (e) {}

  const wheelOpt = supportsPassive ? {passive: false} : false;
  const wheelEvent =
      'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

  // call this to Disable
  if (disable) {
    window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
  } else {
    // call this to Enable
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    window.removeEventListener('touchmove', preventDefault, wheelOpt);
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
  }
}

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

export {scroll}
