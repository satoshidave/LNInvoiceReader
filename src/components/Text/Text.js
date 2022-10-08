import React from 'react';
import { string, bool } from 'prop-types';
import { Text as RNText } from 'react-native';
import { get, upperFirst } from 'lodash';
import i18n from '../../utils/i18n';
import { componentStyles } from '../../utils/misc';
import { WHITE } from '../../variables/colors';
import { useLanguageStore } from '../../libs/store';

const buttonStyles = styles => componentStyles(styles);

const Text = ({ text, color, fontWeight, marginRight, autoCapitalize, withoutTranslation, ...props }) => {
    const language = useLanguageStore(({ language }) => language);
    const translatedText = withoutTranslation ? text : get(i18n, `${language}.${text}`, `${language}.text`);
    return (
        <RNText
            style={buttonStyles({
                color,
                fontWeight,
                marginRight
            })}
            { ...props }
        >
            { autoCapitalize ? upperFirst(translatedText) : translatedText }
        </RNText>
    );
}

Text.propTypes = {
    text: string,
    color: string,
    withoutTranslation: bool
};

Text.defaultProps = {
    text: 'text',
    color: WHITE,
    withoutTranslation: false
};

export default Text;
