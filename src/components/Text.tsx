import { fontFamily } from '../utils/themeConfig';

function Text({
    text,
    x,
    y,
    color = 'black',
    fontWeight = 400,
    fontSize = 60,
    opacity = 1,
}: {
    readonly text: string;
    readonly x: number;
    readonly y: number;
    readonly color?: string;
    readonly fontWeight?: number;
    readonly fontSize?: number;
    readonly fontFamily?: string;
    readonly opacity?: number;
}) {
    const lines = text.split('\n').map((line, i) => <div key={i}>{line}</div>);
    return (
        <div
            style={{
                color,
                transform: `translateX(${x}px) translateY(${y}px)`,
                fontSize,
                fontFamily,
                fontWeight,
                opacity,
                textAlign: 'center',
            }}>
            {lines}
        </div>
    );
}

export default Text;
