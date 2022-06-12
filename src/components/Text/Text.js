import React from 'react';
import { string } from 'prop-types';
import { Text as RNText, StyleSheet } from 'react-native';
import { get, upperFirst } from 'lodash';
import i18n from '../../utils/i18n';

const buttonStyles = styles => StyleSheet.create(styles);

const Text = ({ text, color, fontWeight, autoCapitalize, ...props }) => (
    <RNText
        style={buttonStyles({
            color,
            fontWeight
        })}
        { ...props }
    >
        { autoCapitalize ? upperFirst(text) : text }
    </RNText>
);

Text.propTypes = {
    text: string
};

Text.defaultProps = {
    text: get(i18n, 'es.text')
};

export default Text;
