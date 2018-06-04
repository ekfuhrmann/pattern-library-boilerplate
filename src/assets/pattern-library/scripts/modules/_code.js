// import { checkMediaQuery } from './_helpers';

// // Build highlight.js code snippet
// (function code() {
//   // Get all snippets of code
//   const snippets = document.querySelectorAll('pre code');

//   // Find each snippet
//   Array.from(snippets).forEach(function(snippet) {
//     // escape the innerHTML
//     const esc = escape(snippet.innerHTML);

//     // Reasign escaped to node and initialize highlight.js
//     snippet.innerHTML = esc;
//     hljs.highlightBlock(snippet);
//   });

//   // Get code snippet
//   const codeSnippets = document.querySelectorAll('.pl-pattern__code-block');

//   // Check whether each page snippet needs to be expanded or not
//   Array.from(codeSnippets).forEach(function(codeSnippet) {
//     if (codeSnippet.querySelector('code').scrollHeight < 200 - 80) {
//       codeSnippet.querySelector('.pl-pattern__code-fade').style.display =
//         'none'; // remove fade & expand btn
//       codeSnippet.querySelector(
//         '.pl-btn.pl-pattern__code-btn.collapse'
//       ).style.display =
//         'none'; // remove collapse btn
//       const styles = 'padding: 0; margin: 0;';
//       codeSnippet.getElementsByTagName('code')[0].style = styles; // remove spacing for expand/collapse
//     }
//   });
// })();

// // Expand code snippet (Show More +)
// (function codeExpand() {
//   const expandBtns = document.querySelectorAll('.pl-pattern__code-fade');

//   Array.from(expandBtns).forEach(function(btn) {
//     btn.onclick = function(e) {
//       e.preventDefault();
//       this.blur();
//       const codeHeight = this.previousSibling.scrollHeight + 80; // account for 40px padding
//       this.parentElement.classList.add('is-expanded');
//       this.parentElement.style.maxHeight = `${codeHeight}px`;
//     };
//   });
// })();

// // Collapse code snippet (Show Less -)
// (function codeCollapse() {
//   const collapseBtns = document.querySelectorAll(
//     '.pl-pattern__code-btn.collapse'
//   );

//   Array.from(collapseBtns).forEach(function(btn) {
//     btn.onclick = function(e) {
//       e.preventDefault();
//       btn.blur();
//       this.parentElement.classList.remove('is-expanded');
//       this.parentElement.style.removeProperty('max-height');
//     };
//   });
// })();

// // Copy code snippet
// (function codeCopy() {
//   const copyBtns = document.querySelectorAll('.pl-pattern__code-btn.copy');

//   // Set for each code block on a page
//   Array.from(copyBtns).forEach(function(btn) {
//     btn.onclick = function(e) {
//       e.preventDefault();
//       // Save code to clipboard
//       const clipboard = new Clipboard('.pl-pattern__code-btn.copy', {
//         target: function(trigger) {
//           return trigger.nextElementSibling.querySelector('code');
//         }
//       });

//       // When successfully saved to clipboard, change text to reflect it
//       clipboard.on('success', function(e) {
//         e.clearSelection(); // prevent highlight
//         e.trigger.childNodes[0].nodeValue = 'Copied'; // Inform user text copied
//         window.setTimeout(function() {
//           e.trigger.childNodes[0].nodeValue = 'Copy'; // Reset back to default after 2s
//         }, 2000);
//         btn.blur();
//       });
//     };
//   });
// })();
