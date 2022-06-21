import React from 'react';
import { string, func, number } from 'prop-types';
import { get } from 'lodash';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Container } from '../Containers';
import Text from '../Text';
import i18n from '../../utils/i18n';
import { GREEN, WHITE } from '../../variables/colors';

const Button = ({
    title,
    onPress,
    color,
    backgroundColor,
    fontWeight,
    margin,
    paddingHorizontal,
    paddingVertical,
    borderRadius
}) => (
    <TouchableOpacity onPress={onPress}>
        <Container
            backgroundColor={backgroundColor}
            flexDirection='column'
            flex={0}
            paddingHorizontal={paddingHorizontal}
            paddingVertical={paddingVertical}
            borderRadius={borderRadius}
            margin={margin}
        >
            <Text color={color} text={title} fontWeight={fontWeight} autoCapitalize />
        </Container>
    </TouchableOpacity>
);

Button.propTypes = {
    title: string,
    onPress: func,
    color: string,
    backgroundColor: string,
    fontWeight: string,
    margin: number,
    paddingHorizontal: number,
    paddingVertical: number,
    borderRadius: number
};

Button.defaultProps = {
    title: get(i18n, 'es.button'),
    onPress: () => {},
    color: WHITE,
    backgroundColor: GREEN,
    fontWeight: 'normal',
    margin: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5
}

export default Button;
