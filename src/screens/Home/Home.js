import React, { useState, useEffect } from 'react';
import { size } from 'lodash';
import { View, StyleSheet, TextInput } from 'react-native';
import { parseInvoice } from '../../utils/invoices';
import Button from '../../components/Button/Button';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

const initialStatusState = {
    error: {},
    hasError: false,
    decodedInvoice: {},
    isInvoiceLoaded: false
};

const initialInvoiceState = {
    text: '',
    isLNAddress: false,
    isQRCodeOpened: false,
    isBitcoinAddressOpened: false
};

const Home = ({ navigation }) => {
    const [invoiceValue, setInvoiceValue] = useState('');
    const [statusStatetate, setStatusState] = useState(initialStatusState);

    const getInvoiceDetails = async () => {
        const genericFinalStateOnError = message => setStatusState({
            hasError: true,
            decodedInvoice: {},
            isInvoiceLoaded: false,
            error: { message }
        });

        try {
            let response;
            const parsedInvoiceResponse = await parseInvoice(invoiceValue);

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
                setStatusState({
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

    console.log(statusStatetate)

    return (
        <View style={styles.container}>
            <Button
                title='Scan'
                onPress={() => navigation.navigate('Scan')}
            />
            <TextInput
                style={{ borderColor: '#eaeaea', borderWidth: 1, width: 300, height: 40 }}
                value={invoiceValue}
                onChangeText={value => setInvoiceValue(value)}
                autoCapitalize='none'
            />
            <Button
                title='Send'
                //onPress={getInvoiceDetails}
                onPress={() => alert('Se lo dedico a Juan')}
            />
        </View>
    );
};

export default Home;
