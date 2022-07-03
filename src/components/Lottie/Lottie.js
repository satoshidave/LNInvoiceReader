import React, { useRef, useEffect } from 'react';
import { any, object, number } from 'prop-types';
import LottieView from 'lottie-react-native';
import { phoneOS } from '../../utils/misc';

const Lottie = ({ source, style, speed }) => {
    const animationRef = useRef(LottieView || null);

    useEffect(() => {
        if (phoneOS === 'ios') {
            setTimeout(() => animationRef.current?.play(), 500);
        }
    }, []);

    return (
        <LottieView
            autoPlay
            source={source}
            style={style}
            loop
            speed={speed}
            ref={(animation) => {
                animationRef.current = animation;
            }}
        />
    );
};

Lottie.propTypes = {
    source: any,
    style: object,
    speed: number
};

Lottie.defaultProps = {
    speed: 0.6
};

export default Lottie;
