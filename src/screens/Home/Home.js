import React from 'react';
import { size, get } from 'lodash';
import LottieView from 'lottie-react-native';
import { Button, Container, MainContainer, Row, Text } from '../../components';
import i18n from '../../utils/i18n';

const Home = ({ navigation }) => {
    return (
        <MainContainer>
            <Container
                alignItems='center'
                justifyContent='center'
            >
                <Row>
                    <LottieView
                        autoPlay
                        source={require('../../../assets/animations/bitcoin.json')}
                        style={{
                            width: 200
                        }}
                        speed={0.6}
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
};

export default Home;
