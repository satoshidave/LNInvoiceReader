import React, { useState, useEffect } from 'react';
import { size, get } from 'lodash';
import { parseInvoice } from '../../utils/invoices';
import { Button, Container, Text } from '../../components';
import i18n from '../../utils/i18n';

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
        <Container
            alignItems='center'
            justifyContent='center'
        >
            <Text text={get(i18n, 'es.text_start_scan')} />
            <Button
                title={get(i18n, 'es.scan')}
                fontWeight='bold'
                onPress={() => navigation.navigate('Scan')}
            />
        </Container>
    );
};

export default Home;
