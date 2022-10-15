import React, { useState, useEffect } from 'react';
import { toLower } from 'lodash';
import { Search } from '../../../assets/icons';
import Button from '../Button';
import { Row } from '../Containers';
import Icon from '../Icon';
import Input from '../Input';
import Text from '../Text';
import { getInvoiceDetails, isValidForAllSchemes } from '../../utils/misc';

const InvoiceFormInput = ({ navigation }) => {
    const [invoiceString, setInvoiceString] = useState(null);
    const [invoiceDetails, setInvoiceDetails] = useState({});

    useEffect(() => {
        console.log(invoiceDetails)
        const { hasError, isInvoiceLoaded } = invoiceDetails;
        if (!hasError && isInvoiceLoaded) {
            navigation.navigate('Details', { invoiceDetails, invoiceString });
            setInvoiceString(null);
            setInvoiceDetails({});
        }
    }, [invoiceDetails]);

    return (
        <>
            <Text text='text_start_insert' />
            <Row>
                <Input
                    placeholder='LNBCA0B1C2D3......'
                    marginTop={10}
                    onChangeText={text => setInvoiceString(text)}
                    autoCapitalize='none'
                    value={invoiceString}
                />
                <Button
                    disabled={!isValidForAllSchemes(toLower(invoiceString))}
                    onPress={() => getInvoiceDetails(invoiceString, setInvoiceDetails)}
                >
                    <Icon source={Search} size={18} />
                </Button>
            </Row>
        </>
    );
};

export default InvoiceFormInput;
