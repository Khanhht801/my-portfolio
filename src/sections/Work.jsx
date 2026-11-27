import React, { useEffect, useRef, useState } from 'react';
import FutureLearnCaseStudy from './FutureLearnCaseStudy.jsx';
import LearnSpaceCaseStudy from './LearnSpaceCaseStudy.jsx';
import './case-study.css';

export default function Work() {
  const [caseOpen, setCaseOpen] = useState(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const openCase = (event) => {
      const trigger = event.target.closest('[data-open-futurelearn], [data-open-learnspace]');
      if (!trigger) return;
      const type = trigger.hasAttribute('data-open-learnspace') ? 'learnspace' : 'futurelearn';
      triggerRef.current = trigger.closest('[data-project-marquee-clone]')
        ? document.querySelector(`[data-open-${type}]:not([tabindex="-1"])`) : trigger;
      setCaseOpen(type);
    };
    document.addEventListener('click', openCase);
    return () => document.removeEventListener('click', openCase);
  }, []);

  const closeCase = () => {
    setCaseOpen(null);
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
        <p>Các dự án học tập, ý tưởng sản phẩm và công việc vận hành website của tôi. Khám phá case study và bản demo của FutureLearn và LearnSpace.</p>
      </header>
      <div className="project-gallery__viewport" data-project-viewport="">
        <ul className="project-gallery__track" data-project-track="" aria-label="Danh sách dự án tiêu biểu">
          {/* PROJECT 01 */}
          <li className="project-tile">
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
          </li>
          {/* PROJECT 02 */}
          <li className="project-tile">
            <figure className="project-tile__media">
              <img src="image/learnspace.webp" alt="Giao diện trang chủ LearnSpace với thư viện học tập và linh vật chú gà" width={1200} height={675} loading="lazy" onError={(event) => { if (event.currentTarget.getAttribute('src') !== 'image/logo.jpg') event.currentTarget.src = 'image/logo.jpg'; }} />
              <span className="project-tile__number" aria-hidden="true">02</span>
              <div className="project-tile__badges"><span>EDUCATION</span><span>2026</span></div>
            </figure>
            <div className="project-tile__body">
              <div className="project-tile__meta"><span>WEB APPLICATION</span><span>REACT · SUPABASE</span></div>
              <h3>LearnSpace</h3>
              <p>Không gian khám phá, lưu lại và chia sẻ tài liệu học tập, bắt đầu với kiến thức lập trình.</p>
              <div className="project-tile__footer">
                <span>Fullstack Developer</span>
                <div className="project-tile__actions">
                  <button type="button" data-open-learnspace="" aria-label="Xem case study LearnSpace">Case study</button>
                  <a href="https://learn-space.khanhht.tech" target="_blank" rel="noopener noreferrer" aria-label="Xem dự án LearnSpace">
                    Xem dự án <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" /></svg>
                  </a>
                </div>
              </div>
            </div>
          </li>
          {/* PROJECT 03 */}
          <li className="project-tile project-tile--dark">
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
          </li>
          {/* PROJECT 04 */}
          <li className="project-tile">
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
          </li>
          {/* PROJECT 05 */}
          <li className="project-tile project-tile--blue">
            <figure className="project-tile__media">
              <img src="image/optimized/portfolio-current.webp" alt="Giao diện trang portfolio cá nhân Khanhht" width={1200} height={675} loading="lazy" onError={(event) => { if (event.currentTarget.getAttribute('src') !== 'image/logo.jpg') event.currentTarget.src = 'image/logo.jpg'; }} />
              <span className="project-tile__number" aria-hidden="true">05</span>
              <div className="project-tile__badges"><span>PERSONAL</span><span>2026</span></div>
            </figure>
            <div className="project-tile__body">
              <div className="project-tile__meta"><span>FRONTEND</span><span>REACT · TAILWIND · JAVASCRIPT</span></div>
              <h3>Portfolio cá nhân Khanhht</h3>
              <p>Website cá nhân xây dựng bằng React và Tailwind CSS, giới thiệu dự án, kinh nghiệm, học vấn và hồ sơ CV.</p>
              <div className="project-tile__footer">
                <span>Designer &amp; Developer</span>
                <a className="project-tile__current" href="#hero">Đang xem <span aria-hidden="true">↑</span></a>
              </div>
            </div>
          </li>
        </ul>
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
{caseOpen === 'futurelearn' && <FutureLearnCaseStudy onClose={closeCase} />}
{caseOpen === 'learnspace' && <LearnSpaceCaseStudy onClose={closeCase} />}
    </>
  );
}
