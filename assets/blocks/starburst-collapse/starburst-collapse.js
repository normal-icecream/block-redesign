import { 
  createEl,
  buildPath
} from '../../scripts/scripts.js';

export default function decorateStarburstCollapse(block) {
  const title = block
    .querySelector('h2')
    .textContent;
  const titleDashed = title.replace(/ /g, '-');

  const parent = block.parentElement;

  // build starburst container
  const container = createEl('aside', {
    class: 'starburst-container starburst-collapse-btn',
    id: `starburst-collapse--${titleDashed}`,
    'aria-haspopup': true,
    'aria-expanded': false,
    role: 'button'
  });
  
  // build starburst
  const starburst = createEl('img', { 
    src: buildPath('svg/starburst-pink.svg'),
    class: 'starburst'
  });

  const starburstText = block.querySelector('em');
  const text = createEl('p', {
    class: 'starburst-text'
  });
  text.textContent = starburstText.textContent;
  starburstText.parentElement.remove(); // remove p > em

  // build close button for menu
  const closeBtn = createEl('button', {
    class: 'icon close',
    title: `close ${title}`
  });

  const closeBtnContainer = createEl('div', {
    class: 'icon-container'
  });

  const expand = (e) => {
    const btn = e.target.closest('.starburst-container');
    const expanded = btn.getAttribute('aria-expanded');
    if (expanded === 'false') {
      btn.setAttribute('aria-expanded', true);
    } else {
      btn.setAttribute('aria-expanded', false);
    }
  }

  const collapse = (e) => {
    const btn = e.target.closest('.icon-container');
    const parent = btn.parentElement;
    const label = parent.getAttribute('aria-labelledby');
    const target = document.getElementById(label);
    const expanded = target.getAttribute('aria-expanded');
    if (expanded === 'true') {
      target.setAttribute('aria-expanded', false);
    } else {
      target.setAttribute('aria-expanded', true);
    }
  }

  container.append(text, starburst);
  container.addEventListener('click', expand);

  closeBtnContainer.append(closeBtn);
  closeBtn.addEventListener('click', collapse);

  parent.parentElement.insertBefore(container, parent);

  parent.setAttribute('aria-labelledby', `starburst-collapse--${titleDashed}`);
  parent.setAttribute('role', 'menu');
  parent.classList.add('starburst-collapse-menu');
  parent.prepend(closeBtnContainer);
}
