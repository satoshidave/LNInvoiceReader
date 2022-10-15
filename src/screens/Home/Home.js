import React from 'react';
import { Button, Container, Icon, Lottie, MainContainer, Row, Text, Image } from '../../components';
import { Scan } from '../../../assets/icons';
import { windowDimensions } from '../../utils/misc';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector';
import InvoiceFormInput from '../../components/InvoiceFormInput/InvoiceFormInput';

const Home = ({ navigation }) => (
    <MainContainer>
        <Container
            alignItems='center'
            justifyContent='center'
        >
            <Row width={windowDimensions.width} justifyContent='flex-end' paddingHorizontal={15}>
                <LanguageSelector />
            </Row>
            <Row flex={1} alignItems='center'>
                <Lottie
                    source={require('../../../assets/animations/bitcoin.json')}
                    style={{ width: 200 }}
                />
            </Row>
            <Row flexDirection='column' alignItems='center' flex={1}>
                <Text text='text_start_scan' />
                <Button
                    onPress={() => navigation.navigate('Scan')}
                >
                    <Icon source={Scan} />
                </Button>
                <InvoiceFormInput navigation={navigation} />
            </Row>
        </Container>
        <Row alignItems='flex-end' justifyContent='center' padding={20}>
            <Image source={require('../../../assets/tiendasatoshi_logo.png')} />
        </Row>
    </MainContainer>
);

export default Home;
