import { useEffect, useRef } from 'react';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import { useHayc } from '../hayc/config-context';
import BookNowButton from './BookNowButton';
import { SlideShadowTop } from './HeroIcons';

export default function DestinationsSwiper() {
  const { t, img, config, cp } = useHayc();
  const dest = config.destinationsConfig;
  const containerRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<Swiper | null>(null);

  useEffect(() => {
    const el = containerRef.current?.querySelector('.sk-travel-swiper');
    if (!el) return;

    swiperRef.current = new Swiper(el as HTMLElement, {
      modules: [Navigation],
      slidesPerView: 1,
      centeredSlides: true,
      loop: true,
      navigation: {
        nextEl: '.sk-travel-swiper .swiper-button-next',
        prevEl: '.sk-travel-swiper .swiper-button-prev',
      },
      breakpoints: {
        556: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        992: { slidesPerView: 4 },
        1200: { slidesPerView: 5 },
      },
    });

    return () => {
      swiperRef.current?.destroy();
      swiperRef.current = null;
    };
  }, [dest.items.length]);

  return (
    <section className="px-3 px-lg-0 pb-5 py-xl-8" id="destinations">
      <div className="sk-travel-swiper-container" ref={containerRef}>
        <div className="swiper sk-travel-swiper">
          <div className="swiper-wrapper">
            {dest.items.map((item, i) => (
              <div key={item.image} className="swiper-slide">
                <SlideShadowTop id={`dest-${i}`} />
                <div
                  className="overlay"
                  style={{ background: `url(${img(item.image)}) center / cover no-repeat` }}
                />
                <h3 className="slide-title" {...cp(`destinationsConfig.items.${i}.title`)}>
                  {t(item.title)}
                </h3>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-center mt-4">
            <BookNowButton
              configPath="destinationsConfig.bookNowLabel"
              labelPath="destinationsConfig.bookNowLabel"
              label={t(dest.bookNowLabel)}
            />
          </div>

          <div className="swiper-buttons">
            <div className="swiper-button swiper-button-prev">
              <div className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M6.871 9.24952H16V10.7495H6.871L10.894 14.7725L9.8335 15.833L4 9.99952L9.8335 4.16602L10.894 5.22652L6.871 9.24952Z"
                    fill="#525866"
                  />
                </svg>
              </div>
            </div>
            <div className="swiper-button swiper-button-next">
              <div className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M6.871 9.24952H16V10.7495H6.871L10.894 14.7725L9.8335 15.833L4 9.99952L9.8335 4.16602L10.894 5.22652L6.871 9.24952Z"
                    fill="#525866"
                  />
                </svg>
              </div>
            </div>
            <div className="swiper-buttons-wrapper" />
          </div>
        </div>
      </div>
    </section>
  );
}
