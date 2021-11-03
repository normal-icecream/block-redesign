import { 
  createEl,
  readBlockConfig
} from '../../scripts/scripts.js';

import { 
  getFields,
  buildFields
} from '../../scripts/forms.js';

import {
  clearCustomizeMenu
} from '../customize-menu/customize-menu.js';

function populateCustomizeMenu(e, type) {
  const menu = document.querySelector('.customize-menu');
  clearCustomizeMenu(menu);
  if (menu) {
    // display menu
    menu.parentElement.setAttribute('aria-expanded', true);
    // populate title
    const title = menu.querySelector('h2');
    title.textContent = `customize your ${type} pint club`;
    // populate form
    const form = menu.querySelector('form');
    const fieldsArr = ['pint-club'];
    if (type === 'prepay') { fieldsArr.unshift('prepay-months'); }
    const allFields = getFields(fieldsArr);
    allFields.forEach((field) => {
      const f = buildFields(field);
      form.append(f);
    });
    const btn = document.getElementById('customize-footer-btn');
    btn.textContent = 'join the club';
  }
}

function enableCheckout(a) {
  a.classList.add('btn', 'btn-rect');
  const { hash } = new URL(a.href);
  const type = hash.replace('#', '');
  a.removeAttribute('href');
  a.addEventListener('click', (e) => {
    populateCustomizeMenu(e, type);
  });
}

export default function decorateClubCheckout(block) {
  const config = readBlockConfig(block);
  for (const property in config) {
    if (!property.startsWith('-')) {
      const configDiv = block.querySelector('div');
      configDiv.remove();
    } else {
      delete config[property];
    }
  }
  if (config.color) {
    block.classList.add(`club-checkout-${config.color}`);
  }
  const columnsCount = block.firstChild.childElementCount;
  block.firstChild.classList.add(`club-checkout-${columnsCount}`);
  // stylize links
  block.querySelectorAll('a').forEach((a) => {
    enableCheckout(a);
  });
}
