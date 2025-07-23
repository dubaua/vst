import './main.css';
import './header.css';
import './button.css';
import './homepage-hero-banner.css';
import './factoid.css';
import './asymmetric-slider.css';

function renderHeader() {
  const header = document.querySelector('.header');
  const scrollTop = window.scrollY || document.documentElement.scrollTop;

  if (scrollTop === 0) {
    header.classList.add('header__transparent');
  } else {
    header.classList.remove('header__transparent');
  }
}

window.addEventListener('scroll', renderHeader);
window.addEventListener('resize', renderHeader);

renderHeader()
