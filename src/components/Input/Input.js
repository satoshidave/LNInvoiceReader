import React from 'react';
import { number, bool } from 'prop-types';
import { TextInput, StyleSheet } from 'react-native';
import { Container } from '../Containers';
import { BLACK, WHITE } from '../../variables/colors';
import { getScreenSizeByPercentage } from '../../utils/misc';

const Input = ({
    borderRadius,
    border,
    maxHeight,
    paddingVertical,
    paddingHorizontal,
    width,
    fullWidth,
    marginTop,
    ...props
}) => {
    const containerProps = {
        backgroundColor: BLACK,
        width: fullWidth ? getScreenSizeByPercentage(80, 'width') : width,
        border,
        borderRadius,
        paddingVertical,
        paddingHorizontal,
        maxHeight,
        marginTop
    };

    return (
        <Container {...containerProps}>
            <TextInput
                { ...props }
            />
        </Container>
    );
};

Input.propTypes = {
    borderRadius: number,
    border: number,
    maxHeight: number,
    paddingVertical: number,
    paddingHorizontal: number,
    width: number,
    fullWidth: bool,
    marginTop: number
};

Input.defaultProps = {
    borderRadius: 3,
    paddingVertical: 10,
    paddingHorizontal: 20,
    border: 1,
    maxHeight: 40,
    width: 100,
    fullWidth: false,
    color: WHITE,
    marginTop: 0
};

export default Input;
