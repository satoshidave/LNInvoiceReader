import { Platform, Dimensions } from 'react-native';
import { get, includes } from 'lodash';

const { OS: phoneOS, Version: phoneVersion, isPad } = Platform;
const windowDimensions = Dimensions.get("window");
const screenDimensions = Dimensions.get("screen");

const validateInternetIdentifier = (internetIdentifier) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(internetIdentifier);
};

const screenMeasures = ['width', 'height'];

const getScreenSizeByPercentage = (percentage, measure) => {
    if (!includes(screenMeasures, measure)) return null;
    const size = get(windowDimensions, measure);
    return (percentage * size) / 100;
};

export {
    validateInternetIdentifier,
    phoneOS,
    phoneVersion,
    isPad,
    windowDimensions,
    screenDimensions,
    getScreenSizeByPercentage
};
