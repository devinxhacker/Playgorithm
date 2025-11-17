import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { GiSwordman } from "react-icons/gi";
import "./GridArena.css";

const GridArena = () => {
  const navigate = useNavigate();
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const applyCustomStyles = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        const style = iframeDoc.createElement('style');
        style.textContent = `
          #share,
          .credits,
          .games,
          #language,
          #tweet,
          .fb-like,
          .social,
          #labelFooter,
          a[href*="codepip"],
          a[href*="twitter"],
          a[href*="youtube"],
          a[href*="github"],
          a[href*="flexbox-froggy"],
          a[href*="anchoreum"] {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            overflow: hidden !important;
          }
          
          body {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%) !important;
            font-family: 'Rajdhani', 'PT Sans', sans-serif !important;
          }
          
          #sidebar {
            background: rgba(255, 255, 255, 0.05) !important;
            backdrop-filter: blur(20px) !important;
          }
          
          .title {
            color: #4ade80 !important;
            text-shadow: 0 0 15px rgba(74, 222, 128, 0.5) !important;
          }
          
          #board {
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 0 3px rgba(74, 222, 128, 0.3) !important;
          }
        `;
        iframeDoc.head.appendChild(style);
      } catch (error) {
        console.log('Iframe styling applied');
      }
    };

    iframe.addEventListener('load', applyCustomStyles);
    
    return () => {
      iframe.removeEventListener('load', applyCustomStyles);
    };
  }, []);

  return (
    <div className="grid-arena-container">
      <div className="grid-arena-header">
        <button 
          onClick={() => navigate("/dashboard")} 
          className="back-button-grid cursor-target"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
        <div className="grid-arena-title">
          <GiSwordman className="grid-arena-icon" />
          <h1>Grid Arena</h1>
        </div>
      </div>
      
      <iframe
        ref={iframeRef}
        src="/gridgarden/index.html"
        className="grid-arena-iframe"
        title="Grid Garden Game"
      />
    </div>
  );
};

export default GridArena;
