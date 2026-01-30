import React, { useState, useEffect } from 'react';
import AnalysisCharts from './components/AnalysisCharts';
import AlphaSpreadDisplay from './components/AlphaSpreadDisplay';
import NewsFeed from './components/NewsFeed';
import SignalCard from './components/SignalCard';
import { fetchAndAnalyzeTicker } from './services/analysisService';
import { CompanyAnalysisResult, AnalysisStatus } from './types';
import { AlertCircle, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [data, setData] = useState<CompanyAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressMsg, setProgressMsg] = useState<string>("Initializing...");

  const handleSearch = async (ticker: string) => {
    // Hide static elements
    const staticHero = document.getElementById('static-hero');
    const staticSearch = document.getElementById('static-search');
    if (staticHero) staticHero.style.display = 'none';
    if (staticSearch) staticSearch.style.display = 'none';

    // Scroll to just after the header (header is 5rem = 80px)
    window.scrollTo({ top: 80, behavior: 'smooth' });

    setStatus(AnalysisStatus.SEARCHING);
    setError(null);
    setData(null);
    setProgressMsg("Connecting to Live Data Streams...");

    try {
      const result = await fetchAndAnalyzeTicker(ticker, (msg) => {
        setProgressMsg(msg);
      });
      
      setData(result);
      setStatus(AnalysisStatus.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(AnalysisStatus.IDLE);
    setData(null);
    setError(null);
    
    // Show static elements again
    const staticHero = document.getElementById('static-hero');
    const staticSearch = document.getElementById('static-search');
    if (staticHero) staticHero.style.display = 'block';
    if (staticSearch) staticSearch.style.display = 'block';
    
    // Clear input
    const input = document.getElementById('ticker-input') as HTMLInputElement;
    if (input) input.value = '';
  };

  // Attach event listeners to static HTML elements
  useEffect(() => {
    const form = document.getElementById('search-form');
    const input = document.getElementById('ticker-input') as HTMLInputElement;
    const tickerBtns = document.querySelectorAll('.ticker-btn');

    const handleFormSubmit = (e: Event) => {
      e.preventDefault();
      if (input && input.value.trim()) {
        handleSearch(input.value.trim().toUpperCase());
      }
    };

    const handleTickerClick = (e: Event) => {
      const btn = e.currentTarget as HTMLButtonElement;
      const ticker = btn.dataset.ticker;
      if (ticker) {
        if (input) input.value = ticker;
        handleSearch(ticker);
      }
    };

    const handleInputChange = () => {
      if (input) {
        input.value = input.value.toUpperCase();
      }
    };

    if (form) {
      form.addEventListener('submit', handleFormSubmit);
    }

    if (input) {
      input.addEventListener('input', handleInputChange);
    }

    tickerBtns.forEach(btn => {
      btn.addEventListener('click', handleTickerClick);
    });

    return () => {
      if (form) {
        form.removeEventListener('submit', handleFormSubmit);
      }
      if (input) {
        input.removeEventListener('input', handleInputChange);
      }
      tickerBtns.forEach(btn => {
        btn.removeEventListener('click', handleTickerClick);
      });
    };
  }, []);

  // Don't render anything in idle state - static HTML handles it
  if (status === AnalysisStatus.IDLE) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Loading State */}
      {(status === AnalysisStatus.SEARCHING || status === AnalysisStatus.ANALYZING) && (
        <div className="w-full max-w-[1400px] mx-auto pt-2 pb-10 animate-in fade-in duration-700">
           
           {/* Main Flex Row: Left Ad | Center Content | Right Ad */}
           <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 lg:gap-12">
              
              {/* Left Area: Skyscraper - "The Look of Love" */}
              <div className="hidden md:flex shrink-0 flex-col">
                <a 
                  href="https://goodmansjewelers.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                <div style={{ 
                  width: '160px', 
                  minHeight: '700px', 
                  height: '100%',
                  backgroundColor: '#fff',
                  borderRadius: '15px',
                  boxShadow: '0px 0px 25px 3px rgba(104, 155, 228, 1)',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  padding: '20px 10px',
                  cursor: 'pointer'
                }}>
                  
                  {/* Title - The Look of Love */}
                  <div style={{ 
                    fontFamily: 'GentiumBookW, Georgia, serif', 
                    color: '#3A2E20', 
                    textAlign: 'center',
                    marginBottom: '15px',
                    lineHeight: '1.3'
                  }}>
                    <div style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '0.06em' }}>The Look</div>
                    <div style={{ fontSize: '17px', fontWeight: 700, fontStyle: 'italic', letterSpacing: '0.04em' }}>of Love</div>
                  </div>
                  
                  {/* Image 1 */}
                  <div style={{
                    width: '125px',
                    height: '125px',
                    marginTop: '12px',
                    marginBottom: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img 
                      src="https://meteor.stullercloud.com/das/144069642" 
                      alt="Jewelry" 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                    />
                  </div>

                  {/* Image 2 */}
                  <div style={{
                    width: '130px',
                    height: '100px',
                    marginBottom: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img 
                      src="https://meteor.stullercloud.com/das/45885258" 
                      alt="Jewelry" 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                    />
                  </div>

                  {/* Image 3 */}
                  <div style={{
                    width: '130px',
                    height: '100px',
                    marginBottom: '0px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img 
                      src="https://meteor.stullercloud.com/das/110723517" 
                      alt="Jewelry" 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                    />
                  </div>
                  
                  {/* Image 4 */}
                  <div style={{
                    width: '130px',
                    height: '100px',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img 
                      src="https://meteor.stullercloud.com/das/141877792" 
                      alt="Jewelry" 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                    />
                  </div>

                  {/* Image 5 */}
                  <div style={{
                    width: '130px',
                    height: '100px',
                    marginBottom: '-6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img 
                      src="https://meteor.stullercloud.com/das/14956727" 
                      alt="Jewelry" 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                    />
                  </div>

                  {/* Image 6 */}
                  <div style={{
                    width: '130px',
                    height: '100px',
                    marginBottom: '0px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img 
                      src="https://meteor.stullercloud.com/das/130681063" 
                      alt="Jewelry" 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                    />
                  </div>

                </div>
                </a>
              </div>
              {/* Center Area: Header + Square Ad - Fixed width to prevent shifting */}
              <div className="flex flex-col items-center w-[500px] shrink-0">
                 
                 {/* Status Text - Fixed height container to prevent shifting */}
                 <div className="text-center mb-8 w-full" style={{ minHeight: '90px' }}>
                    <h2 className="text-3xl font-serif font-bold text-slate-900 mb-3 flex items-center justify-center gap-3">
                       <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                       Synthesizing Intelligence
                    </h2>
                    <div className="inline-block px-4 py-1 bg-white/60 backdrop-blur rounded-full border border-slate-200 min-w-[320px]">
                      <p className="text-xs text-slate-600 font-bold uppercase tracking-widest animate-pulse">
                        {progressMsg}
                      </p>
                    </div>
                 </div>

                 {/* Square Ad Box - Goodman's Jewelers Main Ad - Engraved Style */}
                 <a 
                   href="https://goodmansjewelers.com" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   style={{ textDecoration: 'none', color: 'inherit' }}
                 >
                 <div style={{ 
                   border: '3px solid #5C4A3A', 
                   marginTop: '4px', 
                   marginBottom: '4px', 
                   boxSizing: 'border-box', 
                   width: '400px', 
                   height: '400px', 
                   background: 'linear-gradient(145deg, #F8F5F0 0%, #EDE8E0 50%, #F5F2ED 100%)',
                   boxShadow: 'inset 0 0 80px rgba(60,45,30,0.06), 0 4px 24px rgba(60,45,30,0.2)',
                   cursor: 'pointer'
                 }}>
                    <div style={{ 
                      border: '1px solid #A89070', 
                      margin: '4px', 
                      height: 'calc(100% - 8px)', 
                      boxSizing: 'border-box',
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)'
                    }}>
                       <div style={{ 
                         border: '1px solid #C8B898', 
                         margin: '3px', 
                         height: 'calc(100% - 6px)', 
                         boxSizing: 'border-box', 
                         display: 'flex', 
                         flexDirection: 'column', 
                         alignItems: 'center', 
                         justifyContent: 'flex-start', 
                         padding: '16px 20px 12px 20px', 
                         textAlign: 'center',
                         position: 'relative',
                         overflow: 'hidden'
                       }}>
                          {/* Title - Goodman's Jewelers in small caps on one line */}
                          <div style={{ 
                            fontFamily: 'GentiumBookW, Georgia, serif', 
                            color: '#3A2E20', 
                            marginBottom: '8px', 
                            letterSpacing: '0.18em',
                            textShadow: '1px 1px 0px rgba(255,255,255,0.9), -0.5px -0.5px 0px rgba(0,0,0,0.1)'
                          }}>
                            <span style={{ fontSize: '30px', fontWeight: 'bold' }}>G</span>
                            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>OODMAN'S</span>
                            <span style={{ fontSize: '18px', fontWeight: 'bold' }}> </span>
                            <span style={{ fontSize: '30px', fontWeight: 'bold' }}>J</span>
                            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>EWELERS</span>
                          </div>
                          
                          {/* Pearl Necklace surrounding product list and French phrase - LARGER */}
                          <svg style={{ width: '340px', height: '160px', marginTop: '0px' }} viewBox="0 0 340 160">
                            <defs>
                              {/* Engraved line effect */}
                              <filter id="engrave" x="-20%" y="-20%" width="140%" height="140%">
                                <feOffset dx="0.5" dy="0.5" in="SourceAlpha" result="shadowOut"/>
                                <feGaussianBlur in="shadowOut" stdDeviation="0.3" result="shadowBlur"/>
                                <feFlood floodColor="#ffffff" floodOpacity="0.8" result="shadowColor"/>
                                <feComposite in="shadowColor" in2="shadowBlur" operator="in" result="shadow"/>
                                <feOffset dx="-0.3" dy="-0.3" in="SourceAlpha" result="highlightOut"/>
                                <feGaussianBlur in="highlightOut" stdDeviation="0.2" result="highlightBlur"/>
                                <feFlood floodColor="#000000" floodOpacity="0.15" result="highlightColor"/>
                                <feComposite in="highlightColor" in2="highlightBlur" operator="in" result="highlight"/>
                                <feMerge>
                                  <feMergeNode in="shadow"/>
                                  <feMergeNode in="highlight"/>
                                  <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                              </filter>
                              {/* Pearl gradient - high society oriental pearl with rose overtones */}
                              <radialGradient id="pearlGrad" cx="30%" cy="30%" r="65%">
                                <stop offset="0%" stopColor="#FFFFFF"/>
                                <stop offset="15%" stopColor="#FFF9F5"/>
                                <stop offset="35%" stopColor="#FDF5F0"/>
                                <stop offset="55%" stopColor="#F8EDE5"/>
                                <stop offset="75%" stopColor="#EFE4DA"/>
                                <stop offset="90%" stopColor="#E5D8CC"/>
                                <stop offset="100%" stopColor="#D8C8B8"/>
                              </radialGradient>
                              {/* Diamond gradient */}
                              <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFFFFF"/>
                                <stop offset="25%" stopColor="#E8E8F0"/>
                                <stop offset="50%" stopColor="#D0D0E0"/>
                                <stop offset="75%" stopColor="#E8E8F0"/>
                                <stop offset="100%" stopColor="#FFFFFF"/>
                              </linearGradient>
                            </defs>
                            
                            {/* Pearl necklace - ellipse, pearls touching (distance = r1+r2) */}
                            <g filter="url(#engrave)">
                              {/* String between clasp and first pearls */}
                              <line x1="157" y1="9" x2="153.5" y2="9" stroke="#C8B898" strokeWidth="0.8"/>
                              <line x1="183" y1="9" x2="186.5" y2="9" stroke="#C8B898" strokeWidth="0.8"/>
                              
                              {/* LEFT SIDE - pearls touching, flat top curving to sides */}
                              <circle cx="150.5" cy="9" r="3.2" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="144" cy="9.15" r="3.3" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="137.3" cy="9.4" r="3.4" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="130.4" cy="9.8" r="3.5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="123.3" cy="10.3" r="3.6" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="116" cy="11" r="3.7" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="108.5" cy="11.9" r="3.8" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="100.8" cy="13.1" r="3.9" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="93" cy="14.6" r="4.0" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="85" cy="16.5" r="4.1" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="76.8" cy="18.8" r="4.2" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="68.5" cy="21.6" r="4.3" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="60.2" cy="25" r="4.4" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="52" cy="29" r="4.5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="44" cy="33.8" r="4.6" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="36.3" cy="39.5" r="4.7" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="29" cy="46" r="4.8" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="22.5" cy="53.5" r="4.9" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="17" cy="62" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="12.5" cy="71.5" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="10" cy="81.5" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="10" cy="91.5" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="12.5" cy="101.5" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="17" cy="111" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="23.5" cy="119.5" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="32" cy="127" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="42" cy="133" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="52.5" cy="137.5" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="64" cy="140.5" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="74" cy="142" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="84" cy="143.2" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="94" cy="144" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="104" cy="144.6" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="114" cy="144.9" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="124" cy="145" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="134" cy="145" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="144" cy="145" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="154" cy="145" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="164" cy="145" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="176" cy="145" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="186" cy="145" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="196" cy="145" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="206" cy="145" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="216" cy="145" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="226" cy="144.9" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="236" cy="144.6" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="246" cy="144" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="256" cy="143.2" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="266" cy="142" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="276" cy="140.5" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="287.5" cy="137.5" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="298" cy="133" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="308" cy="127" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="316.5" cy="119.5" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="323" cy="111" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="327.5" cy="101.5" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="330" cy="91.5" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="330" cy="81.5" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="327.5" cy="71.5" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="323" cy="62" r="5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="317.5" cy="53.5" r="4.9" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="311" cy="46" r="4.8" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="303.7" cy="39.5" r="4.7" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="296" cy="33.8" r="4.6" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="288" cy="29" r="4.5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="279.8" cy="25" r="4.4" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="271.5" cy="21.6" r="4.3" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="263.2" cy="18.8" r="4.2" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="255" cy="16.5" r="4.1" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="247" cy="14.6" r="4.0" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="239.2" cy="13.1" r="3.9" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="231.5" cy="11.9" r="3.8" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="224" cy="11" r="3.7" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="216.7" cy="10.3" r="3.6" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="209.6" cy="9.8" r="3.5" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="202.7" cy="9.4" r="3.4" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="196" cy="9.15" r="3.3" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              <circle cx="189.5" cy="9" r="3.2" fill="url(#pearlGrad)" stroke="#B0A090" strokeWidth="0.3"/>
                              
                              {/* Thin Ornate Diamond Clasp at top center */}
                              <g transform="translate(170, 9)">
                                {/* Main thin marquise diamond */}
                                <path d="M-13,0 Q-8,-3 0,-4 Q8,-3 13,0 Q8,3 0,4 Q-8,3 -13,0 Z" fill="url(#diamondGrad)" stroke="#8080A0" strokeWidth="0.5"/>
                                
                                {/* Inner facet lines - horizontal */}
                                <line x1="-11" y1="0" x2="11" y2="0" stroke="#B0B0D0" strokeWidth="0.35"/>
                                
                                {/* Inner facet lines - vertical */}
                                <line x1="0" y1="-3.5" x2="0" y2="3.5" stroke="#B0B0D0" strokeWidth="0.3"/>
                                
                                {/* Diagonal facets */}
                                <line x1="-9" y1="-2" x2="9" y2="2" stroke="#C0C0E0" strokeWidth="0.25"/>
                                <line x1="-9" y1="2" x2="9" y2="-2" stroke="#C0C0E0" strokeWidth="0.25"/>
                                <line x1="-6" y1="-2.8" x2="6" y2="2.8" stroke="#D0D0F0" strokeWidth="0.2"/>
                                <line x1="-6" y1="2.8" x2="6" y2="-2.8" stroke="#D0D0F0" strokeWidth="0.2"/>
                                
                                {/* Step cut facet outlines */}
                                <path d="M-9,0 Q-5,-2.2 0,-3 Q5,-2.2 9,0 Q5,2.2 0,3 Q-5,2.2 -9,0 Z" fill="none" stroke="#A0A0C0" strokeWidth="0.25"/>
                                <path d="M-5,0 Q-3,-1.3 0,-1.8 Q3,-1.3 5,0 Q3,1.3 0,1.8 Q-3,1.3 -5,0 Z" fill="none" stroke="#B0B0D0" strokeWidth="0.2"/>
                                
                                {/* Bright highlight spots */}
                                <circle cx="-4" cy="-1" r="0.9" fill="#FFFFFF" opacity="0.9"/>
                                <circle cx="2" cy="-0.5" r="0.6" fill="#FFFFFF" opacity="0.7"/>
                                <circle cx="-1" cy="1.2" r="0.5" fill="#FFFFFF" opacity="0.5"/>
                                <circle cx="5" cy="0.5" r="0.4" fill="#FFFFFF" opacity="0.4"/>
                                
                                {/* Sparkle rays */}
                                <line x1="-4" y1="-1" x2="-6" y2="-2" stroke="#FFFFFF" strokeWidth="0.25" opacity="0.8"/>
                                <line x1="-4" y1="-1" x2="-3" y2="-2.5" stroke="#FFFFFF" strokeWidth="0.25" opacity="0.8"/>
                                <line x1="2" y1="-0.5" x2="4" y2="-2" stroke="#FFFFFF" strokeWidth="0.2" opacity="0.6"/>
                                
                                {/* Tiny point accents at tapered ends */}
                                <circle cx="-12.5" cy="0" r="0.8" fill="url(#diamondGrad)" stroke="#9090B0" strokeWidth="0.2"/>
                                <circle cx="12.5" cy="0" r="0.8" fill="url(#diamondGrad)" stroke="#9090B0" strokeWidth="0.2"/>
                              </g>
                            </g>
                          </svg>
                          
                          {/* ALL text inside pearl area */}
                          <div style={{ 
                            marginTop: '-120px',
                            fontFamily: 'GentiumBookW, Georgia, serif', 
                            color: '#3A2E20', 
                            lineHeight: '1.75', 
                            letterSpacing: '0.12em',
                            textShadow: '0.8px 0.8px 0px rgba(255,255,255,0.95), -0.4px -0.4px 0px rgba(0,0,0,0.08)'
                          }}>
                            <div>
                              <span style={{ fontSize: '11px' }}>N</span><span style={{ fontSize: '8px' }}>ECKLACES</span>
                              <span style={{ fontSize: '11px', color: '#9A8A70' }}> & </span>
                              <span style={{ fontSize: '11px' }}>P</span><span style={{ fontSize: '8px' }}>ENDANTS</span>
                            </div>
                            <div>
                              <span style={{ fontSize: '11px' }}>B</span><span style={{ fontSize: '8px' }}>RACELETS</span>
                              <span style={{ fontSize: '10px', color: '#9A8A70' }}> ✦ </span>
                              <span style={{ fontSize: '11px' }}>W</span><span style={{ fontSize: '8px' }}>ATCHES</span>
                              <span style={{ fontSize: '10px', color: '#9A8A70' }}> ✦ </span>
                              <span style={{ fontSize: '11px' }}>E</span><span style={{ fontSize: '8px' }}>ARRINGS</span>
                            </div>
                            <div>
                              <span style={{ fontSize: '11px' }}>E</span><span style={{ fontSize: '8px' }}>NGAGEMENT </span>
                              <span style={{ fontSize: '11px' }}>R</span><span style={{ fontSize: '8px' }}>INGS</span>
                            </div>
                            {/* French phrase in italics - INSIDE the pearl frame */}
                            <div style={{ 
                              fontFamily: 'GentiumBookW, Georgia, serif', 
                              fontSize: '11px', 
                              fontStyle: 'italic', 
                              color: '#5A4A38', 
                              marginTop: '3px',
                              letterSpacing: '0.04em'
                            }}>Je désir vous Cervir</div>
                          </div>
                          
                          {/* Text above the necklace chain */}
                          <div style={{ 
                            fontFamily: 'GentiumBookW, Georgia, serif', 
                            color: '#3A2E20', 
                            textAlign: 'center',
                            marginTop: '32px',
                            textShadow: '0.7px 0.7px 0px rgba(255,255,255,0.95), -0.3px -0.3px 0px rgba(0,0,0,0.07)'
                          }}>
                            <div style={{ fontSize: '12px', letterSpacing: '0.08em', marginBottom: '6px' }}>Everlasting Expressions of Love</div>
                            <div style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#4A3A28' }}>
                              Treasured Forever
                            </div>
                          </div>
                          
                          {/* Emerald cut pendant with gold chain - deep U-shape like worn necklace */}
                          <svg style={{ width: '340px', height: '110px', marginTop: '-38px' }}
  viewBox="-40 -48 420 112">
                            <defs>
                              {/* Gold chain gradient */}
                              <linearGradient id="goldChain" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#D4A84B"/>
                                <stop offset="30%" stopColor="#F4D078"/>
                                <stop offset="50%" stopColor="#FFEFB0"/>
                                <stop offset="70%" stopColor="#F4D078"/>
                                <stop offset="100%" stopColor="#B8903A"/>
                              </linearGradient>
                              {/* Hatching pattern for engraved look */}
                              <pattern id="hatchDark" patternUnits="userSpaceOnUse" width="3" height="3" patternTransform="rotate(45)">
                                <line x1="0" y1="0" x2="0" y2="3" stroke="#4A4A50" strokeWidth="0.4"/>
                              </pattern>
                              <pattern id="hatchLight" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(-45)">
                                <line x1="0" y1="0" x2="0" y2="4" stroke="#8A8A90" strokeWidth="0.3"/>
                              </pattern>
                              <pattern id="hatchMedium" patternUnits="userSpaceOnUse" width="2.5" height="2.5" patternTransform="rotate(30)">
                                <line x1="0" y1="0" x2="0" y2="2.5" stroke="#6A6A70" strokeWidth="0.35"/>
                              </pattern>
                            </defs>
                            
                            {/* Gold chain - dramatic U-shape like worn around woman's neck */}
                            {/* Starts at y=0 at edges, dips down to y=28 in center where pendant hangs */}
                            <g filter="url(#engrave)">
                              <path d="M-40,-48 C50,6 110,18 170,24 C230,18 330,6 380,-48" stroke="url(#goldChain)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                            </g>
                            
                            {/* Vintage Engraved Emerald Cut Pendant - bail connects to chain */}
                            <g transform="translate(170, 22)" filter="url(#engrave)">
                              
                              {/* Decorative bail/top setting - connects to chain above */}
                              <g transform="translate(0, 0)">
                                {/* Main bail loop - overlaps with chain */}
                                <ellipse cx="0" cy="2" rx="4" ry="5" fill="none" stroke="#3A3A3A" strokeWidth="0.6"/>
                                <ellipse cx="0" cy="2" rx="2.5" ry="3.5" fill="#F8F8F8" stroke="#5A5A5A" strokeWidth="0.3"/>
                                
                                {/* Decorative scrollwork around bail */}
                                <path d="M-5,4 Q-8,7 -6,11 Q-4,13 -3,11" fill="none" stroke="#3A3A3A" strokeWidth="0.45"/>
                                <path d="M5,4 Q8,7 6,11 Q4,13 3,11" fill="none" stroke="#3A3A3A" strokeWidth="0.45"/>
                                <circle cx="-6" cy="9" r="1.2" fill="none" stroke="#4A4A4A" strokeWidth="0.3"/>
                                <circle cx="6" cy="9" r="1.2" fill="none" stroke="#4A4A4A" strokeWidth="0.3"/>
                                
                                {/* Small accent gems in setting */}
                                <circle cx="-4" cy="7" r="1" fill="#E8E8E8" stroke="#5A5A5A" strokeWidth="0.2"/>
                                <circle cx="4" cy="7" r="1" fill="#E8E8E8" stroke="#5A5A5A" strokeWidth="0.2"/>
                                <circle cx="0" cy="9" r="1.2" fill="#F0F0F0" stroke="#5A5A5A" strokeWidth="0.25"/>
                              </g>
                              
                              {/* Main emerald cut gem - narrow - vintage engraved style */}
                              <g transform="translate(0, 25)">
                                {/* Outer gem shape - narrower proportions */}
                                <polygon points="-12,-16 12,-16 15,-11 15,11 12,16 -12,16 -15,11 -15,-11" fill="#F5F5F8" stroke="#2A2A2A" strokeWidth="0.8"/>
                                
                                {/* Corner cuts detail */}
                                <line x1="-12" y1="-16" x2="-15" y2="-11" stroke="#3A3A3A" strokeWidth="0.45"/>
                                <line x1="12" y1="-16" x2="15" y2="-11" stroke="#3A3A3A" strokeWidth="0.45"/>
                                <line x1="15" y1="11" x2="12" y2="16" stroke="#3A3A3A" strokeWidth="0.45"/>
                                <line x1="-15" y1="11" x2="-12" y2="16" stroke="#3A3A3A" strokeWidth="0.45"/>
                                
                                {/* Step cut facets - concentric rectangles */}
                                <polygon points="-9,-13 9,-13 11,-9 11,9 9,13 -9,13 -11,9 -11,-9" fill="none" stroke="#4A4A4A" strokeWidth="0.4"/>
                                <polygon points="-6,-10 6,-10 8,-6 8,6 6,10 -6,10 -8,6 -8,-6" fill="none" stroke="#5A5A5A" strokeWidth="0.35"/>
                                <polygon points="-4,-7 4,-7 5,-4 5,4 4,7 -4,7 -5,4 -5,-4" fill="none" stroke="#6A6A6A" strokeWidth="0.3"/>
                                <polygon points="-2,-4 2,-4 2.5,-2.5 2.5,2.5 2,4 -2,4 -2.5,2.5 -2.5,-2.5" fill="none" stroke="#7A7A7A" strokeWidth="0.25"/>
                                
                                {/* Diagonal facet lines */}
                                <line x1="-12" y1="-16" x2="3" y2="3" stroke="#5A5A5A" strokeWidth="0.3"/>
                                <line x1="-9" y1="-16" x2="5" y2="5" stroke="#6A6A6A" strokeWidth="0.25"/>
                                <line x1="12" y1="-16" x2="-3" y2="3" stroke="#5A5A5A" strokeWidth="0.3"/>
                                <line x1="9" y1="-16" x2="-5" y2="5" stroke="#6A6A6A" strokeWidth="0.25"/>
                                
                                {/* Dark hatched area - left side shadow */}
                                <polygon points="-15,-11 -12,-16 -5,-16 -8,0 -15,5" fill="url(#hatchDark)" opacity="0.45"/>
                                
                                {/* Medium hatched area - bottom */}
                                <polygon points="-12,16 -5,5 5,5 12,16" fill="url(#hatchMedium)" opacity="0.3"/>
                                
                                {/* Light hatched area - right highlight zone */}
                                <polygon points="5,-16 12,-16 15,-11 15,0 5,0" fill="url(#hatchLight)" opacity="0.2"/>
                                
                                {/* Bright highlight areas */}
                                <polygon points="-4,-12 4,-12 6,-9 -2,-2" fill="#FFFFFF" opacity="0.4"/>
                                <polygon points="2,1 9,-6 11,-4 4,4" fill="#FFFFFF" opacity="0.2"/>
                                
                                {/* Strong diagonal reflection lines */}
                                <line x1="-9" y1="-5" x2="0" y2="7" stroke="#FFFFFF" strokeWidth="0.9" opacity="0.5"/>
                                <line x1="-6" y1="-9" x2="4" y2="4" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.4"/>
                                <line x1="1" y1="-12" x2="9" y2="-2" stroke="#FFFFFF" strokeWidth="0.45" opacity="0.3"/>
                                
                                {/* Table (center) reflection */}
                                <rect x="-1.5" y="-3" width="3" height="5" fill="#FFFFFF" opacity="0.12"/>
                              </g>
                            </g>
                          </svg>
                          
                          {/* Bottom text - Immortalizing Romance since 1933 in small caps */}
                          <div style={{ 
                            fontFamily: 'GentiumBookW, Georgia, serif', 
                            color: '#4A3C2A', 
                            letterSpacing: '0.1em',
                            marginTop: '6px',
                            textShadow: '0.6px 0.6px 0px rgba(255,255,255,0.9), -0.3px -0.3px 0px rgba(0,0,0,0.06)'
                          }}>
                            <span style={{ fontSize: '10px' }}>I</span><span style={{ fontSize: '7px' }}>MMORTALIZING </span>
                            <span style={{ fontSize: '10px' }}>R</span><span style={{ fontSize: '7px' }}>OMANCE </span>
                            <span style={{ fontSize: '7px' }}>SINCE </span>
                            <span style={{ fontSize: '10px' }}>1933</span>
                          </div>
                          
                          {/* Address */}
                          <div style={{ 
                            fontFamily: 'GentiumBookW, Georgia, serif', 
                            color: '#5A4A38', 
                            letterSpacing: '0.12em',
                            marginTop: '4px',
                            textShadow: '0.5px 0.5px 0px rgba(255,255,255,0.85), -0.2px -0.2px 0px rgba(0,0,0,0.05)'
                          }}>
                            <span style={{ fontSize: '9px' }}>220 S</span><span style={{ fontSize: '7px' }}>TATE </span>
                            <span style={{ fontSize: '9px' }}>S</span><span style={{ fontSize: '7px' }}>TREET </span>
                            <span style={{ fontSize: '8px', color: '#9A8A70' }}>✦</span>
                            <span style={{ fontSize: '7px' }}> </span>
                            <span style={{ fontSize: '9px' }}>M</span><span style={{ fontSize: '7px' }}>ADISON</span>
                          </div>
                       </div>
                    </div>
                 </div>
                 </a>
              </div>

              {/* Right Area: Skyscraper - "The Look of Love" */}
              <div className="hidden md:flex shrink-0 flex-col">
                <a 
                  href="https://goodmansjewelers.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                <div style={{ 
                  width: '160px', 
                  minHeight: '700px', 
                  height: '100%',
                  backgroundColor: '#fff',
                  borderRadius: '15px',
                  boxShadow: '0px 0px 25px 3px rgba(104, 155, 228, 1)',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  padding: '20px 10px',
                  cursor: 'pointer'
                }}>
                  
                  {/* Title - The Look of Love */}
                  <div style={{ 
                    fontFamily: 'GentiumBookW, Georgia, serif', 
                    color: '#3A2E20', 
                    textAlign: 'center',
                    marginBottom: '20px',
                    lineHeight: '1.3'
                  }}>
                    <div style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '0.06em' }}>The Look</div>
                    <div style={{ fontSize: '17px', fontWeight: 700, fontStyle: 'italic', letterSpacing: '0.04em' }}>of Love</div>
                  </div>
                  
                  {/* Image 1 - Yellow gold ring */}
                  <div style={{
                    width: '140px',
                    height: '115px',
                    marginBottom: '24px',
                    marginTop: '9px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img 
                      src="https://meteor.stullercloud.com/das/73325320?obj=metals&obj=stones/faceted/g_center&obj.colorRef=71&obj.curves=0,0.52,110.95,200.114,220.255,255&obj.curves.r=0,0.86,102.153,168.255,255&obj.curves.g=0,0.61,47.91,75.150,133.255,255&obj.curves.b=0,0.60,53.93,83.135,123.255,230&obj=metals&obj.recipe=yellow&$xlarge$" 
                      alt="Gold Ring" 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                    />
                  </div>
                  
                  {/* Image 2 */}
                  <div style={{
                    width: '140px',
                    height: '115px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img 
                      src="https://meteor.stullercloud.com/das/73660057?obj=stones/diamonds/g_Accent&obj=stones/faceted/g_Center&obj.curves=0,0.121,215.185,255.255,255&obj.curves.r=41,0.60,28.128,82.176,127.237,255.255,255&obj.curves.g=22,0.128,138.248,255.255,255&obj.curves.b=20,0.128,167.251,255.255,255&obj=metals&obj=metals&obj.recipe=yellow&$xlarge$" 
                      alt="Goodman's Jewelers" 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                    />
                  </div>

                  {/* Image 3 - Concourse Hotel */}
                  <div style={{
                    width: '140px',
                    height: '115px',
                    marginBottom: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img 
                      src="https://goodmansjewelers.com/wp-content/uploads/al_opt_content/IMAGE/goodmansjewelers.com/wp-content/uploads/2023/04/Concourse-Hotel-Image-1-jpg-e1685202917380.webp" 
                      alt="Goodman's Jewelers" 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                    />
                  </div>
                  
                  
                  {/* Image 4 - Yellow gold ring with gemstone */}
                  <div style={{
                    width: '140px',
                    height: '115px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img 
                      src="https://meteor.stullercloud.com/das/98813701?obj=metals&obj.recipe=yellow&obj=stones&obj.curves=0,3.56,28.216,201.255,255&obj.curves.r=0,26.198,244.255,255&obj.curves.g=29,0.192,135.243,226.255,255&obj.curves.b=31,0.78,22.196,213.255,255&$" 
                      alt="Gold Ring" 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                    />
                  </div>
                  
                  {/* Image 5 - Yellow gold ring with diamonds */}
                  <div style={{
                    width: '140px',
                    height: '115px',
                    marginBottom: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img 
                      src="https://meteor.stullercloud.com/das/126821436?obj=stones/diamonds/g_Accent%201&obj=stones/diamonds/g_Accent%202&obj=stones/diamonds/g_Center&obj=metals&obj.recipe=yellow&$" 
                      alt="Gold Diamond Ring" 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                    />
                  </div>
                </div>
                </a>
              </div>


           </div>
        </div>
      )}

      {/* Error State */}
      {status === AnalysisStatus.ERROR && (
        <div className="max-w-2xl mx-auto mt-10 bg-white border-l-4 border-rose-500 rounded-r-xl p-8 text-center shadow-2xl shadow-rose-200/50">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-rose-50 rounded-full">
              <AlertCircle className="h-10 w-10 text-rose-500" />
            </div>
          </div>
          <h3 className="text-xl font-bold font-serif text-slate-900 mb-2">Analysis Interrupted</h3>
          <p className="text-slate-600 font-light mb-6">{error}</p>
          <button 
            onClick={handleReset}
            className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Results */}
      {status === AnalysisStatus.COMPLETE && data && (
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
           
           {/* Result Header */}
           <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 px-6 py-8 bg-white/70 backdrop-blur-md rounded-3xl border border-white shadow-xl shadow-indigo-100/60">
              <div className="flex flex-col md:flex-row md:items-baseline gap-4">
                <h2 className="text-6xl font-bold text-slate-900 tracking-tighter font-serif">
                  {data.ticker} 
                </h2>
                <span className="text-indigo-900/60 text-2xl font-serif italic">
                  {data.companyName}
                </span>
              </div>
              <button 
                onClick={handleReset}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-600 hover:text-white hover:bg-indigo-600 hover:border-indigo-600 hover:shadow-lg rounded-xl font-semibold transition-all text-sm uppercase tracking-wider"
              >
                New Search
              </button>
           </div>
           
           {data.signal && <SignalCard signal={data.signal} />}

           <AlphaSpreadDisplay data={data} />

           <AnalysisCharts data={data} />
           
           <NewsFeed data={data} />
        </div>
      )}
    </div>
  );
};

export default App;
