import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './case-study.css';

function CaseIcon({ name }) {
  const paths = {
    code: <><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" /></>,
    screen: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 5v1" /></>,
    spark: <path d="m12 3 1.8 5.7L19.5 10l-5.7 1.8L12 17.5l-1.8-5.7L4.5 10l5.7-1.3L12 3ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" />,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  };
  return <svg className="case-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function FutureLearnCaseStudy({ onClose }) {
  const dialogRef = useRef(null);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  return createPortal(
    <dialog ref={dialogRef} className="case-dialog" aria-labelledby="case-title" onClose={onClose} onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}>
      <div className="case-dialog__content">
        <div className="case-dialog__top">
          <span className="case-dialog__eyebrow"><i /> CASE STUDY / 01</span>
          <button className="case-dialog__close" type="button" aria-label="Đóng case study" onClick={() => dialogRef.current.close()}>×</button>
        </div>
        <div className="case-dialog__intro">
          <div>
            <div className="case-dialog__tags"><span>ACADEMIC PROJECT</span><span>2026</span></div>
            <h2 id="case-title">Học tập vui hơn cùng <span>FutureLearn.</span></h2>
            <p>Nền tảng học tiếng Anh và Toán dành cho trẻ mầm non, tiểu học, đồng hành cùng phụ huynh trong quá trình theo dõi việc học của con.</p>
          </div>
          <figure className="case-dialog__image"><div className="case-dialog__browser" aria-hidden="true"><i /><i /><i /><span>future-learn.khanhht.tech</span></div><img src="image/futurelearn.png" alt="Giao diện trang học tập FutureLearn" /><figcaption><CaseIcon name="spark" /> MỘT KHÔNG GIAN HỌC TẬP ĐẦY MÀU SẮC</figcaption></figure>
        </div>
        <div className="case-dialog__facts">
          <div><i><CaseIcon name="code" /></i><span>VAI TRÒ<strong>Fullstack Developer</strong></span></div>
          <div><i><CaseIcon name="screen" /></i><span>LOẠI DỰ ÁN<strong>Ứng dụng web học tập</strong></span></div>
          <div><i><CaseIcon name="users" /></i><span>ĐỐI TƯỢNG<strong>Trẻ em &amp; phụ huynh</strong></span></div>
        </div>
        <div className="case-dialog__details">
          <section><span>01 / BỐI CẢNH</span><h3>Một không gian để học và đồng hành.</h3><p>FutureLearn hướng đến việc hỗ trợ trẻ tiếp cận tiếng Anh và Toán, đồng thời giúp phụ huynh theo dõi tiến độ học tập của con trên cùng một nền tảng.</p></section>
          <section><span>02 / SẢN PHẨM</span><h3>Trải nghiệm dành cho gia đình.</h3><p>Dự án tập trung vào hai nhu cầu chính: tạo môi trường học tập cho trẻ và cung cấp khả năng theo dõi tiến độ cho phụ huynh.</p></section>
        </div>
        <section className="case-dialog__gallery" aria-labelledby="case-gallery-title">
          <div className="case-dialog__gallery-heading"><div><span>03 / GÓC NHÌN SẢN PHẨM</span><h3 id="case-gallery-title">Một thế giới, nhiều khám phá.</h3></div><CaseIcon name="spark" /></div>
          <p>Những góc nhìn từ giao diện FutureLearn.</p>
          <div className="case-dialog__gallery-grid">
            <figure><div className="case-dialog__crop case-dialog__crop--math" aria-hidden="true" /><figcaption><span>01</span><strong>Hành tinh Toán</strong><CaseIcon name="arrow" /></figcaption></figure>
            <figure><div className="case-dialog__crop case-dialog__crop--english" aria-hidden="true" /><figcaption><span>02</span><strong>Đảo tiếng Anh</strong><CaseIcon name="arrow" /></figcaption></figure>
            <figure><div className="case-dialog__crop case-dialog__crop--progress" aria-hidden="true" /><figcaption><span>03</span><strong>Góc học tập</strong><CaseIcon name="arrow" /></figcaption></figure>
          </div>
        </section>
        <div className="case-dialog__bottom"><div><span>TIẾP TỤC KHÁM PHÁ</span><p>Xem FutureLearn trực tiếp</p></div><a href="https://future-learn.khanhht.tech" target="_blank" rel="noopener noreferrer">Xem FutureLearn <CaseIcon name="arrow" /></a></div>
      </div>
    </dialog>, document.body
  );
}

