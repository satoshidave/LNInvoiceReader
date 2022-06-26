import React, { useRef, useEffect } from 'react';
import { get } from 'lodash';
import { Button, Container, Lottie, MainContainer, Row, Text } from '../../components';
import i18n from '../../utils/i18n';

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
                    title={get(i18n, 'es.scan')}
                    fontWeight='bold'
                    onPress={() => navigation.navigate('Scan')}
                />
            </Row>
        </Container>
    </MainContainer>
);

export default Home;
