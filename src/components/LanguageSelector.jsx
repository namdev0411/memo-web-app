import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = ({ className = '' }) => {
    const { i18n, t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'en', name: t('language.english'), flag: '🇺🇸' },
        { code: 'vi', name: t('language.vietnamese'), flag: '🇻🇳' },
        { code: 'ja', name: t('language.japanese'), flag: '🇯🇵' }
    ];

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    const handleLanguageChange = (languageCode) => {
        i18n.changeLanguage(languageCode);
        localStorage.setItem('selectedLanguage', languageCode);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`}>
            {/* Desktop version */}
            <div className="hidden sm:block">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    aria-label={t('language.selectLanguage')}
                >
                    <span className="text-lg">{currentLanguage.flag}</span>
                    <span className="hidden md:inline">{currentLanguage.name}</span>
                    <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-[60]">
                        <div className="py-1">
                            {languages.map((language) => (
                                <button
                                    key={language.code}
                                    onClick={() => handleLanguageChange(language.code)}
                                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors duration-200 ${i18n.language === language.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                        }`}
                                >
                                    <span className="text-lg">{language.flag}</span>
                                    <span>{language.name}</span>
                                    {i18n.language === language.code && (
                                        <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile version */}
            <div className="sm:hidden">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-center w-10 h-10 text-lg bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    aria-label={t('language.selectLanguage')}
                >
                    {currentLanguage.flag}
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-[60]">
                        <div className="py-1">
                            {languages.map((language) => (
                                <button
                                    key={language.code}
                                    onClick={() => handleLanguageChange(language.code)}
                                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors duration-200 ${i18n.language === language.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                        }`}
                                >
                                    <span>{language.flag}</span>
                                    <span className="truncate">{language.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[55] sm:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default LanguageSelector;