export default function Work() {
  const [caseOpen, setCaseOpen] = useState(false);
  const triggerRef = useRef(null);

  useEffect(() => {
    const openCase = (event) => {
      const trigger = event.target.closest('[data-open-futurelearn]');
      if (!trigger) return;
      triggerRef.current = trigger.closest('[data-project-marquee-clone]')
        ? document.querySelector('[data-open-futurelearn]:not([tabindex="-1"])') : trigger;
      setCaseOpen(true);
    };
    document.addEventListener('click', openCase);
    return () => document.removeEventListener('click', openCase);
  }, []);

  const closeCase = () => {
    setCaseOpen(false);
    triggerRef.current?.focus();
  };
  return (
    <>
{/* ============================================================
     03. COMPACT PROJECT GALLERY
     - Tự động chạy ngang khi section đi vào viewport
     - Pause khi hover/focus card; loop liền mạch bằng một bộ card clone
     - Images are replaceable through each <img src="...">
============================================================ */}
<section className="project-gallery" id="work" data-project-marquee="">
  <div className="project-gallery__sticky">
    <span className="section-corner-index" aria-hidden="true">01</span>
    <div className="project-gallery__inner max-w-site mx-auto px-4 sm:px-6">
      <header className="project-gallery__header">
        <div>
          <span className="project-gallery__eyebrow"><i aria-hidden="true" />SELECTED WORK / 05</span>
          <h2 className="section-heading-title">Dự án <span>tiêu biểu.</span></h2>
        </div>
        <p>Một số dự án tôi đã thực hiện trong quá trình học tập, thực hành và phát triển kỹ năng lập trình web.</p>
      </header>
      <div className="project-gallery__viewport" data-project-viewport="">
        <div className="project-gallery__track" data-project-track="" role="list" aria-label="Danh sách dự án tiêu biểu">
          {/* PROJECT 01 */}
          <article className="project-tile" role="listitem">
            <figure className="project-tile__media">
              <img src="image/futurelearn.png" alt="Ảnh minh họa dự án FutureLearn" width={1200} height={675} loading="lazy" onError={(event) => { if (event.currentTarget.getAttribute('src') !== 'image/logo.jpg') event.currentTarget.src = 'image/logo.jpg'; }} />
              <span className="project-tile__number" aria-hidden="true">01</span>
              <div className="project-tile__badges"><span>ACADEMIC</span><span>2026</span></div>
            </figure>
            <div className="project-tile__body">
              <div className="project-tile__meta"><span>FULLSTACK</span><span>WEB APPLICATION</span></div>
              <h3>FutureLearn</h3>
              <p>Nền tảng học tiếng Anh và Toán cho trẻ mầm non, tiểu học, giúp phụ huynh theo dõi tiến độ học tập của con.</p>
              <div className="project-tile__footer">
                <span>Fullstack Developer</span>
                <div className="project-tile__actions">
                  <button type="button" data-open-futurelearn="" aria-label="Xem case study FutureLearn">Case study</button>
                  <a href="https://future-learn.khanhht.tech" target="_blank" rel="noopener noreferrer" aria-label="Xem dự án FutureLearn">
                    Xem dự án <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" /></svg>
                  </a>
                </div>
              </div>
            </div>
          </article>
          {/* PROJECT 02 */}
          <article className="project-tile project-tile--blue" role="listitem">
            <figure className="project-tile__media">
              <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85" alt="Khu vận chuyển container đại diện cho dự án logistics" width={1200} height={675} loading="lazy" onError={(event) => { if (event.currentTarget.getAttribute('src') !== 'image/logo.jpg') event.currentTarget.src = 'image/logo.jpg'; }} />
              <span className="project-tile__number" aria-hidden="true">02</span>
              <div className="project-tile__badges"><span>CONCEPT</span><span>2026</span></div>
            </figure>
            <div className="project-tile__body">
              <div className="project-tile__meta"><span>REAL-TIME</span><span>NEXT.JS · WEBSOCKET · SQL</span></div>
              <h3>Giám sát vận tải &amp; chuỗi cung ứng</h3>
              <p>Theo dõi vị trí, trạng thái đội xe và hỗ trợ phát hiện chậm trễ trong quá trình vận hành.</p>
              <div className="project-tile__footer">
                <span>Product &amp; Fullstack</span>
                <span className="project-tile__soon" aria-label="Demo đang cập nhật">Demo · Soon</span>
              </div>
            </div>
          </article>
          {/* PROJECT 03 */}
          <article className="project-tile project-tile--dark" role="listitem">
            <figure className="project-tile__media">
              <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85" alt="Thanh toán trực tuyến đại diện cho dự án thương mại điện tử" width={1200} height={675} loading="lazy" onError={(event) => { if (event.currentTarget.getAttribute('src') !== 'image/logo.jpg') event.currentTarget.src = 'image/logo.jpg'; }} />
              <span className="project-tile__number" aria-hidden="true">03</span>
              <div className="project-tile__badges"><span>CASE STUDY</span><span>2026</span></div>
            </figure>
            <div className="project-tile__body">
              <div className="project-tile__meta"><span>ANALYTICS</span><span>REACT · TYPESCRIPT · REDIS</span></div>
              <h3>Thương mại điện tử &amp; phân tích</h3>
              <p>Tổng hợp đơn hàng, tồn kho và hiệu suất bán hàng đa kênh vào một dashboard quản trị.</p>
              <div className="project-tile__footer">
                <span>Fullstack Developer</span>
                <span className="project-tile__soon" aria-label="Source code đang cập nhật">Source · Soon</span>
              </div>
            </div>
          </article>
          {/* PROJECT 04 */}
          <article className="project-tile" role="listitem">
            <figure className="project-tile__media">
              <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85" alt="Không gian làm việc đại diện cho dự án vận hành website" width={1200} height={675} loading="lazy" onError={(event) => { if (event.currentTarget.getAttribute('src') !== 'image/logo.jpg') event.currentTarget.src = 'image/logo.jpg'; }} />
              <span className="project-tile__number" aria-hidden="true">04</span>
              <div className="project-tile__badges"><span>OPERATIONS</span><span>2025</span></div>
            </figure>
            <div className="project-tile__body">
              <div className="project-tile__meta"><span>CMS</span><span>CONTENT · SEO · ANALYTICS</span></div>
              <h3>Website nội dung &amp; tuyển sinh</h3>
              <p>Quản lý nội dung khóa học, cập nhật thông tin và hỗ trợ vận hành các kênh trực tuyến.</p>
              <div className="project-tile__footer">
                <span>Web Content &amp; Operations</span>
                <span className="project-tile__soon" aria-label="Case study đang cập nhật">Case study · Soon</span>
              </div>
            </div>
          </article>
          {/* PROJECT 05 */}
          <article className="project-tile project-tile--blue" role="listitem">
            <figure className="project-tile__media">
              <img src="https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1200&q=85" alt="Màn hình lập trình đại diện cho portfolio cá nhân" width={1200} height={675} loading="lazy" onError={(event) => { if (event.currentTarget.getAttribute('src') !== 'image/logo.jpg') event.currentTarget.src = 'image/logo.jpg'; }} />
              <span className="project-tile__number" aria-hidden="true">05</span>
              <div className="project-tile__badges"><span>PERSONAL</span><span>2026</span></div>
            </figure>
            <div className="project-tile__body">
              <div className="project-tile__meta"><span>FRONTEND</span><span>HTML · TAILWIND · JAVASCRIPT</span></div>
              <h3>Portfolio cá nhân Khanhht</h3>
              <p>Portfolio responsive thể hiện dự án, hành trình học tập và định hướng phát triển Fullstack.</p>
              <div className="project-tile__footer">
                <span>Designer &amp; Developer</span>
                <a className="project-tile__current" href="#hero">Đang xem <span aria-hidden="true">↑</span></a>
              </div>
            </div>
          </article>
        </div>
      </div>
      <div className="project-gallery__progress" aria-hidden="true">
        <span>AUTO PLAY · HOVER TO PAUSE</span>
        <div><i data-project-progress="" /></div>
        <strong><b data-project-current="">01</b> / 05</strong>
      </div>
      <div className="project-gallery__dots" data-project-dots="" role="group" aria-label="Chọn dự án" />
    </div>
  </div>
</section>
{caseOpen && <FutureLearnCaseStudy onClose={closeCase} />}
    </>
  );
}
