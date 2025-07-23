class Observable {
  /** Internal value storage
   * @type {*}
   */
  internal;

  /** Array of callbacks
   * @type {Array<function>}
   */
  callbacks = [];

  /** Allows to set initial value
   * @param {*} initial
   */
  constructor(initial) {
    this.internal = initial;
  }

  /**
   * Higher order function acceping subscriber and returning unsubscriber
   * @param {function} callback a function accepting next and prev values
   * @returns {function} unsubscriber function stops firing callback
   */
  subscribe(callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('[createObservable]: expected callback to be a function.');
    }
    this.callbacks.push(callback);
    return () => {
      const index = this.callbacks.indexOf(callback);
      this.callbacks = this.callbacks.slice(0, index).concat(this.callbacks.slice(index + 1));
    };
  }

  get value() {
    return this.internal;
  }

  set value(next) {
    if (next !== this.internal) {
      const prev = this.internal;
      this.internal = next;
      for (let i = 0; i < this.callbacks.length; i++) {
        this.callbacks[i](this.internal, prev);
      }
    }
  }
}

function animate({ duration, delay, easing, draw, onComplete, onCancel }) {
  if (typeof duration !== 'number' || duration <= 0) {
    throw new TypeError(`animate: duration is required positive number in ms, got ${typeof duration} ${duration}`);
  }

  if (delay && (typeof delay !== 'number' || delay < 0)) {
    throw new TypeError(`animate: delay should non negative number in ms, got ${typeof delay} ${delay}`);
  }

  if (typeof easing !== 'function') {
    throw new TypeError(`animate: easing is required function, got ${typeof easing} ${easing}`);
  }

  if (typeof draw !== 'function') {
    throw new TypeError(`animate: draw is required function, got ${typeof draw} ${draw}`);
  }

  let lastTimestamp = performance.now();
  let progress = 0;
  let fraction = 0;
  let delayBuffer = 0;
  let requestId = null;
  const isRunning = new Observable(false);
  isRunning.subscribe(onIsRunningChange);
  isRunning.value = true;

  function tick(timestamp) {
    const timedelta = timestamp - lastTimestamp;
    const frametick = timedelta / duration;

    if (delayBuffer < delay) {
      delayBuffer += timedelta;
    } else {
      fraction = Math.min(1, Math.max(0, fraction + frametick));
      progress = easing(fraction);
      draw(progress);
    }

    if (fraction === 1) {
      isRunning.value = false;
      if (typeof onComplete === 'function') {
        onComplete();
      }
    } else {
      lastTimestamp = timestamp;
      requestId = window.requestAnimationFrame(tick);
    }
  }

  function onIsRunningChange(nextState) {
    if (nextState) {
      lastTimestamp = performance.now();
      requestId = window.requestAnimationFrame(tick);
    } else {
      if (typeof onCancel === 'function' && progress !== 1 && progress !== 0) {
        onCancel({ progress, fraction });
      }
      window.cancelAnimationFrame(requestId);
    }
  }

  function togglePause(force) {
    isRunning.value = force === undefined ? !isRunning.value : force;
  }

  return { togglePause };
}

function getDeclension(count, [one, few, many]) {
  const isFactional = Math.round(count) !== count;
  let declension = many;
  if (isFactional) {
    declension = few;
  } else {
    const units = Math.abs(count % 10);
    const tens = Math.abs(count % 100);
    if (units === 1 && tens !== 11) {
      declension = one;
    } else if (2 <= units && units <= 4 && (tens < 10 || 20 <= tens)) {
      declension = few;
    }
  }
  return declension;
}

