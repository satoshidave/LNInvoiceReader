import React from 'react';
import { string, oneOfType, number } from 'prop-types';
import { Row, Text } from '../../components';
import { parseSats } from '../../utils/misc';

const DataBox = ({ index, value }) => {
    const label = index === 'tag' ? 'invoice_type' : index;
    const valueIsNumber = typeof value === 'number';
    return (
        <Row>
            <Text text={label} fontWeight='600' marginRight={5} />
            <Text text={valueIsNumber ? `${parseSats(value)} sats` : value} withoutTranslation={valueIsNumber} />
        </Row>
    )
};

DataBox.propTypes = {
    index: string,
    value: oneOfType([string, number])
};

export default DataBox;
