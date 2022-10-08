import React from 'react';
import { string, func, number, object, bool } from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { Container } from '../Containers';
import Text from '../Text';
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
    children,
    withoutTranslation
}) => {
    const textComponentProps = {
        color,
        text: title,
        fontWeight,
        autoCapitalize: true,
        withoutTranslation
    };

    const containerComponentProps = {
        backgroundColor,
        flexDirection: 'column',
        flex: 0,
        paddingHorizontal,
        paddingVertical,
        borderRadius,
        margin,
        alignItems,
        shadowBox,
        ...nativeStyles
    };

    return (
        <TouchableOpacity onPress={onPress}>
            <Container {...containerComponentProps}>
                { children || <Text {...textComponentProps} /> }
            </Container>
        </TouchableOpacity>
    );
}

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
    shadowBox: object,
    withoutTranslation: bool
};

const nativeStyles = phoneOS === 'ios' ?
    {
        shadowColor: '#000000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 3
    } : { elevation: 2 };

Button.defaultProps = {
    title: 'button',
    onPress: () => {},
    color: WHITE,
    backgroundColor: ORANGE,
    fontWeight: 'normal',
    margin: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    withoutTranslation: false
}

export default Button;
