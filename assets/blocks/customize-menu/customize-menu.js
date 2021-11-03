import { 
  createEl,
  readBlockConfig
} from '../../scripts/scripts.js';

export function clearCustomizeMenu(block) {
  block.querySelector('.customize-body-head').innerHTML = '';
  block.querySelector('.customize-body-form').innerHTML = '';
  const btn = document.getElementById('customize-footer-btn');
  btn.textContent = '';
  // remove event listeners
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);
}

export default function buildCustomizeMenu(block) {
  block.parentElement.setAttribute('aria-expanded', false);

  // container
  block.classList.add('customize');
  
  // close button
  //////////////////////////////////////////////////
  const closeBtnContainer = createEl('div', {
    class: 'icon-container customize-close'
  });
  const closeBtn = createEl('button', {
    class: 'icon close',
    title: `close TODO`
  });
  closeBtn.addEventListener('click', (e) => {
    block.parentElement.setAttribute('aria-expanded', false);
  });
  closeBtnContainer.append(closeBtn);

  // customize body
  //////////////////////////////////////////////////
  const body = createEl('div', {
    class: 'customize-body'
  });
  //body header
  const head = createEl('h2', {
    class: 'customize-body-head'
  });
  // body form
  const form = createEl('form', {
    class: 'customize-body-form'
  });
  body.append(head, form);

  // customize footer
  //////////////////////////////////////////////////
  const footer = createEl('div', {
    class: 'customize-footer'
  });

  const btn = createEl('a', {
    id: 'customize-footer-btn',
    class: 'btn btn-rect'
  });
  footer.append(btn);

  block.append(closeBtnContainer, body, footer);
}
