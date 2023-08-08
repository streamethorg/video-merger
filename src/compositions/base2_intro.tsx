import { spring, useVideoConfig } from 'remotion';
import { CameraMotionBlur } from '@remotion/motion-blur';
import { Session as SessionType } from 'inspector';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';

interface Props {
    session: SessionType;
}
export function BaseTwoIntro(props: Props) {
    const { session } = props;
    const text = 'Protocol Berg';
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const visibleCharacters = Math.floor(
        spring({
            frame,
            from: 0,
            to: text.length,
            fps,
            config: {
                stiffness: 1,
            },
        }),
    );

    return (
        <CameraMotionBlur samples={5}>
            <Sequence name="Background">
                <AbsoluteFill className="bg-[#f9fafb]" />
            </Sequence>
            <Sequence name="Speaker Name">
                <AbsoluteFill>
                    <div
                        className="text-black flex items-center justify-center h-screen"
                        style={{ fontFamily: 'Latin Modern', fontSize: 110 }}>
                        {text.slice(0, visibleCharacters)}
                    </div>
                </AbsoluteFill>
            </Sequence>
        </CameraMotionBlur>
    );
}