// для того чтобы удобно инициализировать слайдер этот конфиг можно отрендерить из CMS прямо в тег script в глобальную видимость HTML
const slideConfig = [
  {
    count: 151,
    titles: ['Экскаватор', 'Экскаватора', 'Экскаваторов'],
    link: '/katalog/category-1',
    image: 'https://vsiaspectehnika.ru/image/cache/catalog/catalog_technic-2-860x600.webp',
  },
  {
    count: 54,
    titles: ['Фронтальный погрузчик', 'Фронтальных погрузчика', 'Фронтальных погрузчиков'],
    link: '/katalog/category-2',
    image: 'https://vsiaspectehnika.ru/image/cache/catalog/catalog_technic-1-860x600.webp',
  },
  {
    count: 254,
    titles: ['Экскаватор-погрузчик', 'Экскаватора-погрузчика', 'Экскаваторов-погрузчиков'],
    link: '/katalog/category-3',
    image: 'https://vsiaspectehnika.ru/image/cache/catalog/catalog_technic-2-860x600.webp',
  },
  {
    count: 38,
    titles: ['Вилочный погрузчик', 'Вилочных погрузчика', 'Вилочных погрузчиков'],
    link: '/katalog/category-4',
    image: 'https://vsiaspectehnika.ru/image/cache/catalog/catalog_technic-1-860x600.webp',
  },
  {
    count: 351,
    titles: ['Мини-экскаватор', 'Мини-экскаватора', 'Мини-экскаваторов'],
    link: '/katalog/category-5',
    image: 'https://vsiaspectehnika.ru/image/cache/catalog/catalog_technic-2-860x600.webp',
  },
  {
    count: 350,
    titles: ['Мини-погрузчик', 'Мини-погрузчика', 'Мини-погрузчиков'],
    link: '/katalog/category-6',
    image: 'https://vsiaspectehnika.ru/image/cache/catalog/catalog_technic-1-860x600.webp',
  },
  {
    count: 120,
    titles: ['Автокран', 'Автокрана', 'Автокранов'],
    link: '/katalog/category-7',
    image: 'https://vsiaspectehnika.ru/image/cache/catalog/catalog_technic-2-860x600.webp',
  },
  {
    count: 152,
    titles: ['Бульдозер', 'Бульдозера', 'Бульдозеров'],
    link: '/katalog/category-8',
    image: 'https://vsiaspectehnika.ru/image/cache/catalog/catalog_technic-1-860x600.webp',
  },
  {
    count: 35,
    titles: ['Трактор', 'Трактора', 'Тракторов'],
    link: '/katalog/category-9',
    image: 'https://vsiaspectehnika.ru/image/cache/catalog/catalog_technic-2-860x600.webp',
  },
  {
    count: 23,
    titles: ['Тягач', 'Тягача', 'Тягачей'],
    link: '/katalog/category-10',
    image: 'https://vsiaspectehnika.ru/image/cache/catalog/catalog_technic-1-860x600.webp',
  },
  {
    count: 51,
    titles: ['Каток', 'Катка', 'Катков'],
    link: '/katalog/category-11',
    image: 'https://vsiaspectehnika.ru/image/cache/catalog/catalog_technic-2-860x600.webp',
  },
  {
    count: 67,
    titles: ['Автогрейдер', 'Автогрейдера', 'Автогрейдеров'],
    link: '/katalog/category-12',
    image: 'https://vsiaspectehnika.ru/image/cache/catalog/catalog_technic-1-860x600.webp',
  },
  {
    count: 54,
    titles: ['Телескопический погрузчик', 'Телескопических погрузчика', 'Телескопических погрузчиков'],
    link: '/katalog/category-13',
    image: 'https://vsiaspectehnika.ru/image/cache/catalog/catalog_technic-2-860x600.webp',
  },
  {
    count: 121,
    titles: ['Бетоносмеситель с самозагрузкой', 'Бетоносмесителя с самозагрузкой', 'Бетоносмесителей с самозагрузкой'],
    link: '/katalog/category-14',
    image: 'https://vsiaspectehnika.ru/image/cache/catalog/catalog_technic-1-860x600.webp',
  },
  {
    count: 56,
    titles: ['Автобетононасос', 'Автобетононасоса', 'Автобетононасосов'],
    link: '/katalog/category-15',
    image: 'https://vsiaspectehnika.ru/image/cache/catalog/catalog_technic-2-860x600.webp',
  },
  {
    count: 78,
    titles: ['Самосвал', 'Самосвала', 'Самосвалов'],
    link: '/katalog/category-16',
    image: 'https://vsiaspectehnika.ru/image/cache/catalog/catalog_technic-1-860x600.webp',
  },
  {
    count: 28,
    titles: ['Буровая установка', 'Буровых установки', 'Буровых установок'],
    link: '/katalog/category-17',
    image: 'https://vsiaspectehnika.ru/image/cache/catalog/catalog_technic-2-860x600.webp',
  },
  {
    count: 12,
    titles: ['Бетонный завод', 'Бетонных завода', 'Бетонных заводов'],
    link: '/katalog/category-18',
    image: 'https://vsiaspectehnika.ru/image/cache/catalog/catalog_technic-1-860x600.webp',
  },
  {
    count: 74,
    titles: ['Башенный кран', 'Башенных крана', 'Башенных кранов'],
    link: '/katalog/category-19',
    image: 'https://vsiaspectehnika.ru/image/cache/catalog/catalog_technic-2-860x600.webp',
  },
];

