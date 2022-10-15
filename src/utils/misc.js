import { Platform, Dimensions, StyleSheet } from 'react-native';
import { get, includes, forEach, size, startsWith } from 'lodash';
import { BOLT11_SCHEME, LIGHTNING_SCHEME, LNURL_SCHEME } from '../variables/labels';
import { parseInvoice } from './invoices';

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

const isLNAddress = invoice => includes(invoice, BOLT11_SCHEME);

const getInvoiceDetails = async (invoice, callback) => {
    const genericFinalStateOnError = message => callback({
        hasError: true,
        decodedInvoice: {},
        isInvoiceLoaded: false,
        error: { message }
    });

    try {
        let response;
        const parsedInvoiceResponse = await parseInvoice(invoice);

        if (!parsedInvoiceResponse) return genericFinalStateOnError('Please enter a valid request or address and try again.');

        const { isLNURL, data, error, isLNAddress } = parsedInvoiceResponse;

        if (error && size(error) > 0) return genericFinalStateOnError(error);

        if (!data) return genericFinalStateOnError('Could not parse/understand this invoice or request. Please try again.');

        if (isLNURL) {
            if (isLNAddress) {
                response = data;
            } else {
                response = await data;
            }
        } else {
            response = data;
        }

        if (response) {
            callback({
                hasError: false,
                decodedInvoice: response,
                isInvoiceLoaded: true,
                error: {}
            });
        }
    } catch (error) {
        genericFinalStateOnError(error);
    }
}

const isValidForAllSchemes = (invoice) => {
    const isValid = scheme => startsWith(invoice, scheme);
    if (isValid(LIGHTNING_SCHEME) || isValid(BOLT11_SCHEME) || isValid(LNURL_SCHEME)) return true;
    return false;
};

export {
    validateInternetIdentifier,
    phoneOS,
    phoneVersion,
    isPad,
    windowDimensions,
    screenDimensions,
    getScreenSizeByPercentage,
    componentStyles,
    parseSats,
    isLNAddress,
    getInvoiceDetails,
    isValidForAllSchemes
};
