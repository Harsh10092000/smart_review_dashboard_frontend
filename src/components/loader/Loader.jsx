const Loader = () => {
  return (
    <>
      <div className="modal-backdrop">
        <div className="modern-modal">
          {/* Enhanced Icon with multiple elements */}
          <div className="modal-icon">
            <div className="loading-container">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-core">
                <div className="pulse-dot"></div>
              </div>
            </div>
          </div>
          <div className="modal-content">
            <h2 className="modal-title">Please Wait</h2>
            <div className="modal-subtext">Checking session status...</div>
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 100%);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(1.1); }
          to { opacity: 1; transform: scale(1); }
        }
        .modern-modal {
          background: linear-gradient(145deg, #ffffff 0%, #f8faff 50%, #eaf1fa 100%);
          border-radius: 28px;
          box-shadow: 
            0 20px 60px rgba(31,38,135,0.25),
            0 8px 32px rgba(31,38,135,0.12),
            inset 0 1px 0 rgba(255,255,255,0.8);
          min-width: 380px;
          max-width: 450px;
          width: 100%;
          padding: 3rem 3rem 2.5rem 3rem;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: modalPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          border: 1px solid rgba(255,255,255,0.3);
        }
        @keyframes modalPop {
          0% { transform: scale(0.8) rotate(-2deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .modal-icon {
          margin-bottom: 1.2rem;
          margin-top: -0.8rem;
        }
        .loading-container {
          position: relative;
          width: 80px;
          height: 80px;
        }
        .spinner-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 3px solid transparent;
          border-top: 3px solid #0a3d2c;
          animation: spin 1.5s linear infinite;
        }
        .spinner-ring:nth-child(1) {
          animation-delay: 0s;
          border-top-color: #0a3d2c;
        }
        .spinner-ring:nth-child(2) {
          animation-delay: 0.2s;
          border-top-color: #1dbf73;
          transform: scale(0.8);
        }
        .spinner-ring:nth-child(3) {
          animation-delay: 0.4s;
          border-top-color: #ec161e;
          transform: scale(0.6);
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinner-core {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #0a3d2c, #1dbf73);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(10, 61, 44, 0.3);
        }
        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #ffffff;
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }
        .modal-title {
          font-size: 18px;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 0.8rem;
          text-align: center;
          background: linear-gradient(135deg, #0a3d2c, #1dbf73);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 0.5px;
        }
        .modal-subtext {
          color: #666;
          font-size: 14px;
          margin-bottom: 1.5rem;
          text-align: center;
          font-weight: 500;
        }
        .loading-dots {
          display: flex;
          gap: 8px;
          justify-content: center;
        }
        .loading-dots span {
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #0a3d2c, #1dbf73);
          border-radius: 50%;
          animation: dots 1.4s ease-in-out infinite both;
        }
        .loading-dots span:nth-child(1) {
          animation-delay: -0.32s;
        }
        .loading-dots span:nth-child(2) {
          animation-delay: -0.16s;
        }
        .loading-dots span:nth-child(3) {
          animation-delay: 0s;
        }
        @keyframes dots {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default Loader;
