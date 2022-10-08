import React from 'react';
import { TouchableOpacity } from 'react-native';
import Image from '../Image';
import SpainFlag from '../../../assets/spain.png';
import UnitedKingdom from '../../../assets/united-kingdom.png';
import { useLanguageStore } from '../../libs/store';

const languageFlags = {
    'es': SpainFlag,
    'eng': UnitedKingdom
};

const LanguageSelector = () => {
    const language = useLanguageStore(({ language }) => language);
    const setLanguage = useLanguageStore(({ setLanguage }) => setLanguage);
    return (
        <TouchableOpacity onPress={setLanguage}>
            <Image source={languageFlags[language]} size={30} />
        </TouchableOpacity>
    )
};

export default LanguageSelector;
