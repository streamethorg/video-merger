export function splitTextIntoLines(text: string, maxLen: number) {
    const words = text.split(' ');
    const lines: string[] = [''];
    let lineIndex = 0;

    words.forEach((word) => {
        if ((lines[lineIndex] + word).length > maxLen) {
            lines.push(word);
            lineIndex++;
        } else {
            lines[lineIndex] += ` ${word}`;
        }
    });

    return lines;
}

export function convertToSeconds(time: string | undefined): number {
    return time
        ? time
              .split(':')
              .map(Number)
              .reduce((acc, val, index) => acc + val * 60 ** (2 - index), 0)
        : 0;
}
