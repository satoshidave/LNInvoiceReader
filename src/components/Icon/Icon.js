import React from 'react';
import { number, string, oneOfType } from 'prop-types';
import { WHITE } from '../../variables/colors';
import Image from '../Image';

const Icon = ({ color, size, ...props }) => (
    <Image
        color={color}
        width={size}
        height={size}
        {...props}
    />
);

Icon.propTypes = {
    color: string,
    size: oneOfType([number, string])
};

Icon.defaultProps = {
    color: WHITE,
    size: 30
};

export default Icon;
