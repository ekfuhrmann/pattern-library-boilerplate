require('es6-shim');
require('clipboard');
require('svg4everybody');
require('./modules/_sidebar');
require('./modules/_code');

// TODO: Get HLJS working and break out remaining code into their own modules -- also need to make sure gulp js config files are brought into here as well

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
