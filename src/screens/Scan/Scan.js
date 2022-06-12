import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Column, Container, Row, Text } from '../../components';
import { BarCodeScanner } from 'expo-barcode-scanner';

const opacity = 'rgba(0, 0, 0, .6)';

const Scan = () => {
    const [hasPermission, setHasPermission] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <Text text='Requesting for camera permission' />;
      }
      if (hasPermission === false) {
        return <Text text='No access to camera' />;
      }

    return (
        <BarCodeScanner
            onBarCodeScanned={data => console.log(data)}
            style={StyleSheet.absoluteFill}
        >
            <Row backgroundColor={opacity} />
            <Row style={{ flex: 1, flexDirection: 'row' }}>
                <Column backgroundColor={opacity} />
                <Column flex={3} />
                <Column backgroundColor={opacity} />
            </Row>
            <Row backgroundColor={opacity}>
                <Text text='Here we will show possible error messages' color='white' />
            </Row>
        </BarCodeScanner>
    );
};

export default Scan;
