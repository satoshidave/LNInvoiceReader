import React from 'react';
import { string } from 'prop-types';
import { Text as RNText } from 'react-native';
import { get, upperFirst } from 'lodash';
import i18n from '../../utils/i18n';
import { componentStyles } from '../../utils/misc';
import { WHITE } from '../../variables/colors';

const buttonStyles = styles => componentStyles(styles);

const Text = ({ text, color, fontWeight, marginRight, autoCapitalize, ...props }) => (
    <RNText
        style={buttonStyles({
            color,
            fontWeight,
            marginRight
        })}
        { ...props }
    >
        { autoCapitalize ? upperFirst(text) : text }
    </RNText>
);

Text.propTypes = {
    text: string,
    color: string
};

Text.defaultProps = {
    text: get(i18n, 'es.text'),
    color: WHITE
};

export default Text;
