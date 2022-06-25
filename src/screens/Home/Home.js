import React from 'react';
import { size, get } from 'lodash';
import { Button, Container, MainContainer, Text } from '../../components';
import i18n from '../../utils/i18n';

const Home = ({ navigation }) => {
    return (
        <MainContainer>
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
        </MainContainer>
    );
};

export default Home;
