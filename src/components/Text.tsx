import { fontFamily } from '../utils/themeConfig';

function Text({
    text,
    x,
    y,
    colour = 'black',
    fontWeight = 400,
    opacity = 1,
}: {
    text: string;
    x: number;
    y: number;
    colour?: string;
    fontWeight?: number;
    opacity?: number;
}) {
    return (
        <div
            style={{
                color: colour,
                transform: `translateX(${x}px) translateY(${y}px)`,
                fontSize: 60,
                fontFamily,
                fontWeight,
                opacity,
            }}>
            {text}
        </div>
    );
}

export default Text;
