import React from 'react';
import { get, map, omit } from 'lodash';
import moment from 'moment';
import QRCode from 'react-native-qrcode-svg';
import { Container, MainContainer, Row, Column, Button } from '../../components';
import DataBox from './DataBox';
import i18n from '../../utils/i18n';
import { isLNAddress } from '../../utils/misc';

const initialInvoiceState = {
    text: '',
    isLNAddress: false,
    isQRCodeOpened: false,
    isBitcoinAddressOpened: false
};

const Details = ({ route, navigation, ...props }) => {
    const invoiceString = get(route, 'params.invoiceString', '');
    const { decodedInvoice } = get(route, 'params.invoiceDetails', '');

    const invoiceFields = isLNAddress(invoiceString) ? {
        amount: get(decodedInvoice, 'satoshis', 0),
        tag: 'LN',
        timeExpireDate: moment(get(decodedInvoice, 'timeExpireDate', moment('X')), 'X').format('DD/MM/YYYY HH:mm:ss')
    } : omit(decodedInvoice || {}, ['callback', 'metadata', 'defaultDescription', 'k1'])

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
                </Row>
            </Container>
        </MainContainer>
    );
};

export default Details;
