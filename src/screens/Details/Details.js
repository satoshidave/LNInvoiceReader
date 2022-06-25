import React from 'react';
import { get, map, omit } from 'lodash';
import moment from 'moment';
import QRCode from 'react-native-qrcode-svg';
import { printToFileAsync } from 'expo-print';
import { requestPermissionsAsync, createAssetAsync } from 'expo-media-library';
import { shareAsync } from 'expo-sharing';
import { Container, MainContainer, Row, Column, Button } from '../../components';
import DataBox from './DataBox';
import i18n from '../../utils/i18n';
import { isLNAddress, phoneOS } from '../../utils/misc';
const html = require('../../HTML');

const initialInvoiceState = {
    text: '',
    isLNAddress: false,
    isQRCodeOpened: false,
    isBitcoinAddressOpened: false
};

const Details = ({ route, navigation, ...props }) => {
    const invoiceString = get(route, 'params.invoiceString', '');
    const { decodedInvoice } = get(route, 'params.invoiceDetails', '');

    const createPDF = async (html) => {
        try {
            const { uri } = await printToFileAsync({ html });
            if (phoneOS === 'ios') {
                await shareAsync(uri);
            } else {
                const permission = await requestPermissionsAsync();
                if (permission.granted) {
                    await createAssetAsync(uri);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const invoiceFields = isLNAddress(invoiceString) ? {
        amount: get(decodedInvoice, 'satoshis', 0),
        tag: 'LN',
        timeExpireDate: moment(get(decodedInvoice, 'timeExpireDate', moment('X')), 'X').format('DD/MM/YYYY HH:mm:ss')
    } : {
        maxSendable: get(decodedInvoice, 'maxSendable', 100000000),
        minSendable: get(decodedInvoice, 'minSendable', 1),
        tag: get(decodedInvoice, 'tag', 'payRequest')
    };

    return (
        <MainContainer>
            <Container alignItems='center'>
                <Row>
                    <QRCode
                        value={invoiceString}
                        size={200}
                    /> 
                </Row>
                <Row paddingTop={10}>
                    <Column alignItems='center'>
                        { map(invoiceFields, (item, index) => (
                            <DataBox key={index} index={index} value={item} />
                        ))}
                    </Column>
                </Row>
                <Row>
                    <Button title={get(i18n, 'es.go_to_home')} onPress={() => navigation.popToTop()} />
                    <Button title={get(i18n, 'es.export_to_pdf')} onPress={() => createPDF(html(invoiceString))} />
                </Row>
            </Container>
        </MainContainer>
    );
};

export default Details;
