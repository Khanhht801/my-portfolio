import React from 'react';

export default function Capabilities() {
  return (
    <>
{/* ============================================================
     06. TECH STACK (Marquee rows)
     - Hai hàng marquee: Frontend/Backend (phải → trái) và DB/DevOps (trái → phải)
     - Logo công nghệ: Devicon v2.17.0, ghim phiên bản qua jsDelivr
     - Selector JS phụ thuộc:
   + .marquee-track, .marquee-mask, .marquee-track-reverse (style.css + script.js
     duplicate các item để loop liền mạch)
============================================================ */}
<section className="tech-section bg-[#FFFBF5] py-14 border-b border-[#E7E5E4] relative overflow-hidden" id="capabilities">
  <div className="absolute inset-0 opacity-[0.35] pointer-events-none" aria-hidden="true" style={{backgroundImage: 'radial-gradient(circle, #E7E5E4 1px, transparent 1px)', backgroundSize: '22px 22px'}}>
  </div>
  <div className="absolute top-10 left-10 w-[250px] h-[250px] rounded-full bg-gradient-to-br from-[#007BFF]/10 to-transparent blur-3xl pointer-events-none" aria-hidden="true" />
  <div className="absolute bottom-10 right-10 w-[300px] h-[300px] rounded-full bg-gradient-to-tl from-[#F59E0B]/10 to-transparent blur-3xl pointer-events-none" aria-hidden="true" />
  <div className="max-w-[1100px] mx-auto px-6 relative z-10">
    <header className="tech-section-header">
      <div className="tech-section-heading">
        <span className="tech-section-kicker"><i aria-hidden="true" />CAPABILITIES / 04</span>
        <h2 className="section-heading-title font-display font-black text-[#292524] tracking-tight animate-booted" data-anim="animate__zoomIn">
          Công nghệ <span>sử dụng.</span>
        </h2>
      </div>
    </header>
    {/* Marquee Row 1: Frontend & Backend (phải → trái) */}
    <div className="tech-row-heading">
      <div><span>01</span><strong>Frontend &amp; Backend</strong></div>
      <small>BUILD THE PRODUCT · HOVER TO PAUSE</small>
    </div>
    <div className="tech-marquee marquee-mask overflow-hidden mb-8" aria-label="Frontend và Backend">
      <div className="marquee-track gap-5 md:gap-6" style={{animationDuration: '22s'}}>
        <div className="tech-stack-item group flex flex-col items-center shrink-0 w-20" style={{'--tech-color': '#61dafb', '--tech-tint': '#effcff'}}>
          <div className="tech-icon-card">
            <img className="tech-icon-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/react/react-original.svg" width={34} height={34} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          </div>
          <span className="tech-icon-label">React</span>
        </div>
        <div className="tech-stack-item group flex flex-col items-center shrink-0 w-20" style={{'--tech-color': '#292524', '--tech-tint': '#f5f5f4'}}>
          <div className="tech-icon-card">
            <img className="tech-icon-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/nextjs/nextjs-original.svg" width={34} height={34} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          </div>
          <span className="tech-icon-label">Next.js</span>
        </div>
        <div className="tech-stack-item group flex flex-col items-center shrink-0 w-20" style={{'--tech-color': '#3178c6', '--tech-tint': '#eff7ff'}}>
          <div className="tech-icon-card">
            <img className="tech-icon-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/typescript/typescript-original.svg" width={34} height={34} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          </div>
          <span className="tech-icon-label">TypeScript</span>
        </div>
        <div className="tech-stack-item group flex flex-col items-center shrink-0 w-20" style={{'--tech-color': '#38bdf8', '--tech-tint': '#effbff'}}>
          <div className="tech-icon-card">
            <img className="tech-icon-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/tailwindcss/tailwindcss-original.svg" width={34} height={34} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          </div>
          <span className="tech-icon-label">Tailwind</span>
        </div>
        <div className="tech-stack-item group flex flex-col items-center shrink-0 w-20" style={{'--tech-color': '#e34f26', '--tech-tint': '#fff5f1'}}>
          <div className="tech-icon-card">
            <img className="tech-icon-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/html5/html5-original.svg" width={34} height={34} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          </div>
          <span className="tech-icon-label">HTML5</span>
        </div>
        <div className="tech-stack-item group flex flex-col items-center shrink-0 w-20" style={{'--tech-color': '#5fa04e', '--tech-tint': '#f2faef'}}>
          <div className="tech-icon-card">
            <img className="tech-icon-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/nodejs/nodejs-original.svg" width={34} height={34} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          </div>
          <span className="tech-icon-label">Node.js</span>
        </div>
        <div className="tech-stack-item group flex flex-col items-center shrink-0 w-20" style={{'--tech-color': '#292524', '--tech-tint': '#f5f5f4'}}>
          <div className="tech-icon-card">
            <img className="tech-icon-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/express/express-original.svg" width={34} height={34} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          </div>
          <span className="tech-icon-label">Express</span>
        </div>
        <div className="tech-stack-item group flex flex-col items-center shrink-0 w-20" style={{'--tech-color': '#cc292b', '--tech-tint': '#fff2f2'}}>
          <div className="tech-icon-card">
            <img className="tech-icon-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/microsoftsqlserver/microsoftsqlserver-original.svg" width={34} height={34} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          </div>
          <span className="tech-icon-label">SQL Server</span>
        </div>
      </div>
    </div>
    {/* Marquee Row 2: Database, languages & tools (trái → phải) */}
    <div className="tech-row-heading">
      <div><span>02</span><strong>Database &amp; Tools</strong></div>
      <small>SHIP &amp; MAINTAIN · HOVER TO PAUSE</small>
    </div>
    <div className="tech-marquee marquee-mask overflow-hidden" aria-label="Database, ngôn ngữ và công cụ">
      <div className="marquee-track marquee-track-reverse gap-5 md:gap-6" style={{animationDuration: '22s'}}>
        <div className="tech-stack-item group flex flex-col items-center shrink-0 w-20" style={{'--tech-color': '#336791', '--tech-tint': '#f0f7fb'}}>
          <div className="tech-icon-card">
            <img className="tech-icon-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/postgresql/postgresql-original.svg" width={34} height={34} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          </div>
          <span className="tech-icon-label">PostgreSQL</span>
        </div>
        <div className="tech-stack-item group flex flex-col items-center shrink-0 w-20" style={{'--tech-color': '#68217a', '--tech-tint': '#faf1fc'}}>
          <div className="tech-icon-card">
            <img className="tech-icon-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/csharp/csharp-original.svg" width={34} height={34} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          </div>
          <span className="tech-icon-label">C#</span>
        </div>
        <div className="tech-stack-item group flex flex-col items-center shrink-0 w-20" style={{'--tech-color': '#777bb3', '--tech-tint': '#f4f4fb'}}>
          <div className="tech-icon-card">
            <img className="tech-icon-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/php/php-original.svg" width={34} height={34} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          </div>
          <span className="tech-icon-label">PHP</span>
        </div>
        <div className="tech-stack-item group flex flex-col items-center shrink-0 w-20" style={{'--tech-color': '#3776ab', '--tech-tint': '#eff7fc'}}>
          <div className="tech-icon-card">
            <img className="tech-icon-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/python/python-original.svg" width={34} height={34} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          </div>
          <span className="tech-icon-label">Python</span>
        </div>
        <div className="tech-stack-item group flex flex-col items-center shrink-0 w-20" style={{'--tech-color': '#f05032', '--tech-tint': '#fff3ef'}}>
          <div className="tech-icon-card">
            <img className="tech-icon-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/git/git-original.svg" width={34} height={34} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          </div>
          <span className="tech-icon-label">Git</span>
        </div>
        <div className="tech-stack-item group flex flex-col items-center shrink-0 w-20" style={{'--tech-color': '#a259ff', '--tech-tint': '#f8f2ff'}}>
          <div className="tech-icon-card">
            <img className="tech-icon-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/figma/figma-original.svg" width={34} height={34} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          </div>
          <span className="tech-icon-label">Figma</span>
        </div>
        <div className="tech-stack-item group flex flex-col items-center shrink-0 w-20" style={{'--tech-color': '#292524', '--tech-tint': '#f5f5f4'}}>
          <div className="tech-icon-card">
            <img className="tech-icon-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/linux/linux-original.svg" width={34} height={34} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          </div>
          <span className="tech-icon-label">Linux</span>
        </div>
        <div className="tech-stack-item group flex flex-col items-center shrink-0 w-20" style={{'--tech-color': '#f37036', '--tech-tint': '#fff4ef'}}>
          <div className="tech-icon-card">
            <img className="tech-icon-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/postman/postman-original.svg" width={34} height={34} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          </div>
          <span className="tech-icon-label">Postman</span>
        </div>
      </div>
    </div>
  </div>
</section>
    </>
  );
}
