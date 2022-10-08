import React from 'react';
import { get, map } from 'lodash';
import moment from 'moment';
import RNQRCodeSVG from 'react-native-qrcode-svg';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { Container, MainContainer, Row, Column, Button } from '../../components';
import DataBox from './DataBox';
import { isLNAddress, phoneOS } from '../../utils/misc';
import QRCode from 'qrcode'
import { WHITE } from '../../variables/colors';
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
                const version = isLNAddress(invoiceString) ? 14 : 12;
                const QRSVG = await QRCode.toString(invoiceString, { version, width: 550 });
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
                <Row padding={20} borderRadius={5} backgroundColor={WHITE}>
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
                    <Button title='go_to_home' onPress={() => navigation.popToTop()} />
                    <Button title='print' onPress={() => createPDF()} />
                </Row>
            </Container>
        </MainContainer>
    );
};

export default Details;
