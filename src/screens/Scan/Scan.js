import React, { useState, useEffect, useCallback } from 'react';
import { get } from 'lodash';
import { StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'
import { Column, Row, Text, If, Lottie, Button } from '../../components';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { getInvoiceDetails } from '../../utils/misc';

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
    const [invoiceDetails, setInvoiceDetails] = useState({});
    const [invoiceString, setInvoiceString] = useState('');
    const [isVisible, setIsVisible] = useState(false)

    useFocusEffect(useCallback(() => {
        setIsVisible(true)
        return () => {
            setIsVisible(false);
        }
    }, []));

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
        return <Text text='requesting_camera_permission' />;
      }

    if (hasPermission === false) {
        return <Text text='no_camera_permission' />;
    }

    return (
        <If
            condition={isVisible}
            then={
                <BarCodeScanner
                    onBarCodeScanned={data => {
                        const invoice = get(data, 'data', '');
                        if (scanned) return;
                        setScanned(true);
                        setInvoiceString(invoice);
                        getInvoiceDetails(invoice, setInvoiceDetails);
                        clearInvoiceData();
                    }}
                    style={StyleSheet.absoluteFill}
                    barCodeTypes={[qr]}
                >
                    <Row backgroundColor={opacity} flex={1} />
                        <Lottie
                            source={require('../../../assets/animations/scanner.json')}
                            style={{ right: 10 }}
                        />
                    <Row style={{ flex: 1, flexDirection: 'row' }}>
                        <Column backgroundColor={opacity} />
                        <Column flex={3} />
                        <Column backgroundColor={opacity} />
                    </Row>
                    <Row backgroundColor={opacity} flex={1} alignItems='center' justifyContent='center' paddingHorizontal={30}>
                        {/* The button commented below, is for bypass purposes */}
                        {/* <Button
                            title='Bypass'
                            withoutTranslation
                            onPress={() => {
                                const invoice = 'LNURL1DP68GURN8GHJ7MR9VAJKUEPWD3HXY6T5WVHXXMMD9AKXUATJD3CZ7CTSDYHHVVF0D3H82UNV9UCNVWPNVMNGY9';
                                setInvoiceString(invoice);
                                getInvoiceDetails(invoice, setInvoiceDetails);
                            }}
                        /> */}
                        <If condition={get(invoiceDetails, 'hasError', false)}>
                            <Text text='scan_error' color='white' />
                        </If>
                    </Row>
                </BarCodeScanner>
            }
        />
    );
};

export default Scan;
