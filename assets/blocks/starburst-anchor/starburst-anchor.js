import { 
  buildPath,
  createEl,
  readBlockConfig,
  toClassName
} from '../../scripts/scripts.js';

export default async function decorateStarburstAnchor(block) {
  const config = readBlockConfig(block);

  // build starburst container
  const container = createEl('aside', {
    class: 'starburst-container starburst-anchor',
    id: `starburst-anchor--${toClassName(config.anchor)}`
  });
  
  // build starburst
  const starburst = createEl('img', { 
    src: buildPath(`svg/starburst-${config.color}.svg`),
    class: `starburst`
  });

  const text = createEl('p', {
    class: 'starburst-text'
  });
  text.textContent = config.text;

  block.remove(); // remove config div

  container.append(text, starburst);
  container.classList.add(`starburst-${config.color}`);
  if (config.float) {
    container.classList.add(`starburst-float-${config.float}`);
  }
  
  const anchorTarget = document.getElementById(toClassName(config.anchor));

  let targetParent = anchorTarget.parentNode;
  if (targetParent.parentElement && targetParent.parentElement.nodeName === 'DIV') {
    targetParent = targetParent.parentNode;
  }

  targetParent.classList.add('starburst-anchor-parent');
  targetParent.parentElement.insertBefore(container, targetParent);
}
