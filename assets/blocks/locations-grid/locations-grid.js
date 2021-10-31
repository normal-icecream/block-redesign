import { 
  createEl
} from '../../scripts/scripts.js';

function emptyDivs(block) {
  let emptyDiv = block.querySelector('div:empty');
  while (emptyDiv) {
    emptyDiv.remove();
    emptyDiv = block.querySelector('div:empty');
  }
}

function wrapInAnchor(block, url) {
  const a = createEl('a', {
    href: url,
    class: 'anchor-row'
  });
  a.append(block);
  return a;
}

export default function decorateLocationsGrid(block) {
  console.log('hi from location grid');
  emptyDivs(block);
  const rows = document.querySelectorAll('.locations-grid > div');
  console.log(rows);
  rows.forEach((row) => {
    const { href } = row.querySelector('a');
    const a = wrapInAnchor(row, href);
    block.append(a);
  });
}
