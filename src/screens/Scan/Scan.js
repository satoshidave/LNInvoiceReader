import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { StyleSheet } from 'react-native';
import { parseInvoice } from '../../utils/invoices';
import { Button, Column, Container, Row, Text } from '../../components';
import { BarCodeScanner } from 'expo-barcode-scanner';

const { qr } = BarCodeScanner.Constants.BarCodeType;

const opacity = 'rgba(0, 0, 0, .6)';

const initialInvoiceDetails = {
    error: {},
    hasError: false,
    decodedInvoice: {},
    isInvoiceLoaded: false
};

const Scan = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [invoiceDetails, setInvoiceDetails] = useState(initialInvoiceDetails);
    const [invoiceString, setInvoiceString] = useState('');

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        const { hasError, isInvoiceLoaded } = invoiceDetails;
        if (!hasError && isInvoiceLoaded) {
            navigation.navigate('Details', { invoiceDetails, invoiceString });
        }
    }, [invoiceDetails]);

    const clearInvoiceData = () => setTimeout(() => {
        setInvoiceDetails(initialInvoiceDetails);
        setScanned(false)
    }, 3000);

    if (hasPermission === null) {
        return <Text text='Requesting for camera permission' />;
      }

    if (hasPermission === false) {
        return <Text text='No access to camera' />;
    }

    const getInvoiceDetails = async (invoice) => {
        const genericFinalStateOnError = message => setInvoiceDetails({
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
                setInvoiceString(invoice);
                setInvoiceDetails({
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

    console.log(invoiceDetails)

    return (
        <BarCodeScanner
            onBarCodeScanned={data => {
                if (scanned) return;
                setScanned(true);
                getInvoiceDetails(get(data, 'data', ''));
                clearInvoiceData();
            }}
            style={StyleSheet.absoluteFill}
            barCodeTypes={[qr]}
        >
            <Row backgroundColor={opacity} />
            <Row style={{ flex: 1, flexDirection: 'row' }}>
                <Column backgroundColor={opacity} />
                <Column flex={3} />
                <Column backgroundColor={opacity} />
            </Row>
            <Row backgroundColor={opacity}>
                <Button onPress={() => getInvoiceDetails('LNURL1DP68GURN8GHJ7MR9VAJKUEPWD3HXY6T5WVHXXMMD9AKXUATJD3CZ7CTSDYHHVVF0D3H82UNV9UCNVWPNVMNGY9')} />
                <Text text='Here we will show possible error messages' color='white' />
            </Row>
        </BarCodeScanner>
    );
};

export default Scan;
