import { Platform, Dimensions, StyleSheet } from 'react-native';
import { get, includes, forEach } from 'lodash';

const { OS: phoneOS, Version: phoneVersion, isPad } = Platform;
const windowDimensions = Dimensions.get("window");
const screenDimensions = Dimensions.get("screen");

const validateInternetIdentifier = (internetIdentifier) => {
    var re = /\S+@\S+\.\S+/;
    console.log('holaaa', internetIdentifier, re.test(internetIdentifier))
    return re.test(internetIdentifier);
};

const screenMeasures = ['width', 'height'];

const getScreenSizeByPercentage = (percentage, measure) => {
    if (!includes(screenMeasures, measure)) return null;
    const size = get(windowDimensions, measure);
    return (percentage * size) / 100;
};

const componentStyles = styles => {
    const filteredStyles = {};
    forEach(styles, (element, index) => {
        if (element || element === 0) {
            filteredStyles[index] = element;
        }
    });
    return StyleSheet.create(filteredStyles);
};

const parseSats = sats => sats / 100;

export {
    validateInternetIdentifier,
    phoneOS,
    phoneVersion,
    isPad,
    windowDimensions,
    screenDimensions,
    getScreenSizeByPercentage,
    componentStyles,
    parseSats
};
