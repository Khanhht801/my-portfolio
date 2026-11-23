import { useLayoutEffect } from 'react';
import { initApp } from '../script.js';
import Navbar from './sections/Navbar.jsx';
import Hero from './sections/Hero.jsx';
import Work from './sections/Work.jsx';
import About from './sections/About.jsx';
import Experience from './sections/Experience.jsx';
import Capabilities from './sections/Capabilities.jsx';
import Testimonials from './sections/Testimonials.jsx';
import Contact from './sections/Contact.jsx';
import Footer from './sections/Footer.jsx';

export default function App() {
  useLayoutEffect(() => { initApp(); }, []);
  return (
    <>
      <div aria-hidden="true" id="scroll-progress" />
      <div data-section="01-navbar"><Navbar /></div>
      <main>
        <div data-section="02-hero"><Hero /></div>
        <div data-section="03-work"><Work /></div>
        <div data-section="04-about"><About /></div>
        <div data-section="05-experience"><Experience /></div>
        <div data-section="06-capabilities"><Capabilities /></div>
        <div data-section="09-testimonials"><Testimonials /></div>
        <div data-section="07-contact"><Contact /></div>
      </main>
      <div data-section="08-footer"><Footer /></div>
    </>
  );
}
