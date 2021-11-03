import { 
  createEl,
  readBlockConfig
} from '../../scripts/scripts.js';

export default function decorateColumns(block) {
  const config = readBlockConfig(block);
  for (const property in config) {
    if (!property.startsWith('-')) {
      const configDiv = block.querySelector('div');
      configDiv.remove();
    } else {
      delete config[property];
    }
  }
  if (config.color) {
    block.classList.add(`columns-${config.color}`);
  }
  const columnsCount = block.firstChild.childElementCount;
  block.firstChild.classList.add(`columns-${columnsCount}`);
  // stylize links
  block.querySelectorAll('a').forEach((a) => {
    a.classList.add('btn', 'btn-rect');
  });
}
