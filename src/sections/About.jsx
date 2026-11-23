import React from 'react';

export default function About() {
  return (
    <>
{/* ============================================================
     04. ABOUT SECTION
     - Editorial composition đồng bộ với hero
     - Click/chạm trực tiếp vào ảnh để xem ảnh kế tiếp; autoplay mỗi 3 giây
     - Selector JS phụ thuộc: [data-autoplay-slider], [data-slide],
 [data-slide-next], [data-dot-index]
============================================================ */}
<section className="about-showcase relative overflow-hidden border-b border-[#E7E5E4]" id="about">
  <div className="about-showcase__orb about-showcase__orb--top" aria-hidden="true" />
  <div className="about-showcase__orb about-showcase__orb--bottom" aria-hidden="true" />
  <span className="about-showcase__index section-corner-index" aria-hidden="true">02</span>
  <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <header className="about-heading reveal-on-scroll is-visible">
      <div className="about-heading__meta">
        <span>ABOUT</span>
        <i aria-hidden="true" />
        <span>GIỚI THIỆU</span>
      </div>
      <h2 className="about-heading__title section-heading-title animate-booted" data-anim="animate__fadeInUp">
        Không chỉ viết code.<br />
        <span>Tôi xây trải nghiệm.</span>
      </h2>
      <p className="about-heading__note">TỪ Ý TƯỞNG<br />ĐẾN SẢN PHẨM</p>
    </header>
    <div className="about-layout">
      {/* Portrait / editorial collage */}
      <div className="about-visual reveal-on-scroll is-visible">
        <div className="about-visual__backdrop" aria-hidden="true" />
        <div className="about-visual__sticker" aria-hidden="true">
          <span>LEARN</span><i /><span>BUILD</span><i /><span>IMPROVE</span>
        </div>
        <div className="about-slider" data-autoplay-slider="" data-autoplay-ms={3000}>
          <div className="about-slider__frame" data-slide-next="" role="button" tabIndex={0} aria-label="Xem ảnh chân dung tiếp theo">
            <ul className="about-slider__slides" data-slides="" aria-live="polite">
              <li className="absolute inset-0 transition-opacity duration-700 ease-in-out opacity-100" data-slide="">
                <img alt="Hoàng Thanh Khánh - chân dung 01" loading="lazy" width={1200} height={1800} className="w-full h-full object-cover object-top block" src="image/about/a1.jpg" onError={(event) => { if (event.currentTarget.getAttribute('src') !== 'image/about/a1.jpg') event.currentTarget.src = 'image/about/a1.jpg'; }} />
              </li>
              <li className="absolute inset-0 transition-opacity duration-700 ease-in-out opacity-0" data-slide="">
                <img alt="Hoàng Thanh Khánh - chân dung 02" loading="lazy" width={1200} height={1800} className="w-full h-full object-cover object-center block" src="image/about/a2.jpg" onError={(event) => { if (event.currentTarget.getAttribute('src') !== 'image/about/a1.jpg') event.currentTarget.src = 'image/about/a1.jpg'; }} />
              </li>
              <li className="absolute inset-0 transition-opacity duration-700 ease-in-out opacity-0" data-slide="">
                <img alt="Hoàng Thanh Khánh - chân dung 03" loading="lazy" width={1200} height={1800} className="w-full h-full object-cover object-top block" src="image/about/a3.jpg" onError={(event) => { if (event.currentTarget.getAttribute('src') !== 'image/about/a1.jpg') event.currentTarget.src = 'image/about/a1.jpg'; }} />
              </li>
              <li className="absolute inset-0 transition-opacity duration-700 ease-in-out opacity-0" data-slide="">
                <img alt="Hoàng Thanh Khánh - chân dung 04" loading="lazy" width={1200} height={1800} className="w-full h-full object-cover object-top block" src="image/about/a4.jpg" onError={(event) => { if (event.currentTarget.getAttribute('src') !== 'image/about/a1.jpg') event.currentTarget.src = 'image/about/a1.jpg'; }} />
              </li>
              <li className="absolute inset-0 transition-opacity duration-700 ease-in-out opacity-0" data-slide="">
                <img alt="Hoàng Thanh Khánh - chân dung 05" loading="lazy" width={1200} height={1800} className="w-full h-full object-cover object-top block" src="image/about/a5.jpg" onError={(event) => { if (event.currentTarget.getAttribute('src') !== 'image/about/a1.jpg') event.currentTarget.src = 'image/about/a1.jpg'; }} />
              </li>
            </ul>
            <div className="about-slider__caption">
              <span className="about-slider__caption-label">MY JOURNEY</span>
              <span className="about-slider__caption-count">01 — 05</span>
            </div>
          </div>
          <div className="about-slider__dots" data-dots="" role="tablist" aria-label="Chọn ảnh chân dung">
            <button type="button" role="tab" data-dot-index={0} className="about-slider__dot bg-[#007BFF]" aria-label="Xem ảnh 1"><span /></button>
            <button type="button" role="tab" data-dot-index={1} className="about-slider__dot bg-[#E7E5E4]" aria-label="Xem ảnh 2"><span /></button>
            <button type="button" role="tab" data-dot-index={2} className="about-slider__dot bg-[#E7E5E4]" aria-label="Xem ảnh 3"><span /></button>
            <button type="button" role="tab" data-dot-index={3} className="about-slider__dot bg-[#E7E5E4]" aria-label="Xem ảnh 4"><span /></button>
            <button type="button" role="tab" data-dot-index={4} className="about-slider__dot bg-[#E7E5E4]" aria-label="Xem ảnh 5"><span /></button>
          </div>
        </div>
      </div>
      {/* Story / statement */}
      <article className="about-story reveal-on-scroll is-visible">
        <div className="about-story__kicker animate-booted" data-anim="animate__fadeInRight">
          <span>HOÀNG THANH KHÁNH</span>
          <i aria-hidden="true" />
          <span>FULLSTACK DEV</span>
        </div>
        <blockquote className="about-story__quote animate-booted" data-anim="animate__fadeInRight" data-delay="0.08">
          <span>Học điều mới.</span>
          <span className="about-story__quote-accent">Làm điều tốt.</span>
          <span>Tạo điều khác biệt.</span>
        </blockquote>
        <div className="about-story__copy">
          <p>
            Tôi là sinh viên năm 3 ngành Tin học ứng dụng, định hướng phát triển Fullstack. Tôi yêu thích việc biến ý tưởng thành những sản phẩm web có giao diện rõ ràng, dễ sử dụng và vận hành ổn định.
          </p>
          <p>
            Bên cạnh lập trình, tôi có kinh nghiệm quản lý website, xây dựng nội dung số. Điều đó giúp tôi chú ý hơn đến trải nghiệm người dùng, tính thực tế và sự chỉn chu của sản phẩm.
          </p>
        </div>
        <ul className="about-values" aria-label="Ba giá trị trong cách tôi làm việc">
          <li><span>01</span><strong>Chủ động</strong><small>Tự học và tìm giải pháp</small></li>
          <li><span>02</span><strong>Chỉn chu</strong><small>Quan tâm đến chất lượng sản phẩm</small></li>
          <li><span>03</span><strong>Thực tế</strong><small>Ưu tiên giải pháp dễ dùng và hiệu quả</small></li>
        </ul>
        <div className="about-story__actions">
          <a className="btn-shimmer about-action about-action--primary group" href="CV - Hoàng Thanh Khánh - Fullstack.pdf?v=1d70854a" target="_blank" rel="noopener noreferrer">
            <span>Xem hồ sơ (CV)</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            </svg>
          </a>
          <a className="about-action about-action--secondary group" href="#contact">
            <span>Liên hệ trực tiếp</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            </svg>
          </a>
        </div>
      </article>
    </div>
    <div className="about-marquee" aria-hidden="true">
      <span>DESIGN WITH PURPOSE</span><i /><span>CODE WITH CLARITY</span><i /><span>BUILD FOR PEOPLE</span>
    </div>
  </div>
</section>
    </>
  );
}
