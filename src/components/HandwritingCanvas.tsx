import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import {
    Canvas,
    Skia,
    Text as SkiaText,
    Group,
    Image,
    matchFont,
} from '@shopify/react-native-skia';
import { HandwritingStyle, PaperStyle } from '../types';
import {
    breakTextIntoLines,
    splitIntoPages,
    generateCharacterPositions,
} from '../utils/textLayout';

interface HandwritingCanvasProps {
    text: string;
    style: HandwritingStyle;
    paper: PaperStyle;
    pageNumber?: number;
}

const MARGIN_LEFT = 50;
const MARGIN_TOP = 80;

export const HandwritingCanvas: React.FC<HandwritingCanvasProps> = ({
    text,
    style,
    paper,
    pageNumber = 1,
}) => {
    const { width, height } = Dimensions.get('window');

    // Use system font temporarily
    const font = matchFont({
        fontFamily: 'cursive',
        fontSize: style.size,
        fontStyle: 'normal',
        fontWeight: 'normal',
    });

    // Break text into lines
    const lines = breakTextIntoLines(text, style, font);
    const pages = splitIntoPages(lines, style);
    const currentPage = pages[pageNumber - 1] || { lines: [], pageNumber: 1 };

    // Render each line with character-level randomness
    const renderLine = (line: string, lineIndex: number) => {
        const y = MARGIN_TOP + lineIndex * style.size * style.spacing_line;
        const positions = generateCharacterPositions(
            line,
            MARGIN_LEFT,
            y,
            style,
            font
        );

        return positions.map((pos, charIndex) => {
            const key = `${lineIndex}-${charIndex}`;

            return (
                <Group
                    key={key}
                    transform={[
                        { translateX: pos.x + pos.offsetX },
                        { translateY: pos.y + pos.offsetY },
                        { rotate: (pos.rotation * Math.PI) / 180 },
                        { skewX: (style.slant * Math.PI) / 180 },
                    ]}
                >
                    <SkiaText
                        x={0}
                        y={0}
                        text={pos.char}
                        font={font}
                        color={style.ink_color}
                    />
                </Group>
            );
        });
    };

    return (
        <View style={styles.container}>
            <Canvas style={{ width, height }}>
                {/* Render paper background if available */}
                {paper.image && (
                    <Image
                        image={paper.image}
                        x={0}
                        y={0}
                        width={width}
                        height={height}
                        fit="cover"
                    />
                )}

                {/* Render handwritten text */}
                {currentPage.lines.map((line, index) => renderLine(line, index))}
            </Canvas>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
});
