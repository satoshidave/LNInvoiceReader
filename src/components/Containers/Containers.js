import React from 'react';
import { string, any, number } from 'prop-types';
import { View } from 'react-native';
import { componentStyles } from '../../utils/misc';
import { DARK } from '../../variables/colors';

const containerStyles = (styles) => componentStyles(styles);

const Container = ({
    children,
    flexDirection,
    flex,
    alignItems,
    justifyContent,
    backgroundColor,
    padding,
    paddingTop,
    paddingHorizontal,
    paddingVertical,
    border,
    borderColor,
    borderRadius,
    maxHeight,
    minHeight,
    fixedHeight,
    width,
    margin,
    nativeStyles,
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
            paddingTop,
            paddingHorizontal,
            paddingVertical,
            borderWidth: border,
            borderColor,
            borderRadius,
            maxHeight: maxHeight || fixedHeight,
            minHeight: minHeight || fixedHeight,
            width,
            margin,
            ...nativeStyles
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
    backgroundColor: string,
    padding: number,
    paddingTop: number,
    paddingHorizontal: number,
    paddingVertical: number,
    border: number,
    borderColor: string,
    borderRadius: number,
    maxHeight: number,
    minHeight: number,
    fixedHeight: number,
    width: number,
    margin: number
};

Container.defaultProps = {
    children: null,
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
};

const Row = ({ children, flex, ...props }) => (
    <Container
        flexDirection='row'
        flex={flex}
        { ...props }
    >
        { children }
    </Container>
);

Row.propTypes = {
    children: any,
    flex: number
};

Row.defaultProps = {
    children: null,
    flex: 0
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

const MainContainer = ({ children }) => (
    <Container
        padding={10}
        alignItems={null}
        justifyContent={null}
        backgroundColor={DARK}
    >
        { children }
    </Container>
);

export {
    Container,
    Row,
    Column,
    MainContainer
};
