import { useCurrentFrame } from 'remotion';
import { interpolate } from 'remotion';
import { Lottie, LottieAnimationData } from '@remotion/lottie';
import { useEffect, useState } from 'react';
import {
    cancelRender,
    continueRender,
    delayRender,
    staticFile,
} from 'remotion';

export const AfterEffectsAnimation = ({
    name,
    title,
}: {
    name: string;
    title: string;
}) => {
    const [handle] = useState(() => delayRender('Loading Lottie animation'));
    const [animationData, setAnimationData] =
        useState<LottieAnimationData | null>(null);

    useEffect(() => {
        fetch(staticFile('animations/protocol_berg.json'))
            .then((data) => data.json())
            .then((json) => {
                let jsonString = JSON.stringify(json);

                jsonString = jsonString.replace('PLACEHOLDER_NAME', name);
                jsonString = jsonString.replace('PLACEHOLDER_TITLE', title);

                const updatedJson = JSON.parse(jsonString);

                setAnimationData(updatedJson);
                continueRender(handle);
            })
            .catch((err) => {
                console.log('Animation failed to load', err);
                cancelRender(err);
            });
    }, [handle, name, title]);

    if (!animationData) {
        return null;
    }

    return <Lottie animationData={animationData} />;
};
