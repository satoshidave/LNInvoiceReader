import React from 'react';
import {} from 'prop-types';
import { get, includes } from 'lodash';
import { Row, Text } from '../../components';
import i18n from '../../utils/i18n';
import { parseSats } from '../../utils/misc';

const DataBox = ({ index, value }) => {
    const label = index === 'tag' ? 'invoice_type' : index;
    return (
        <Row>
            <Text text={`${get(i18n, `es.${label}`, '')}:`} fontWeight='600' marginRight={5} />
            <Text text={typeof value === 'number' ? `${parseSats(value)} sats` : get(i18n, `es.${value}`, '')} />
        </Row>
    )
};

export default DataBox;
