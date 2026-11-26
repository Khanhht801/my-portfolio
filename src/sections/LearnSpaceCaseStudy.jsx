import React, { useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import learnspaceImage from '../../image/learnspace.webp';
import './learnspace-case-study.css';

const journey = [
  ['01', 'Khám phá', 'Chọn chủ đề quan tâm'],
  ['02', 'Tìm tài liệu', 'Tìm kiếm và lọc nội dung'],
  ['03', 'Đăng nhập', 'Mở chi tiết và đọc tài liệu'],
  ['04', 'Lưu để học', 'Giữ lại nội dung hữu ích'],
  ['05', 'Chia sẻ', 'Đóng góp cho cộng đồng'],
];

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
            <section><h3>Tổng quan</h3><p>LearnSpace tập hợp tài liệu lập trình trong một thư viện, giúp người học tìm nội dung phù hợp và quay lại khi cần.</p></section>
            <section><h3>Vấn đề</h3><p>Tài liệu nằm ở nhiều nơi có thể khiến việc tìm kiếm và lưu lại để học tiếp trở nên mất thời gian.</p></section>
            <section><h3>Giải pháp</h3><p>Tổ chức tài liệu theo chủ đề, kết hợp tìm kiếm, danh sách đã lưu và đóng góp từ cộng đồng.</p></section>
          </div>

          <section className="learn-case__section" aria-labelledby="learn-journey"><h3 id="learn-journey">Hành trình người dùng</h3>
            <ol className="learn-case__journey">{journey.map(([number, title, detail]) => <li key={number}><span>{number}</span><h4>{title}</h4><p>{detail}</p></li>)}</ol>
          </section>
          <section className="learn-case__section" aria-labelledby="learn-features"><h3 id="learn-features">Tính năng sản phẩm</h3>
            <div className="learn-case__features">
              <article><span className="learn-case__feature-icon" aria-hidden="true">⌕</span><h4>Thư viện tài liệu</h4><p>Tìm theo từ khóa, lọc theo chủ đề và sắp xếp danh sách trước khi mở tài liệu.</p></article>
              <article><span className="learn-case__feature-icon" aria-hidden="true">♡</span><h4>Tài liệu đã lưu</h4><p>Lưu nội dung quan tâm và đồng bộ danh sách với tài khoản để tìm lại trên các thiết bị.</p></article>
              <article><span className="learn-case__feature-icon" aria-hidden="true">↗</span><h4>Đóng góp cộng đồng</h4><p>Thành viên gửi tài liệu PDF; quản trị viên kiểm tra trước khi tài liệu được công khai.</p></article>
            </div>
          </section>
          <section className="learn-case__section" aria-labelledby="learn-tech"><h3 id="learn-tech">Tiếp cận kỹ thuật</h3>
            <div className="learn-case__tech"><article><strong>React &amp; React Router</strong><p>Xây dựng giao diện và điều hướng giữa các trang.</p></article><article><strong>Supabase</strong><p>Quản lý dữ liệu, xác thực và lưu trữ tài liệu.</p></article><article><strong>Xác thực &amp; kiểm duyệt</strong><p>Đăng nhập để đọc, tải hoặc đóng góp; nội dung cộng đồng được duyệt trước khi công khai.</p></article></div>
          </section>
          <div className="learn-case__closing learn-case__section">
            <section><h3>Bài học rút ra</h3><p>Thiết kế một thư viện cần kết nối trải nghiệm tìm kiếm, lưu trữ và quyền truy cập để người học dễ tiếp tục hành trình của mình.</p></section>
            <section><h3>Hướng phát triển</h3><p>Tiếp tục hoàn thiện nội dung thư viện, trải nghiệm tìm kiếm và quy trình đóng góp tài liệu.</p></section>
          </div>
          <footer className="learn-case__footer"><a href="https://learn-space.khanhht.tech" target="_blank" rel="noopener noreferrer">Xem dự án <span aria-hidden="true">↗</span></a></footer>
        </div>
      </div>
    </dialog>, document.body
  );
}
