// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// escapes a block of code
function escape(s) {
  return s.replace(/[^0-9A-Za-z ]/g, function(c) {
    return '&#' + c.charCodeAt(0) + ';';
  });
}

// auto-scroll (https://pawelgrzybek.com/page-scroll-in-vanilla-javascript/)
function scrollIt(destination, duration = 200, easing = 'linear', callback) {
  const easings = {
    linear(t) {
      return t;
    },
    easeInQuad(t) {
      return t * t;
    },
    easeOutQuad(t) {
      return t * (2 - t);
    },
    easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic(t) {
      return t * t * t;
    },
    easeOutCubic(t) {
      return --t * t * t + 1;
    },
    easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    easeInQuart(t) {
      return t * t * t * t;
    },
    easeOutQuart(t) {
      return 1 - --t * t * t * t;
    },
    easeInOutQuart(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    easeInQuint(t) {
      return t * t * t * t * t;
    },
    easeOutQuint(t) {
      return 1 + --t * t * t * t * t;
    },
    easeInOutQuint(t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    }
  };

  const start = window.pageYOffset;
  const startTime =
    'now' in window.performance ? performance.now() : new Date().getTime();

  const documentHeight = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
  );
  const windowHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.getElementsByTagName('body')[0].clientHeight;
  const destinationOffset =
    typeof destination === 'number' ? destination : destination.offsetTop;

  // Check for mobile nav
  function scrollOffset() {
    if (!checkMediaQuery('md')) {
      return 25 + 65; // mobile nav has 65px height
    } else {
      return 25;
    }
  }

  const destinationOffsetToScroll = Math.round(
    documentHeight - destinationOffset < windowHeight
      ? documentHeight - windowHeight - scrollOffset()
      : destinationOffset - scrollOffset()
  ); // scroll offset from top

  if ('requestAnimationFrame' in window === false) {
    window.scroll(0, destinationOffsetToScroll);
    if (callback) {
      callback();
    }
    return;
  }

  function scroll() {
    const now =
      'now' in window.performance ? performance.now() : new Date().getTime();
    const time = Math.min(1, (now - startTime) / duration);
    const timeFunction = easings[easing](time);
    window.scroll(
      0,
      timeFunction * (destinationOffsetToScroll - start) + start
    );

    if (window.pageYOffset === destinationOffsetToScroll) {
      if (callback) {
        callback();
      }
      return;
    }
    requestAnimationFrame(scroll);
  }
  scroll();
}

function checkMediaQuery(size) {
  let breakpoint;

  // Get sizes based on CSS breakpoints
  switch (size) {
    case 'xs':
      breakpoint = 320;
      break;
    case 'sm':
      breakpoint = 650;
      break;
    case 'md':
      breakpoint = 768;
      break;
    case 'lg':
      breakpoint = 1024;
      break;
    case 'xl':
      breakpoint = 1440;
      break;
    // if not using a CSS breakpoint, use parameter for size
    default:
      breakpoint = size;
  }

  return window.matchMedia(`(min-width: ${breakpoint}px)`).matches;
}
