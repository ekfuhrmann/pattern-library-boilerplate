import { checkMediaQuery, escape } from './_helpers';
import Prism from 'prismjs';
import Clipboard from 'clipboard';

// Build highlight.js code snippet
(function code() {
  // Get all snippets of code
  const snippets = document.querySelectorAll('pre code');

  // Find each snippet
  Array.from(snippets).forEach(function(snippet) {
    // escape the innerHTML
    const esc = escape(snippet.innerHTML);

    // Reassign escaped to node and initialize highlight.js
    snippet.innerHTML = esc;
    Prism.highlight(snippet.innerHTML, Prism.languages.markup, 'markup');
  });

  // Get code snippet
  const codeSnippets = document.querySelectorAll('.pl-pattern__code-block');

  // Check whether each page snippet needs to be expanded or not
  Array.from(codeSnippets).forEach(function(codeSnippet) {
    if (
      codeSnippet.querySelector('code').getBoundingClientRect().height <
      200 - 80
    ) {
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
      const codeHeight = this.previousSibling.scrollHeight + 40; // account for 40px padding
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
