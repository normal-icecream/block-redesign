import { 
  createEl,
  getPath,
  fetchLabels
} from '../../scripts/scripts.js';

async function writeContactText() {
  const labels = await fetchLabels();
  const textArr = labels.contact.split('\n');
  let lastLine = textArr.pop();

  const wrapper = createEl('div', { class: 'contact-us-text' });

  textArr.forEach((line) => {
    const p = createEl('p');
    p.textContent = line;
    wrapper.append(p);
  });

  const path = getPath().pop();
  const phone = labels[`${path}_phone`] || labels.store_phone;
  const phoneEl = createEl('a', { href: `tel:+${phone.replace(/\D/g, '')}` });
  phoneEl.textContent = phone;
  lastLine = lastLine.replace(/<<phone>>/, phoneEl.outerHTML);
 
  const email = labels.email;
  const emailEl = createEl('a', { href: `mailto:${email}` });
  emailEl.textContent = email;
  lastLine = lastLine.replace(/<<email>>/, emailEl.outerHTML);

  const lastP = createEl('p');
  lastP.innerHTML = lastLine;
  wrapper.append(lastP);
  
  return wrapper;
}

export default async function decorateContactUs(block) {
  // console.log(labels.contact);
  const title = createEl('h2', { id: 'contact-us' });
  title.textContent = 'contact us';
  const text = await writeContactText();
  // const test = createEl('p', { class: 'contact-us-text' });
  // test.textContent = labels.contact;
  block.append(title, text);
}
