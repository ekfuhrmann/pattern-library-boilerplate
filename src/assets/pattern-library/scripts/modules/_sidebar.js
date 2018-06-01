import { checkMediaQuery } from './_helpers';

// Build Subnav
(function subnav() {
  const currentLocation = window.location.href.split('/'); // break up the URL based on '/'
  const hashLength = window.location.hash.length; // get hash length if applicable

  let page = currentLocation[currentLocation.length - 1]; // get ending string of URL
  page = page.slice(0, page.length - hashLength); // ignore hash

  // Find current page section
  const checkSubnav = document.querySelector(`
        .pl-sidebar__nav >
        .pl-sidebar__item >
        .pl-sidebar__item-link[href*="${page}"]
    `);

  // If current page has subnav, show it and set onclick
  if (checkSubnav) {
    // Add active state to link
    checkSubnav.parentNode.classList.add('is-active');

    const sidebar = document.querySelector('.pl-sidebar > .pl-sidebar__nav'); // get sidebar
    const sidebarHeight = sidebar.offsetHeight; // get sidebar height based on viewport
    const sidebarSectionPosition = checkSubnav.parentNode.offsetTop; // calculate offset height from top for section

    // Scroll sidebar to section if it is larger than sidebarHeight - 200px
    if (sidebarHeight - 200 <= sidebarSectionPosition) {
      sidebar.scrollTo(0, sidebarSectionPosition);
    }

    // store mobile menu
    const mobileMenu = document.querySelector('.pl-sidebar__toggle');

    // toggle 'is-active' on click of mobile menu
    mobileMenu.onclick = function() {
      this.blur();
      document.querySelector('body').classList.toggle('no-scroll');
      document.querySelector('.pl-sidebar').classList.toggle('is-active');
    };
  }

  // Get Active Nav
  const activeSubNav = document.querySelector(
    '.pl-sidebar__nav > .pl-sidebar__item.is-active'
  );

  // Check that the page has an active subnav
  if (activeSubNav) {
    const getHeaders = document.querySelectorAll('.pl-pattern h3');
    const headerList = document.createElement('ul');

    headerList.className = 'pl-sidebar__nav';

    // Create a list based on each section within that page
    for (let i = 0; i < getHeaders.length; i++) {
      const node = document.createElement('li');
      const linkText = `${getHeaders[i].innerHTML}`;
      const linkUrl = linkText
        .replace(/\s+/g, '-') // replace spaces
        .replace('/', '-') // replace forward slashes
        .replace('&amp;', 'and') // replace ampersand
        .split(/[,.]+/)
        .join('')
        .toLowerCase();
      getHeaders[i].parentElement.parentElement.id = linkUrl;
      node.className = 'pl-sidebar__item';
      node.innerHTML = `<a class="pl-sidebar__item-link" href="#${linkUrl}">${linkText}</a>`;
      headerList.appendChild(node);
    }

    // Add list to nav
    activeSubNav.appendChild(headerList);

    // Scroll to subnav link
    const subnavLinks = document.querySelectorAll(
      '.pl-sidebar__nav .pl-sidebar__nav .pl-sidebar__item-link'
    );

    Array.from(subnavLinks).forEach(function(subnavLink) {
      const href = subnavLink.getAttribute('href');

      subnavLink.onclick = function(e) {
        e.preventDefault();
        this.blur();
        // Collapse menu on mobile
        if (!checkMediaQuery('md')) {
          document.querySelector('.pl-sidebar').classList.remove('is-active');
          document.querySelector('body').classList.remove('no-scroll');
        }
        scrollIt(document.querySelector(href), 300, 'easeOutQuad');
      };
    });

    // Highlight current section as user scrolls
    window.addEventListener('scroll', function() {
      getClosestSection();
    });
  }

  // locate section
  function getClosestSection() {
    if (
      document.querySelector(
        '.pl-sidebar__nav .pl-sidebar__nav .pl-sidebar__item-link'
      )
    ) {
      const sections = document.querySelectorAll('.pl-wrapper > .pl-pattern');
      const sectionsLength = sections.length;

      for (let index = 0; index < sectionsLength; index++) {
        if (sections[index].querySelector('h3') != null) {
          if (isBelowScroll(sections.item(index))) {
            break;
          }
          selectLink(sections.item(index).id);
        }
      }
    }
  }

  // check if section is below
  function isBelowScroll(element) {
    const position = element.getBoundingClientRect();
    // Check if using mobile menu
    if (!checkMediaQuery('md')) {
      return position.top - (30 + 70) > 0; // 70px to account for mobile height
    } else {
      return position.top - 30 > 0;
    }
  }

  // get section link
  function selectLink(id) {
    const subnavLinks = document.querySelectorAll(
      '.pl-sidebar__nav .pl-sidebar__nav .pl-sidebar__item-link'
    );

    // Remove is-active for any links
    Array.from(subnavLinks).forEach(function(subnavLink) {
      if (subnavLink.classList.contains('is-active')) {
        subnavLink.classList.remove('is-active');
      }
    });

    // Add is-active for current section
    document.querySelector(`a[href='#${id}']`).classList.add('is-active');
  }
})();
