import React, { useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import learnspaceImage from '../../image/learnspace.webp';
import libraryImage from '../../image/case-study/learnspace-library.webp';
import savedImage from '../../image/case-study/learnspace-saved.webp';
import communityImage from '../../image/case-study/learnspace-community.webp';
import './learnspace-case-study.css';

const journey = [
  ['compass', 'Khám phá', 'Chọn chủ đề'],
  ['search', 'Tìm tài liệu', 'Tìm kiếm và lọc'],
  ['user', 'Đăng nhập', 'Mở và đọc tài liệu'],
  ['bookmark', 'Lưu để học', 'Giữ lại nội dung'],
  ['share', 'Chia sẻ', 'Đóng góp tài liệu'],
];

function Icon({ name }) {
  const paths = {
    compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    bookmark: <path d="M6 3h12v18l-6-4-6 4V3Z" />,
    share: <><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6" /></>,
    code: <path d="m8 8-4 4 4 4m8-8 4 4-4 4m-2-12-4 16" />,
    database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" /></>,
    shield: <><path d="M12 2 4 5v6c0 5 3.3 8.6 8 11 4.7-2.4 8-6 8-11V5l-8-3Z" /><path d="m8.5 12 2.3 2.3 4.7-4.7" /></>,
    bulb: <><path d="M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 4H9c0-2 0-3-1-4Z" /></>,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
  };
  return <svg className="learn-case__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function LearnSpaceCaseStudy({ onClose }) {
  const dialogRef = useRef(null);
  const backdropStart = useRef(false);

  useLayoutEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current.showModal();
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  return createPortal(
    <dialog ref={dialogRef} className="case-dialog learn-case" aria-labelledby="learn-case-title" onClose={onClose}
      onPointerDown={(event) => { backdropStart.current = event.target === event.currentTarget; }}
      onClick={(event) => {
        if (event.target === event.currentTarget && (backdropStart.current || event.detail === 0)) event.currentTarget.close();
        backdropStart.current = false;
      }}>
      <div className="case-dialog__surface">
        <header className="case-dialog__top learn-case__top">
          <span>CASE STUDY / LEARNSPACE</span>
          <button className="case-dialog__close" type="button" aria-label="Đóng case study LearnSpace" onClick={() => dialogRef.current.close()}>
            <svg className="case-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg>
          </button>
        </header>
        <div className="learn-case__content">
          <div className="learn-case__hero">
            <div>
              <p className="learn-case__eyebrow">THƯ VIỆN HỌC TẬP / 2026</p>
              <h2 id="learn-case-title">LearnSpace<span>Kiến thức dễ tìm.<br />Học tập dễ hơn.</span></h2>
              <p>Không gian khám phá, lưu lại và chia sẻ tài liệu học tập, bắt đầu với kiến thức lập trình.</p>
              <ul className="learn-case__tags" aria-label="Thông tin dự án"><li>React</li><li>Supabase</li><li>Fullstack Developer</li></ul>
            </div>
            <figure className="learn-case__hero-image"><img src={learnspaceImage} width="1200" height="675" alt="Giao diện trang chủ LearnSpace với linh vật chú gà và khu vực tìm kiếm tài liệu" /></figure>
          </div>

          <div className="learn-case__overview">
            <section><h3>Tổng quan</h3><p>Một thư viện tài liệu lập trình cho người tự học.</p></section>
            <section><h3>Vấn đề</h3><p>Tài liệu rải rác, khó tìm và khó lưu lại.</p></section>
            <section><h3>Giải pháp</h3><p>Tìm, lưu và chia sẻ tài liệu tại một nơi.</p></section>
          </div>

          <section className="learn-case__section" aria-labelledby="learn-journey"><h3 id="learn-journey">Hành trình người dùng</h3>
            <ol className="learn-case__journey">{journey.map(([icon, title, detail]) => <li key={icon}><span><Icon name={icon} /></span><h4>{title}</h4><p>{detail}</p></li>)}</ol>
          </section>
          <section className="learn-case__section" aria-labelledby="learn-features"><h3 id="learn-features">Tính năng sản phẩm</h3>
            <div className="learn-case__features">
              <article><img src={libraryImage} alt="" width="960" height="520" loading="lazy" /><div><span className="learn-case__feature-icon"><Icon name="search" /></span><h4>Thư viện tài liệu</h4><p>Tìm kiếm và lọc theo chủ đề.</p></div></article>
              <article><img src={savedImage} alt="" width="960" height="520" loading="lazy" /><div><span className="learn-case__feature-icon"><Icon name="bookmark" /></span><h4>Tài liệu đã lưu</h4><p>Lưu và đồng bộ để học tiếp.</p></div></article>
              <article><img src={communityImage} alt="" width="960" height="520" loading="lazy" /><div><span className="learn-case__feature-icon"><Icon name="share" /></span><h4>Đóng góp cộng đồng</h4><p>Gửi tài liệu để quản trị viên duyệt.</p></div></article>
            </div>
          </section>
          <section className="learn-case__section" aria-labelledby="learn-tech"><h3 id="learn-tech">Tiếp cận kỹ thuật</h3>
            <div className="learn-case__tech"><article><span><Icon name="code" /></span><div><strong>React &amp; React Router</strong><p>Giao diện và điều hướng.</p></div></article><article><span><Icon name="database" /></span><div><strong>Supabase</strong><p>Dữ liệu, xác thực và lưu trữ.</p></div></article><article><span><Icon name="shield" /></span><div><strong>Xác thực &amp; kiểm duyệt</strong><p>Đăng nhập và duyệt tài liệu cộng đồng.</p></div></article></div>
          </section>
          <div className="learn-case__closing learn-case__section">
            <section><span><Icon name="bulb" /></span><div><h3>Bài học rút ra</h3><p>Kết nối tìm kiếm, lưu trữ và quyền truy cập trong một trải nghiệm liền mạch.</p></div></section>
            <section><span><Icon name="target" /></span><div><h3>Hướng phát triển</h3><p>Hoàn thiện thư viện, tìm kiếm và quy trình đóng góp.</p></div></section>
          </div>
          <footer className="learn-case__footer"><a href="https://learn-space.khanhht.tech" target="_blank" rel="noopener noreferrer">Xem dự án <span aria-hidden="true">↗</span></a></footer>
        </div>
      </div>
    </dialog>, document.body
  );
}
