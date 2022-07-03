import React from 'react';
import { get } from 'lodash';
import { Button, Container, Icon, Lottie, MainContainer, Row, Text, Image } from '../../components';
import i18n from '../../utils/i18n';
import { Scan } from '../../../assets/icons';

const Home = ({ navigation }) => (
    <MainContainer>
        <Container
            alignItems='center'
            justifyContent='center'
        >
            <Row>
                <Lottie
                    source={require('../../../assets/animations/bitcoin.json')}
                    style={{ width: 200 }}
                />
            </Row>
            <Row flexDirection='column' alignItems='center'>
                <Text text={get(i18n, 'es.text_start_scan')} />
                <Button
                    onPress={() => navigation.navigate('Scan')}
                >
                    <Icon source={Scan} />
                    <Text text={get(i18n, 'es.scan')} fontWeight='bold' autoCapitalize />
                </Button>
            </Row>
        </Container>
        <Row alignItems='flex-end' justifyContent='center' padding={20}>
            <Image source={require('../../../assets/tiendasatoshi_logo.png')} />
        </Row>
    </MainContainer>
);

export default Home;
