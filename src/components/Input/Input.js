import React from 'react';
import { string, number } from 'prop-types';
import { TextInput, StyleSheet } from 'react-native';
import { Container } from '../Containers';
import { GREEN } from '../../variables/colors';

const Input = ({
    borderColor,
    borderRadius,
    border,
    maxHeight,
    paddingVertical,
    paddingHorizontal,
    width,
    ...props
}) => (
    <Container
        border={border}
        borderRadius={borderRadius}
        paddingVertical={paddingVertical}
        paddingHorizontal={paddingHorizontal}
        maxHeight={maxHeight}
        borderColor={borderColor}
        width={width}
    >
        <TextInput
            { ...props }
        />
    </Container>
);

Input.propTypes = {
    borderColor: string,
    borderRadius: number,
    border: number,
    maxHeight: number,
    paddingVertical: number,
    paddingHorizontal: number,
    width: number
};

Input.defaultProps = {
    borderColor: GREEN,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    border: 1,
    maxHeight: 40,
    width: 100
};

export default Input;
