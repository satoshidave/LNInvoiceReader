import React from 'react';
import { bool, any } from 'prop-types';

const If = ({ condition, else: otherwise, then, children }) => {
    if (!condition) return otherwise;
    return then || children;
};

If.propTypes = {
    condition: bool,
    else: any
};

If.defaultProps = {
    condition: false,
    else: null
};

export {
    If
};
