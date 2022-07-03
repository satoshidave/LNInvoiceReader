import React from 'react';
import { string, func, number, object } from 'prop-types';
import { get } from 'lodash';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Container } from '../Containers';
import Text from '../Text';
import i18n from '../../utils/i18n';
import { ORANGE, WHITE } from '../../variables/colors';
import { phoneOS } from '../../utils/misc';

const Button = ({
    title,
    onPress,
    color,
    backgroundColor,
    fontWeight,
    margin,
    paddingHorizontal,
    paddingVertical,
    borderRadius,
    alignItems,
    shadowBox,
    children
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
            alignItems={alignItems}
            shadowBox={shadowBox}
            {...nativeStyles}
        >
            { children || <Text color={color} text={title} fontWeight={fontWeight} autoCapitalize /> }
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
    borderRadius: number,
    alignItems: string,
    shadowBox: object
};

const nativeStyles = phoneOS === 'ios' ?
    {
        shadowColor: '#000000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 3
    } : { elevation: 2 };

Button.defaultProps = {
    title: get(i18n, 'es.button'),
    onPress: () => {},
    color: WHITE,
    backgroundColor: ORANGE,
    fontWeight: 'normal',
    margin: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center'
}

export default Button;
