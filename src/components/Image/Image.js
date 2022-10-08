import React from 'react';
import { Image as RNImage } from 'react-native';
import { componentStyles } from '../../utils/misc';

const Image = ({ color, width, height, size, ...props }) => (
    <RNImage
        style={componentStyles({
            tintColor: color,
            width: size || width,
            height: size || height
        })}
        {...props}
    />
);

export default Image;
