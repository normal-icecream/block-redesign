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
  console.log(`${origin}/assets/${path}`);
  return `${origin}/assets/${path}`;
}

/**
 * Gets path info.
 * @returns {array} path parameters
 */
 function getPath() {
  const { pathname } = new URL(window.location);
  const pathArr = pathname.split('/').filter(path => path);
  return pathArr.length ? pathArr : [ 'index' ]; // index default
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
    loadCSS(`themes/${theme}.css`);
  } else {
    loadCSS('themes/white-blue.css');
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
  return name && typeof name === 'string'
    ? name.toLowerCase().replace(/[^0-9a-z]/gi, '-')
    : '';
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
      if (origin && origin !== window.location.origin) {
        a.setAttribute('rel', 'noreferrer');
        a.setAttribute('target', '_blank');
      }
    })
}

/**
 * Loads JS and CSS for all blocks.
 */
 async function loadBlocks() {
  document
    .querySelectorAll('main > div > div.block')
    .forEach(async (block) => {
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
    try {
      const mod = await import(buildPath(`assets/blocks/${name}/${name}.js`));
      console.log("HELLO ANYONE IN THE WORLD");
      console.log(buildPath(`assets/blocks/${name}/${name}.js`));
      if (mod.default) {
        await mod.default(block, name, document);
      }
    } catch (err) {
      console.error(`failed to load module for ${name}`, err);
    }
    loadCSS(`assets/blocks/${name}/${name}.css`);
  }
}

/**
 * Extracts the config from a block.
 * @param {Element} $block The block element
 * @returns {object} The block config
 */
export function readBlockConfig($block) {
  const config = {};
  $block.querySelectorAll(':scope>div').forEach(($row) => {
    if ($row.children) {
      const $cols = [...$row.children];
      if ($cols[1]) {
        const $value = $cols[1];
        const name = toClassName($cols[0].textContent);
        let value = '';
        if ($value.querySelector('a')) {
          const $as = [...$value.querySelectorAll('a')];
          if ($as.length === 1) {
            value = $as[0].href;
          } else {
            value = $as.map(($a) => $a.href);
          }
        } else if ($value.querySelector('p')) {
          const $ps = [...$value.querySelectorAll('p')];
          if ($ps.length === 1) {
            value = $ps[0].textContent;
          } else {
            value = $ps.map(($p) => $p.textContent);
          }
        } else value = $row.children[1].textContent;
        config[name] = value;
      }
    }
  });
  return config;
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
 * @param {Element} $elem The element
 * @param {string} attrib The attribute
 */
function resetOptimizedImageURL($elem, attrib) {
  const src = $elem.getAttribute(attrib);
  if (src) {
    const oSrc = getOptimizedImageURL(src);
    if (oSrc !== src) {
      $elem.setAttribute(attrib, oSrc);
    }
  }
}

/**
 * WEBP Polyfill for older browser versions.
 * @param {Element} $elem The container element
 */
export function webpPolyfill($elem) {
  if (!window.webpSupport) {
    $elem.querySelectorAll('img').forEach(($img) => {
      resetOptimizedImageURL($img, 'src');
    });
    $elem.querySelectorAll('picture source').forEach(($source) => {
      resetOptimizedImageURL($source, 'srcset');
    });
  }
}

/**
 * Normalizes all headings within a container element.
 * @param {Element} $elem The container element
 * @param {[string]]} allowedHeadings The list of allowed headings (h1 ... h6)
 */
export function normalizeHeadings($elem, allowedHeadings) {
  const allowed = allowedHeadings.map((h) => h.toLowerCase());
  $elem.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((tag) => {
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
 * @param {Element} $main The main element
 */
export function decorateMain($main) {
  wrapSections($main.querySelectorAll(':scope > div'));
  checkWebpFeature(() => {
    webpPolyfill($main);
  });
  decorateBlocks($main);
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const $link = document.createElement('link');
  $link.rel = 'icon';
  $link.type = 'image/svg+xml';
  $link.href = href;
  const $existingLink = document.querySelector('head link[rel="icon"]');
  if ($existingLink) {
    $existingLink.parentElement.replaceChild($link, $existingLink);
  } else {
    document.getElementsByTagName('head')[0].appendChild($link);
  }
}

/**
 * Sets the trigger for the LCP (Largest Contentful Paint) event.
 * @see https://web.dev/lcp/
 * @param {Document} doc The document
 * @param {Function} postLCP The callback function
 */
function setLCPTrigger(doc, postLCP) {
  const $lcpCandidate = doc.querySelector('main > div:first-of-type img');
  if ($lcpCandidate) {
    if ($lcpCandidate.complete) {
      postLCP();
    } else {
      $lcpCandidate.addEventListener('load', () => {
        postLCP();
      });
      $lcpCandidate.addEventListener('error', () => {
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
  const path = getPath();
  const legal = ['privacy-policy', 'terms-and-conditions'];
  if (path.includes('order')) {
    decorateOrderPage(path);
  }
  if (legal.includes(path[0])) {
    decorateLegalPage(path);
  }
  decorateBlocks();

  doc.querySelector('body').classList.add('appear');
    setLCPTrigger(doc, async () => {
      // post LCP actions go here
      await loadBlocks($main);
      loadCSS('/styles/lazy-styles.css');
      externalizeLinks();
    });
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
  loadCSS('/styles/order.css');
  decorateSquareLinks();
}

/**
 * Decorate legal page.
 * @param {array} path path parameters
 */
 function decorateLegalPage(path) {
  document.querySelector('main').classList.add(path);
  document.querySelector('main').classList.add('legal');
  loadCSS('/styles/legal.css');
}

window.onload = async (e) => {
  loadTheme();
  decoratePage();
};
