import React from 'react';
import { string, any, number } from 'prop-types';
import { View } from 'react-native';
import { componentStyles } from '../../utils/misc';

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
    border,
    borderColor,
    borderRadius,
    maxHeight,
    minHeight,
    fixedHeight,
    width,
    margin,
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
            borderWidth: border,
            borderColor,
            borderRadius,
            maxHeight: maxHeight || fixedHeight,
            minHeight: minHeight || fixedHeight,
            width,
            margin
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

const Row = ({ children, ...props }) => (
    <Container
        flexDirection='row'
        flex={0}
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

const MainContainer = ({ children }) => (
    <Container
        padding={10}
        alignItems={null}
        justifyContent={null}
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
