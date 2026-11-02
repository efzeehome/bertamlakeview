# EfzeeHome landing page

This is the completed EfzeeHome landing page from this conversation, reorganized for GitHub Pages. It uses published version 12, source commit 2d1c9e24ff0750d57e3ad6b16c629f760481d084. The deployed page's content, CSS cascade, SVG icons, photo files and browser interactions are preserved.

## Files

- `index.html`: all page content and inline SVG symbols.
- `css/style.css`: the complete original stylesheet, including responsive layouts and the no-JavaScript form fallback.
- `js/script.js`: the original pricing/date/guest model, navigation, inquiry controller and gallery viewer, combined in their original execution order.
- `assets/images/`: the eight original property photos plus the original social sharing image.
- `assets/icons/favicon.svg`: the original favicon.
- `.nojekyll`: tells GitHub Pages to serve these static files without Jekyll processing.

No fonts folder is needed. The original font stacks are retained: Georgia/Times New Roman/serif and Inter/Segoe UI/Arial/sans-serif. Inter is used only when available on the visitor's device, exactly as in the completed page. No web-font download, CDN, JavaScript library, API key, package installation or application build is required.

## Existing behavior

The responsive navigation, anchor links, eight-photo full-size dialog, next/previous controls, arrow keys, focus return, FAQ accordions, adult/child count, maximum 12 guests, night count, RM300 nightly rate, refundable RM100 deposit, source survey, phone validation, two required customer declarations, notes and prefilled WhatsApp inquiry are preserved. Form information is not stored in a database; the existing workflow opens WhatsApp, where the customer sends the message.

WhatsApp, Google Maps and the existing external Management link require internet access. The separate Management site remains at https://efzeehome-pengurusan.vocalhen32.chatgpt.site; its existing footer link is retained. No customer records or bank account details are included in this landing page package.

All photo bytes are copied unchanged. The old unused bedroom photo and unused illustration are not included. CSS rules are retained in their original order, including later refinements that override earlier rules. The no-script fallback style has been moved from the HTML to the CSS file; the script removes the `no-js` class when JavaScript runs.

## Open locally

Extract the ZIP and open `landing-page/index.html` in a modern browser. Keep the css, js and assets folders beside index.html. All local resource paths are relative and work under a GitHub Pages repository path.

## Publish on GitHub Pages

1. Create a GitHub repository. A public repository can use GitHub Pages with GitHub Free.
2. Upload the CONTENTS of `landing-page/` to the repository root: index.html, css/, js/, assets/, .nojekyll and this README. Do not upload the ZIP itself, and do not leave index.html inside an extra landing-page directory if you want the site's root address to open it.
3. Commit the files to the main branch.
4. Open the repository's Settings > Pages.
5. Under Build and deployment, choose Deploy from a branch, then main and /(root), and Save.
6. Open the published URL shown by GitHub when deployment completes.
7. If this GitHub Pages address becomes the primary public URL, update the existing canonical link and og:url in index.html to that actual address. Set og:image to the absolute public URL of assets/images/share-card.png for social sharing. The original live canonical and og:url are retained in this export; there are no placeholder URLs.

GitHub documentation: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Verification

The package is checked for complete CSS and JavaScript, unchanged original image hashes, matching HTML content and SVG symbols, valid relative file references at repository subpaths, anchor and label targets, and JavaScript syntax. Controller checks cover menu behavior, quotes, required phone/declarations, WhatsApp payload, gallery navigation and focus return. Browser preview access was previously declined, so no new browser screenshot comparison is claimed.
