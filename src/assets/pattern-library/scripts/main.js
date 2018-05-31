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

// Build highlight.js code snippet
(function code() {
  // Get all snippets of code
  const snippets = document.querySelectorAll('pre code');

  // Find each snippet
  Array.from(snippets).forEach(function(snippet) {
    // escape the innerHTML
    const esc = escape(snippet.innerHTML);

    // Reasign escaped to node and initialize highlight.js
    snippet.innerHTML = esc;
    hljs.highlightBlock(snippet);
  });

  // Get code snippet
  const codeSnippets = document.querySelectorAll('.pl-pattern__code-block');

  // Check whether each page snippet needs to be expanded or not
  Array.from(codeSnippets).forEach(function(codeSnippet) {
    if (codeSnippet.querySelector('code').scrollHeight < 200 - 80) {
      codeSnippet.querySelector('.pl-pattern__code-fade').style.display =
        'none'; // remove fade & expand btn
      codeSnippet.querySelector(
        '.pl-btn.pl-pattern__code-btn.collapse'
      ).style.display =
        'none'; // remove collapse btn
      const styles = 'padding: 0; margin: 0;';
      codeSnippet.getElementsByTagName('code')[0].style = styles; // remove spacing for expand/collapse
    }
  });
})();

// Expand code snippet (Show More +)
(function codeExpand() {
  const expandBtns = document.querySelectorAll('.pl-pattern__code-fade');

  Array.from(expandBtns).forEach(function(btn) {
    btn.onclick = function(e) {
      e.preventDefault();
      this.blur();
      const codeHeight = this.previousSibling.scrollHeight + 80; // account for 40px padding
      this.parentElement.classList.add('is-expanded');
      this.parentElement.style.maxHeight = `${codeHeight}px`;
    };
  });
})();

// Collapse code snippet (Show Less -)
(function codeCollapse() {
  const collapseBtns = document.querySelectorAll(
    '.pl-pattern__code-btn.collapse'
  );

  Array.from(collapseBtns).forEach(function(btn) {
    btn.onclick = function(e) {
      e.preventDefault();
      btn.blur();
      this.parentElement.classList.remove('is-expanded');
      this.parentElement.style.removeProperty('max-height');
    };
  });
})();

// Copy code snippet
(function codeCopy() {
  const copyBtns = document.querySelectorAll('.pl-pattern__code-btn.copy');

  // Set for each code block on a page
  Array.from(copyBtns).forEach(function(btn) {
    btn.onclick = function(e) {
      e.preventDefault();
      // Save code to clipboard
      const clipboard = new Clipboard('.pl-pattern__code-btn.copy', {
        target: function(trigger) {
          return trigger.nextElementSibling.querySelector('code');
        }
      });

      // When successfully saved to clipboard, change text to reflect it
      clipboard.on('success', function(e) {
        e.clearSelection(); // prevent highlight
        e.trigger.childNodes[0].nodeValue = 'Copied'; // Inform user text copied
        window.setTimeout(function() {
          e.trigger.childNodes[0].nodeValue = 'Copy'; // Reset back to default after 2s
        }, 2000);
        btn.blur();
      });
    };
  });
})();

// Copy color hex
(function colorCopy() {
  const copyColor = document.querySelectorAll(
    '.pl-pattern__grid-item.pl-colors'
  );

  // Set for each code block on a page
  Array.from(copyColor).forEach(function(color) {
    // Calculate color luma for btn overlay
    const hexColor = color
      .querySelector('.pl-pattern__grid-text.pl-hex')
      .innerHTML.substring(1); // strip #
    const rgb = parseInt(hexColor, 16); // convert rrggbb to integer
    const r = (rgb >> 16) & 0xff; // extract red
    const g = (rgb >> 8) & 0xff; // extract green
    const b = (rgb >> 0) & 0xff; // extract blue

    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

    if (luma > 150) {
      color.querySelector('.pl-pattern__grid-btn.copy').classList.add('alt');
    }

    color.onclick = function(e) {
      e.preventDefault();
      // Save code to clipboard
      const clipboard = new Clipboard('.pl-pattern__grid-item.pl-colors', {
        target: function(trigger) {
          return trigger.querySelector('.pl-pattern__grid-text.pl-hex');
        }
      });

      // When successfully saved to clipboard, change text to reflect it
      clipboard.on('success', function(e) {
        e.clearSelection(); // prevent highlight
        e.trigger.querySelector('.pl-pattern__grid-btn.copy').innerHTML =
          'Copied HEX'; // Inform user text copied
        window.setTimeout(function() {
          e.trigger.querySelector('.pl-pattern__grid-btn.copy').innerHTML =
            'Copy HEX'; // Reset back to default after 2s
        }, 2000);
        color.blur();
      });
    };
  });
})();

