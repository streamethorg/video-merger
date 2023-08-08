import React, { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';

interface Props {
    x: number;
    y: number;
    durationInSeconds: number;
    children: ReactNode;
}

const MoveObject = (props: Props) => {
    const { x, y, durationInSeconds, children } = props;
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const progress = Math.min(frame / (durationInSeconds * fps), 1);

    const transitionX = interpolate(progress, [0, 1], [0, x], {
        easing: Easing.inOut(Easing.ease),
    });

    const transitionY = interpolate(progress, [0, 1], [0, y], {
        easing: Easing.inOut(Easing.ease),
    });

    return (
        <div>
            <div
                style={{
                    transform: `translate(${transitionX}px, ${transitionY}px)`,
                }}>
                {children}
            </div>
        </div>
    );
};

export default MoveObject;
