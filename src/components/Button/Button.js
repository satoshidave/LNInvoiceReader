import React from 'react';
import { string, func } from 'prop-types';
import { get } from 'lodash';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Container } from '../Containers';
import Text from '../Text';
import i18n from '../../utils/i18n';
import { GREEN, WHITE } from '../../variables/colors';

const buttonStyles = ({ color, ...styles }) => StyleSheet.create({
    ...styles,
    backgroundColor: color
});

const Button = ({ title, onPress, color, backgroundColor, ...props }) => (
    <TouchableOpacity onPress={onPress}>
        <Container
            backgroundColor={backgroundColor}
            flexDirection='column'
            flex={0}
            padding={10}
            borderRadius={5}
        >
            <Text color={color} text={title} />
        </Container>
    </TouchableOpacity>
);

Button.propTypes = {
    title: string,
    onPress: func,
    color: string,
    backgroundColor: string
};

Button.defaultProps = {
    title: get(i18n, 'es.button'),
    onPress: () => {},
    color: WHITE,
    backgroundColor: GREEN
}

export default Button;
