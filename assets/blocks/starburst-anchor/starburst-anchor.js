import { 
  buildPath,
  createEl,
  readBlockConfig,
  toClassName
} from '../../scripts/scripts.js';

export default async function decorateStarburstAnchor(block) {
  console.log('hi from starburst anchor');
  const config = readBlockConfig(block);

  // build starburst container
  const container = createEl('aside', {
    class: 'starburst-container starburst-anchor',
    id: `starburst-anchor--${toClassName(config.anchor)}`
  });
  
  // build starburst
  const configColor = config.color;
  const starburst = createEl('img', { 
    src: buildPath(`svg/starburst-${configColor}.svg`),
    class: `starburst`
  });

  const configText = config.text;
  const text = createEl('p', {
    class: 'starburst-text'
  });
  text.textContent = configText;

  block.remove(); // remove config div

  container.append(text, starburst);
  container.classList.add(`starburst-${configColor}`);
  
  const anchorTarget = document.getElementById(toClassName(config.anchor));

  let targetParent = anchorTarget.parentNode;
  if (targetParent.parentElement.nodeName === 'DIV') {
    targetParent = targetParent.parentNode;
  }

  targetParent.classList.add('starburst-anchor-parent');
  targetParent.parentElement.insertBefore(container, targetParent);
}
