import Clipboard from 'clipboard';

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
