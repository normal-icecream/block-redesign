import { 
  createEl
} from '../../scripts/scripts.js';

export default function decorateIndexNav(block) {
  const linksList = block.querySelector('ul');
  linksList.classList.add('nav-list');
  const nav = createEl('nav', {
    class: 'nav'
  })
  nav.append(linksList);
  block.append(nav);
}
