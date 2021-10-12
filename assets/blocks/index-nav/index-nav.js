import { 
  createEl
} from '../../scripts/scripts.js';

export default async function decorateIndexNav(block) {
  const linksList = block.querySelector('ul');
  linksList.classList.add('nav-list');
  console.log(linksList);
  const nav = createEl('nav', {
    class: 'nav'
  })
  nav.append(linksList);
  block.append(nav);
}
