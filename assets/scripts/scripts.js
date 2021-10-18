/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/**
 * Builds an HTML DOM element.
 * @param {string} tag The type of element
 * @param {object} params Additional parameters for element
 * @returns {Element} The block element
 */
export function createEl(tag, params) {
  const el = document.createElement(tag);
  if (params) {
    for (const param in params) {
      el.setAttribute(param, params[param]);
    }
  }
  return el;
}

export function buildPath(path) {
  const { origin } = new URL(window.location);
  return `${origin}/assets/${path}`;
}

/**
 * Gets path info.
 * @returns {array} path parameters
 */
function getPath() {
  const { pathname } = new URL(window.location);
  const pathArr = pathname.split('/').filter(path => path);
  return pathArr.length ? pathArr : ['index']; // index default
}

/**
 * Loads a CSS file.
 * @param {string} href The path to the CSS file
 */
export function loadCSS(href) {
  const path = buildPath(href);
  if (!document.querySelector(`head > link[href="${path}"]`)) {
    const stylesheet = createEl('link', {
      rel: 'stylesheet',
      href: `${path}`
    });
    document.head.appendChild(stylesheet);
  }
}

/**
 * loads a script by adding a script tag to the head.
 * @param {string} url URL of the js file
 * @param {Function} callback callback on load
 * @param {string} type type attribute of script tag
 * @returns {Element} script element
 */
export function loadScript(url, callback, type) {
  const head = document.querySelector('head');
  const props = { src: url }
  if (type) { props.type = type; }
  const script = createEl('script', props);
  head.append(script);
  script.onload = callback;
  return script;
}

/**
 * Retrieves the content of a metadata tag.
 * @param {string} name The metadata name (or property)
 * @returns {string} The metadata value
 */
/**
 * Gets metadata.
 * @returns {object} key/value pairs or name and content
 */
function getMetadata() {
  const metadata = {};
  document.querySelectorAll('meta').forEach((meta) => {
    if (meta.name && !meta.name.includes(':')) {
      metadata[meta.name] = meta.content;
    }
  });
  return metadata;
}

/**
 * Loads the theme CSS file.
 */
function loadTheme() {
  const { theme } = getMetadata(); // white-blue default
  if (theme) {
    loadCSS(`styles/themes/${theme}.css`);
  } else {
    loadCSS('styles/themes/white-blue.css');
  }
}

/**
 * Adds one or more URLs to the dependencies for publishing.
 * @param {string|[string]} url The URL(s) to add as dependencies
 */
export function addPublishDependencies(url) {
  const urls = Array.isArray(url) ? url : [url];
  window.hlx = window.hlx || {};
  if (window.hlx.dependencies && Array.isArray(window.hlx.dependencies)) {
    window.hlx.dependencies.concat(urls);
  } else {
    window.hlx.dependencies = urls;
  }
}

/**
 * Sanitizes a name for use as class name.
 * @param {*} name The unsanitized name
 * @returns {string} The class name
 */
export function toClassName(name) {
  return name && typeof name === 'string' ?
    name.toLowerCase().replace(/[^0-9a-z]/gi, '-') :
    '';
}

/**
 * Decorates all blocks.
 */
function decorateBlocks() {
  document
    .querySelectorAll('main > div > div[class]')
    .forEach((block) => {
      decorateBlock(block);
    });
}

/**
 * Decorates single block
 * @param {Element} block Block element to be decorated
 */
function decorateBlock(block) {
  const name = block.classList[0];
  block.parentElement
    .classList.add(`${name}-container`.replace(/--/g, '-'));
  block.classList.add('block');
  block.setAttribute('data-block-name', name);
}

/**
 * Decorates all Square links.
 */
function decorateSquareLinks() {
  document
    .querySelectorAll('main > div a[href*="squareup"]')
    .forEach((a) => {
      decorateSquareLink(a);
    });
}

/**
 * Decorates single Square link.
 * @param {Element} a Anchor element to be decorated
 */
