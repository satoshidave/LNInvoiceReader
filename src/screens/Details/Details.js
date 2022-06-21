import React, { useEffect, useState } from 'react';
import { get, map, omit } from 'lodash';
import QRCode from 'react-native-qrcode-svg';
import { Container, MainContainer, Row, Column, Button } from '../../components';
import DataBox from './DataBox';
import i18n from '../../utils/i18n';

const initialInvoiceState = {
    text: '',
    isLNAddress: false,
    isQRCodeOpened: false,
    isBitcoinAddressOpened: false
};

const Details = ({ route, navigation, ...props }) => {
    const invoiceString = get(route, 'params.invoiceString', '');
    const invoiceDetails = get(route, 'params.invoiceDetails', '');

    console.log(invoiceDetails)
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
                        { map(omit(get(invoiceDetails, 'decodedInvoice', []), ['callback', 'metadata', 'defaultDescription', 'k1']), (item, index) => (
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
