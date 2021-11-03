import { 
  createEl,
  toClassName
} from '../../scripts/scripts.js';

function toggle(e) {
  const expanded = e.target.getAttribute('aria-expanded');
  if (expanded === 'true') {
    e.target.setAttribute('aria-expanded', false);
  } else {
    e.target.setAttribute('aria-expanded', true);
  }
}

export default function decorateAccordion(block) {
  const rows = block.querySelectorAll('div:scope > div');
  rows.forEach((row) => {
    const q = row.querySelector('h3');
    q.setAttribute('role', 'button');
    q.setAttribute('aria-expanded', false);
    q.setAttribute('aria-controls', toClassName(q.textContent));
    q.addEventListener('click', toggle);
    const a = q.nextElementSibling;
    a.id = toClassName(q.textContent);
  })
}
