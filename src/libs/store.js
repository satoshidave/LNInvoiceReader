import create from 'zustand';

const useLanguageStore = create(set => ({
    language: 'es',
    setLanguage: () => set(({ language }) => ({ language: language === 'es' ? 'eng' : 'es' }))
}));

export {
    useLanguageStore
};
