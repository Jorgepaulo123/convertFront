import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Tools from './pages/Tools';
import MediaTools from './pages/MediaTools';
import Features from './pages/Features';
import About from './pages/About';
import Contact from './pages/Contact';

// CSS
import './index.css';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-primary-light dark:text-primary-dark">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/media" element={<MediaTools />} />
            <Route path="/features" element={<Features />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}