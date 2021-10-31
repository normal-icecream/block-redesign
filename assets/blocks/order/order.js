import { 
  createEl
} from '../../scripts/scripts.js';

function buildTile(svg, title) {
  const tile = createEl('div', { class: 'view-tile' });
  tile.prepend(svg);

  const titleEl = createEl('p', { class: 'view-title-text' });
  titleEl.textContent = title.trim();
  tile.append(titleEl);

  return tile;
}

function toggleMenu(e) {
  let clicked = e.target.closest('.view-tile');
  if (!clicked) {
    clicked = e.target.closest('aside');
  }
  const target = clicked.getAttribute('data-target');
  const view = document.querySelector(`.${target}-view`);
  const visible = document.querySelectorAll('[aria-expanded=true]');
  const btn = document.getElementById('back-btn');
  const btnExpanded = btn.getAttribute('aria-expanded');
  visible.forEach((v) => v.setAttribute('aria-expanded', false));
  view.setAttribute('aria-expanded', true);
  if (btnExpanded === 'false') {
    btn.setAttribute('aria-expanded', true);
  } else {
    btn.setAttribute('aria-expanded', false);
  }
}

export default function decorateOrder(block) {
  block.querySelectorAll('div:first-child > div').forEach((div) => {
    const title = div.querySelector('h2');
    div.classList.add(`${title.id}-view`, 'view');
    title.remove();
    const h3s = div.querySelectorAll('h3');
    h3s.forEach((h3) => {
      // let tile;
      const svg = h3.querySelector('svg');
      const btnText = h3.nextElementSibling;
      if (btnText.querySelector('a')) { 
        const { href, textContent: text } = btnText.querySelector('a');
        const linkTile = buildTile(svg, text, href);
        const wrapper = createEl('a', { href });
        wrapper.append(linkTile);
        div.append(wrapper);
        div.setAttribute('aria-expanded', false);
      } else {
        const btnTile = buildTile(svg, btnText.textContent);
        btnTile.setAttribute(
          'data-target', 
          btnText.textContent.replace(/ /g, '-')
        );
        btnTile.addEventListener('click', toggleMenu);
        div.append(btnTile);
        div.setAttribute('aria-expanded', true);
      }
      h3.remove();
      btnText.remove();
    })
  });
  const backBtn = createEl('aside', { 
    class: 'btn btn-round',
    id: 'back-btn',
    'aria-expanded': false,
    'data-target': 'order'
  });
  const backText = createEl('p', {
    class: 'back-btn-text'
  });
  // const leftArrow = createEl('span', {
  //   class: 'icon nav left',
  // });
  backText.textContent = 'back to options';
  // backText.append(leftArrow);
  backBtn.append(backText);
  backBtn.addEventListener('click', toggleMenu);
  block.prepend(backBtn);
}
