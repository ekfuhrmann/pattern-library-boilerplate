// remove focus when icon is selected for download
(function iconBlur() {
  const icons = document.querySelectorAll('.pl-pattern__grid-item.pl-icons');

  Array.from(icons).forEach(function(icon) {
    icon.onclick = function() {
      this.blur();
    };
  });
})();
