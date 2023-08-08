import { CameraMotionBlur } from '@remotion/motion-blur';
import { Session as SessionType } from 'inspector';
import { AbsoluteFill, Sequence } from 'remotion';

interface Props {
    session: SessionType;
}
export function BaseTwoIntro(props: Props) {
    const { session } = props;

    return (
        <CameraMotionBlur samples={5}>
            <Sequence name="Background">
                <AbsoluteFill className='bg-[#f9fafb]' />
            </Sequence>
        </CameraMotionBlur>
    );
}
