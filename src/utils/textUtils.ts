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
