import React from 'react';
import { string, any, number } from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { WHITE } from '../../variables/colors';

const containerStyles = (styles) => StyleSheet.create(styles);

const Container = ({
    children,
    flexDirection,
    flex,
    alignItems,
    justifyContent,
    backgroundColor,
    padding,
    borderRadius,
    ...props
}) => (
    <View
        style={containerStyles({
            flexDirection,
            flex,
            alignItems,
            justifyContent,
            backgroundColor,
            padding,
            borderRadius
        })}
        { ...props }
    >
        { children }
    </View>
);

Container.propTypes = {
    children: any,
    flexDirection: string,
    flex: number,
    alignItems: string,
    justifyContent: string,
    backgroundColor: string
};

Container.defaultProps = {
    children: null,
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: WHITE
};

const Row = ({ children, ...props }) => (
    <Container
        flexDirection='row'
        { ...props }
    >
        { children }
    </Container>
);

Row.propTypes = {
    children: any
};

Row.defaultProps = {
    children: null
};

const Column = ({ children, ...props }) => (
    <Container
        flexDirection='column'
        { ...props }
    >
        { children }
    </Container>
);

Column.propTypes = {
    children: any
};

export {
    Container,
    Row,
    Column
};
