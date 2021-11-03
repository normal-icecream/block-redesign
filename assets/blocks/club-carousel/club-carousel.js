import { 
  createEl
} from '../../scripts/scripts.js';

async function fetchCarousel(url) {
  const resp = await fetch(`${url}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();
    const placeholder = createEl('div');
    placeholder.innerHTML = html;
    const pictures = placeholder.querySelectorAll('picture');
    return [ ...pictures ];
  } else {
    console.error('Carousel cannot be created');
  }
}

function navScroll(e) {
  const btn = e.target.closest('button');
  const carousel = btn.closest('.club-carousel');
  const num = carousel.querySelectorAll('.club-carousel-slide').length;
  const slide = carousel.querySelector('.club-carousel-slide');
  const slideWidth = slide.offsetWidth;
  const container = carousel.parentElement;
  const containerWidth = container.offsetWidth;
  const direction = btn.classList[btn.classList.length - 1];
  // const currPosition = carousel.scrollLeft;
  // const totalWidth = slideWidth * num;
  
  if (direction === 'left') {
    carousel.scrollLeft -= containerWidth - 10;
  } else if (direction === 'right') {
    carousel.scrollLeft += containerWidth + 10;
  }
}

export default async function decorateClubCarousel(block) {
  const { href } = block.querySelector('a');
  const { pathname } = new URL(href);
  const pictures = await fetchCarousel(pathname);
  block.innerHTML = '';
  if (pictures) {

    pictures.forEach((pic) => {
      const container = createEl('div', {
        class: 'club-carousel-slide'
      });
      container.append(pic);
      block.append(container);
    });

    const rightBtn = createEl('button', {
      class: 'icon nav right',
      title: `scroll right` 
    });

    const leftBtn = createEl('button', {
      class: 'icon nav left',
      title: `scroll left` 
    });
    
    rightBtn.addEventListener('click', navScroll);
    leftBtn.addEventListener('click', navScroll);

    block.prepend(leftBtn);
    block.prepend(rightBtn);

  } else {
    block.remove();
  }
}
