import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageToggle.css';

const LanguageToggle = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || i18n.language || 'es').startsWith('en') ? 'en' : 'es';

  const selectLanguage = (lang) => {
    if (lang !== currentLang) {
      i18n.changeLanguage(lang);
    }
  };

  return (
    <div className={`lang-toggle-hud ${className}`} role="group" aria-label="Selector de idioma / Language selector">
      <span className="lang-hud-icon" aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      </span>
      <button
        type="button"
        className={`lang-btn ${currentLang === 'es' ? 'active' : ''}`}
        onClick={() => selectLanguage('es')}
        aria-pressed={currentLang === 'es'}
        title="Cambiar a Español"
      >
        ES
      </button>
      <span className="lang-hud-sep" aria-hidden="true">/</span>
      <button
        type="button"
        className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}
        onClick={() => selectLanguage('en')}
        aria-pressed={currentLang === 'en'}
        title="Switch to English"
      >
        EN
      </button>
    </div>
  );
};

export default LanguageToggle;
