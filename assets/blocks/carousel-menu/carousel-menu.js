import { 
  createEl,
  buildPath
} from '../../scripts/scripts.js';

export default function decorateCarouselMenu(block) {
  const parent = block.parentElement;

  // pull title outside of carousel
  const titleEl = block.querySelector('h2');
  const title = titleEl.textContent;
  const titleDashed = title.replace(/ /g, '-');
  titleEl.classList.add('carousel-menu-title');
  titleEl.parentElement.parentElement.remove();
  parent.prepend(titleEl);

  // add classes to carousel content
  block
    .querySelectorAll('.carousel-menu > div')
    .forEach((slide) => {
      slide.classList.add('carousel-slide');
      slide.firstElementChild.classList.add('carousel-item');
    });

  const numSlides = block.querySelectorAll('.carousel-slide').length;

  switch (numSlides) {
    case 0:
      console.warn('cannot create carousel with no slides');
      return;
    case 1:
      block.classList.add('carousel-slides-one');
      break;
    case 2:
      block.classList.add('carousel-slides-two');
      break;
    case 3:
      block.classList.add('carousel-slides-three');
      break;
    default:
      block.classList.add('carousel-slides-multi');
      break;
  }

  // create navigtaion
  if (numSlides > 1) {

    const leftBtn = createEl('button', {
      class: 'icon nav left',
      title: `scroll left in ${title}` 
    });

    const rightBtn = createEl('button', {
      class: 'icon nav right',
      title: `scroll right in ${title}` 
    });

    const navScroll = (e) => {
      const btn = e.target.closest('button');
      const carousel = btn.closest('.carousel-menu');
      const num = carousel.querySelectorAll('.carousel-slide').length;
      const slide = carousel.querySelector('.carousel-slide');
      const slideWidth = slide.offsetWidth;
      const container = carousel.parentElement;
      const containerWidth = container.offsetWidth;
      const direction = btn.classList[btn.classList.length - 1];
      const currPosition = carousel.scrollLeft;
      const totalWidth = slideWidth * num;
      
      if (direction === 'left') {
        const nextPosition = currPosition - slideWidth;
        if (nextPosition < 0) { // no content on left
          reorgSlides(carousel, direction);
        }
        carousel.scrollLeft -= slideWidth;
      } else if (direction === 'right') {
        const nextPosition = carousel.scrollWidth - currPosition;
        if (nextPosition <= containerWidth + 2) { // include border
          reorgSlides(carousel, direction);
        }
        carousel.scrollLeft += slideWidth;
      }
    }

    const reorgSlides = (carousel, direction) => {
      const slides = carousel.querySelectorAll('div.carousel-slide');
          
      if (direction === 'left') {
        // add last slide to front
        const lastSlide = slides[slides.length - 1];
        carousel.prepend(lastSlide);
      } else if (direction === 'right') {
        // add first slide to end
        const firstSlide = slides[0];
        carousel.append(firstSlide);
      }
    }

    leftBtn.addEventListener('click', navScroll);
    rightBtn.addEventListener('click', navScroll);

    block.append(leftBtn, rightBtn);
  }

  block.classList.add(`carousel-${titleDashed}`);
}
