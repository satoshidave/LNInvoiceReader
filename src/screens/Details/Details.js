import React from 'react';
import { get, map, omit } from 'lodash';
import moment from 'moment';
import RNQRCodeSVG from 'react-native-qrcode-svg';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { Container, MainContainer, Row, Column, Button } from '../../components';
import DataBox from './DataBox';
import i18n from '../../utils/i18n';
import { isLNAddress, phoneOS } from '../../utils/misc';
import QRCode from 'qrcode'
const { iosHtml, androidHtml } = require('../../HTML');

const initialInvoiceState = {
    text: '',
    isLNAddress: false,
    isQRCodeOpened: false,
    isBitcoinAddressOpened: false
};

const Details = ({ route, navigation, ...props }) => {
    const invoiceString = get(route, 'params.invoiceString', '');
    const { decodedInvoice } = get(route, 'params.invoiceDetails', '');

      const createPDF = async () => {
        try {
            if (phoneOS === 'ios') {
                const { uri } = await printToFileAsync({ html: iosHtml(invoiceString) });
                await shareAsync(uri);
            } else {
                const QRSVG = await QRCode.toString(invoiceString, { version: 12, width: 550 })
                console.log(androidHtml(QRSVG))
                const { uri } = await printToFileAsync({ html: androidHtml(QRSVG) });
                await shareAsync(uri);
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
                    <RNQRCodeSVG
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
                    <Button title={get(i18n, 'es.print')} onPress={() => createPDF()} />
                </Row>
            </Container>
        </MainContainer>
    );
};

export default Details;
