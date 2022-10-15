import create from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';

const useLanguageStore = create(persist(set => ({
    language: 'es',
    setLanguage: () => set(({ language }) => ({ language: language === 'es' ? 'eng' : 'es' }))
}),
{
    name: 'storage',
    getStorage: () => AsyncStorage
}));

export {
    useLanguageStore
};