function decorateSquareLink(a) {
  a.classList.add('btn', 'btn-cart');
  a.parentElement.classList.add('btn-container');

  const squarePrefix = 'https://squareup.com/dashboard/items/library/';
  const giftcardPrefix = 'https://squareup.com/gift/';
  const href = a.getAttribute('href');

  if (href.startsWith(squarePrefix)) {
    const id = href.substr(squarePrefix.length);
    a.setAttribute('data-id', id);
    a.removeAttribute('href');
    // TODO: add to cart functionality
  } else if (href.includes(giftcardPrefix)) {
    a.target = '_blank';
  }
}

function externalizeLinks() {
  document
    .querySelectorAll('main > div a[href]')
    .forEach((a) => {
      const { origin } = new URL(a.href);
      if (origin !== 'null' && origin !== window.location.origin) {
        a.setAttribute('rel', 'noreferrer');
        a.setAttribute('target', '_blank');
        a.setAttribute('data-origin', 'external');
      }
    })
}

/**
 * Build footer
 */
function loadFooter() {
  const footer = document.querySelector('footer');
  footer.setAttribute('data-block-name', 'footer');
  footer.setAttribute('data-source', `/footer`);
  loadBlock(footer);
}

/**
 * Loads JS and CSS for all blocks.
 */
async function loadBlocks() {
  document
    .querySelectorAll('main > div > div.block')
    .forEach(async(block) => {
      loadBlock(block);
    });
}

/**
 * Loads JS and CSS for a single block.
 * @param {Element} block The block element
 */
async function loadBlock(block) {
  if (!block.getAttribute('data-block-loaded')) {
    block.setAttribute('data-block-loaded', true);
    const name = block.getAttribute('data-block-name');
    loadCSS(`blocks/${name}/${name}.css`);
    try {
      const mod = await
      import (buildPath(`blocks/${name}/${name}.js`));
      if (mod.default) {
        await mod.default(block, name, document);
      }
    } catch (err) {
      console.error(`failed to load module for ${name}`, err);
    }
  }
}

/**
 * Official Google WEBP detection.
 * @param {Function} callback The callback function
 */
function checkWebpFeature(callback) {
  const webpSupport = sessionStorage.getItem('webpSupport');
  if (!webpSupport) {
    const kTestImages = 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';
    const img = new Image();
    img.onload = () => {
      const result = (img.width > 0) && (img.height > 0);
      window.webpSupport = result;
      sessionStorage.setItem('webpSupport', result);
      callback();
    };
    img.onerror = () => {
      sessionStorage.setItem('webpSupport', false);
      window.webpSupport = false;
      callback();
    };
    img.src = `data:image/webp;base64,${kTestImages}`;
  } else {
    window.webpSupport = (webpSupport === 'true');
    callback();
  }
}

/**
 * Returns an image URL with optimization parameters
 * @param {string} url The image URL
 */
export function getOptimizedImageURL(src) {
  const url = new URL(src, window.location.href);
  let result = src;
  const { pathname, search } = url;
  if (pathname.includes('media_')) {
    const usp = new URLSearchParams(search);
    usp.delete('auto');
    if (!window.webpSupport) {
      if (pathname.endsWith('.png')) {
        usp.set('format', 'png');
      } else if (pathname.endsWith('.gif')) {
        usp.set('format', 'gif');
      } else {
        usp.set('format', 'pjpg');
      }
    } else {
      usp.set('format', 'webply');
    }
    result = `${src.split('?')[0]}?${usp.toString()}`;
  }
  return (result);
}

/**
 * Resets an elelemnt's attribute to the optimized image URL.
 * @see getOptimizedImageURL
 * @param {Element} el The element
 * @param {string} attr The attribute
 */
function resetOptimizedImageURL(el, attr) {
  const src = el.getAttribute(attr);
  if (src) {
    const oSrc = getOptimizedImageURL(src);
    if (oSrc !== src) {
      el.setAttribute(attr, oSrc);
    }
  }
}

/**
 * WEBP Polyfill for older browser versions.
 * @param {Element} el The container element
 */
