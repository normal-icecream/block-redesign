import { 
  createEl
} from '../../scripts/scripts.js';

function close(e) {
  const btn = e.target.closest('.icon-container');
  const parent = btn.parentElement;
  const title = parent.querySelector('h2').textContent;
  const expanded = parent.getAttribute('aria-expanded');
  if (expanded === 'true') {
    parent.setAttribute('aria-expanded', false);
    sessionStorage.setItem(`${title} popup`, 'viewed');
  } else {
    parent.setAttribute('aria-expanded', true);
  }
}

export default function decoratePopup(block) {
  const title = block.querySelector('h2').textContent;
  const popupStored = sessionStorage.getItem(`${title} popup`);
  const expanded = !popupStored ? true : false;

  const parent = block.parentElement;
  parent.setAttribute('aria-expanded', expanded);

  const colorEl = block.querySelector('strong');
  colorEl.remove();
  const color = colorEl.textContent.toLowerCase().trim();
  parent.classList.add(`popup-${color}`);

  const logo = createEl('img', { 
    src: '/assets/svg/logo-white.svg',
    class: 'icon icon-normal'
  });
  block.prepend(logo);

  const closeBtn = createEl('button', {
    class: 'icon close',
    title: `close ${title} popup`
  });

  const closeBtnContainer = createEl('div', {
    class: 'icon-container'
  });

  closeBtn.addEventListener('click', close);
  closeBtnContainer.append(closeBtn);
  parent.prepend(closeBtnContainer);
  
  const a = block.querySelector('a');
  if (a) { a.classList.add('btn'); }
}
