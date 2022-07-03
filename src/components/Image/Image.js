import React from 'react';
import { Image as RNImage } from 'react-native';
import { componentStyles } from '../../utils/misc';

const Image = ({ color, width, height, ...props }) => (
    <RNImage
        style={componentStyles({
            tintColor: color,
            width,
            height
        })}
        {...props}
    />
);

export default Image;