export function webpPolyfill(el) {
  if (!window.webpSupport) {
    el.querySelectorAll('img').forEach((img) => {
      resetOptimizedImageURL(img, 'src');
    });
    el.querySelectorAll('picture source').forEach((src) => {
      resetOptimizedImageURL(src, 'srcset');
    });
  }
}

/**
 * Normalizes all headings within a container element.
 * @param {Element} el The container element
 * @param {[string]]} allowedHeadings The list of allowed headings (h1 ... h6)
 */
export function normalizeHeadings(el, allowedHeadings) {
  const allowed = allowedHeadings.map((h) => h.toLowerCase());
  el.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((tag) => {
    const h = tag.tagName.toLowerCase();
    if (allowed.indexOf(h) === -1) {
      // current heading is not in the allowed list -> try first to "promote" the heading
      let level = parseInt(h.charAt(1), 10) - 1;
      while (allowed.indexOf(`h${level}`) === -1 && level > 0) {
        level -= 1;
      }
      if (level === 0) {
        // did not find a match -> try to "downgrade" the heading
        while (allowed.indexOf(`h${level}`) === -1 && level < 7) {
          level += 1;
        }
      }
      if (level !== 7) {
        tag.outerHTML = `<h${level}>${tag.textContent}</h${level}>`;
      }
    }
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
export function decorateMain(main) {
  checkWebpFeature(() => {
    webpPolyfill(main);
  });
  decorateBlocks(main);
}

/**
 * Sets the trigger for the LCP (Largest Contentful Paint) event.
 * @see https://web.dev/lcp/
 * @param {Document} doc The document
 * @param {Function} postLCP The callback function
 */
function setLCPTrigger(doc, postLCP) {
  const lcpCandidate = doc.querySelector('main > div:first-of-type img');
  if (lcpCandidate) {
    if (lcpCandidate.complete) {
      postLCP();
    } else {
      lcpCandidate.addEventListener('load', () => {
        postLCP();
      });
      lcpCandidate.addEventListener('error', () => {
        postLCP();
      });
    }
  } else {
    postLCP();
  }
}

/**
 * Decorates the page.
 * @param {Window} win The window
 */
async function decoratePage(win = window) {
  const doc = win.document;
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);

    const path = getPath();
    const legal = ['privacy-policy', 'terms-and-conditions'];

    if (path.includes('order')) {
      decorateOrderPage(path);
    }
    if (legal.includes(path[0])) {
      decorateLegalPage(path);
    }

    doc.querySelector('body').classList.add('appear');
    setLCPTrigger(doc, async() => {
      // post LCP actions go here
      loadFooter();
      await loadBlocks();
      if (path.includes('index')) {
        decorateIndexPage(path, main);
      }
      loadCSS('styles/lazy-styles.css');
      externalizeLinks();
    });
  }

}

/**
 * Decorate index page.
 * @param {array} path path parameters
 */
function decorateIndexPage(path, main) {
  const nav = document.querySelector('.index-nav-container');
  const carousel = document.querySelector('.index-carousel-container');
  const container = createEl('div', {
    class: 'index-wrapper',
    'data-block-name': 'index-wrapper'
  });
  container.append(nav, carousel);
  main.append(container);
  loadBlock(container);
}

/**
 * Decorate order page.
 * @param {array} path path parameters
 */
function decorateOrderPage(path) {
  document.querySelector('main').classList.add(path.join('--'));
  // set first div as info
  document
    .querySelector('main > div:first-of-type')
    .classList.add('order-location-info');
  loadCSS('styles/order.css');
  decorateSquareLinks();
  loadScript('https://js.squareup.com/v2/paymentform');
}

/**
 * Decorate legal page.
 * @param {array} path path parameters
 */
function decorateLegalPage(path) {
  document.querySelector('main').classList.add(path);
  document.querySelector('main').classList.add('legal');
  loadCSS('styles/legal.css');
}

function removeEmptyDivs() {
  document.querySelectorAll('div').forEach((div) => {
    const content = div.textContent.trim();
    if (!content) { div.remove(); }
  })
}

window.onload = async(e) => {
  loadTheme();
  decoratePage();
  removeEmptyDivs();
};