function renderSlides() {
  const sceneNode = document.querySelector('[data-asymmetric-slider-scene]');
  if (sceneNode) {
    slideConfig.forEach(config => {
      sceneNode.insertAdjacentHTML('beforeend', `
<div class="swiper-slide">
    <div class="asymmetric-slider__item">
      <img src="${config.image}" />
    </div>
  </div>`)
    })
  }
}

function initializeAsymmetricSlider() {
  if (!slideConfig || !Array.isArray(slideConfig) || slideConfig.length === 0) {
    return
  }
  const countNode = document.querySelector('[data-asymmetric-slider-count]');
  const titleNode = document.querySelector('[data-asymmetric-slider-title]');
  const navCurrentNode = document.querySelector('[data-asymmetric-slider-nav-current]');
  const navTotalNode = document.querySelector('[data-asymmetric-slider-nav-total]');
  const linkNode = document.querySelector('[data-asymmetric-slider-link]');

  const speed = 612;
  let sliderAnimation;

  const swiper = new Swiper('[data-asymmetric-slider]', {
    effect: 'creative',
    creativeEffect: {
      prev: {
        translate: ['-166%', 0, 0],
      },
      active: {
        translate: [0, 0, 0],
      },
      next: {
        translate: ['133%', 0, 0],
      },
    },
    speed: speed,
    loop: false,
    on: {
      activeIndexChange: (swiper) => handleChange(swiper, navCurrentNode, navTotalNode, countNode, titleNode, linkNode, sliderAnimation, speed),
      init: (swiper) => handleChange(swiper, navCurrentNode, navTotalNode, countNode, titleNode, linkNode, sliderAnimation, speed),
    },
    navigation: {
      nextEl: '[data-asymmetric-slider-next]',
      prevEl: '[data-asymmetric-slider-prev]',
    },
  });
}

function handleChange(swiper, navCurrentNode, navTotalNode, countNode, titleNode, linkNode, sliderAnimation, speed) {
  const { activeIndex, previousIndex, slides } = swiper;

  if (navCurrentNode) {
    navCurrentNode.textContent = `${activeIndex + 1}`;
  }
  if (navTotalNode) {
    navTotalNode.textContent = `${slides.length}`;
  }

  if (countNode && titleNode) {
    sliderAnimation?.togglePause();
    sliderAnimation = animate({
      duration: speed,
      easing: (p) => p,
      draw: (p) => animateTitleAndCount(p, activeIndex, previousIndex, countNode, titleNode),
    });
  }

  if (linkNode && slideConfig[activeIndex]) {
    linkNode.href = slideConfig[activeIndex].link
  }
}

function animateTitleAndCount(progress, nextIndex, prevIndex, countNode, titleNode) {
  const { count: prevCount = 0, titles: prevTitles = ['', '', ''] } = slideConfig[prevIndex] || {};
  const { count: nextCount, titles: nextTitles } = slideConfig[nextIndex];

  const prevTitle = getDeclension(prevCount, prevTitles);
  const nextTitle = getDeclension(nextCount, nextTitles);
  const countDelta = nextCount - prevCount;

  countNode.textContent = `${Math.floor(prevCount + progress * countDelta)}`;
  animateTitle({ progress, prevTitle, nextTitle, node: titleNode });
}

function animateTitle({ progress, prevTitle, nextTitle, node }) {
  const prevLen = prevTitle.length;
  const nextLen = nextTitle.length;
  const total = prevLen + nextLen || 1;

  const erasePortion = prevLen / total;
  const writePortion = nextLen / total;

  let eraseProgress = 0;
  let writeProgress = 0;

  if (progress <= erasePortion) {
    eraseProgress = erasePortion > 0 ? progress / erasePortion : 1;
    writeProgress = 0;
  } else {
    eraseProgress = 1;
    writeProgress = writePortion > 0 ? (progress - erasePortion) / writePortion : 1;
  }

  const eraseCount = Math.ceil(prevLen * (1 - eraseProgress));
  const writeCount = Math.ceil(nextLen * writeProgress);

  const visible = prevTitle.slice(0, eraseCount) + nextTitle.slice(0, writeCount);
  node.textContent = visible;
}

renderSlides()
initializeAsymmetricSlider()