// remove focus when icon is selected for download
(function iconBlur() {
  const icons = document.querySelectorAll('.pl-pattern__grid-item.pl-icons');

  Array.from(icons).forEach(function(icon) {
    icon.onclick = function() {
      this.blur();
    };
  });
})();

// Dynamic Code Preview
(function previewResize() {
  const mobilePreviews = document.querySelectorAll(
    '.has-mobile .pl-pattern__preview'
  );
  Array.from(mobilePreviews).forEach(function(mobilePreview) {
    // Toggle button variables
    // Setup desktop btn
    const desktopPreviewBtn = document.createElement('button');
    desktopPreviewBtn.className =
      'pl-pattern__preview-toggle pl-desktop is-active';
    desktopPreviewBtn.innerHTML = 'Desktop';
    mobilePreview.parentElement.parentElement.insertBefore(
      desktopPreviewBtn,
      mobilePreview.parentElement
    );
    const desktopPreviewContent = mobilePreview.querySelector(
      '.pl-pattern__preview--desktop'
    );

    // Setup mobile btn
    const mobilePreviewBtn = document.createElement('button');
    mobilePreviewBtn.className = 'pl-pattern__preview-toggle pl-mobile';
    mobilePreviewBtn.innerHTML = 'Mobile';
    mobilePreview.parentElement.parentElement.insertBefore(
      mobilePreviewBtn,
      mobilePreview.parentElement
    );
    const mobilePreviewContent = mobilePreview.querySelector(
      '.pl-pattern__preview--mobile'
    );

    // Get code preview
    const desktopPreviewCode = mobilePreview.querySelector(
      '.pl-pattern__code-preview'
    );

    // Toggle mobilePreview function
    function previewToggle(display) {
      display.onclick = function(e) {
        e.preventDefault();
        this.blur();
        this.classList.add('is-active');
        // Controls toggle
        if (this.classList.contains('pl-desktop')) {
          // if desktop toggle
          mobilePreviewBtn.classList.remove('is-active');
          mobilePreview.classList.remove('show-mobile');

          // Controls mobilePreview display
          if (mobilePreviewContent.hasChildNodes()) {
            // has images
            if (mobilePreview.querySelector('iframe')) {
              // check for iframe
              // kill iframe
              mobilePreview
                .querySelector('iframe')
                .parentNode.removeChild(mobilePreview.querySelector('iframe'));
            }
            // hide mobile content
            mobilePreviewContent.style.display = 'none';
            // show desktop content
            desktopPreviewContent.style.display = 'flex';
          }
        } else {
          // if mobile toggle
          desktopPreviewBtn.classList.remove('is-active');
          mobilePreview.classList.add('show-mobile');

          // if has images OR code
          if (
            mobilePreviewContent.hasChildNodes() ||
            mobilePreview.querySelector('iframe') < 1
          ) {
            // hide desktop content
            desktopPreviewContent.style.display = 'none';
            // show mobile content
            mobilePreviewContent.style.display = 'flex';

            if (desktopPreviewCode) {
              // check for code
              // iframe variables
              const getMarkup = desktopPreviewCode.innerHTML;

              if (mobilePreview.querySelector('iframe') < 1) {
                const iframe = document.createElement('iframe');
                const html = `
                                    <head>
                                        <link rel="stylesheet" href="assets/stylesheets/main-toolkit.css"/>
                                        <style>
                                            body {
                                                -webkit-box-align: center;
                                                -ms-flex-align: center;
                                                align-items: center;
                                                display: -webkit-box;
                                                display: -ms-flexbox;
                                                display: flex;
                                                margin: 0;
                                                -webkit-box-pack: center;
                                                -ms-flex-pack: center;
                                                justify-content: center;
                                            }
                                        </style>
                                    </head>
                                    <body>
                                        <div>
                                            ${getMarkup}
                                        </div>
                                    </body>`;

                // run sizeFrame function once iframe loads
                iframe.onload = sizeFrame;

                // build iframe
                mobilePreviewContent.insertBefore(
                  iframe,
                  mobilePreviewContent.firstChild
                );

                // give class name to iframe
                iframe.classList.add('pl-pattern__iframe');
                iframe.contentWindow.document.open();

                // add iframe content
                iframe.contentWindow.document.write(html);
                iframe.contentWindow.document.close();

                // Sets height of iframe to that of its content
                function sizeFrame() {
                  if (document.querySelector('iframe')) {
                    iframe.style.height = `${iframe.contentWindow.document.querySelector(
                      'body'
                    ).scrollHeight + 1}px`;
                  }
                }

                // Update iframe height if window resizes
                window.onresize = function() {
                  sizeFrame();
                };
              }
            }
          }
        }
      };
    }
    previewToggle(desktopPreviewBtn);
    previewToggle(mobilePreviewBtn);
  });
})();
