export default async function decorateIndexWrapper(block) {
  console.log('hi from index-wrapper.js');
  const nav = block.querySelector('.index-nav-container');
  const carousel = block.querySelector('.index-carousel-container');
  if (nav && carousel) {
    setTimeout(function () {
      carousel.style.maxHeight = `${nav.offsetHeight}px`;
    }, 100);
  }
}
