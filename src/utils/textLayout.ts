import { Skia } from '@shopify/react-native-skia';
import { HandwritingStyle, PageData, CharacterPosition } from '../types';

const PAGE_WIDTH = 595; // A4 width in points
const PAGE_HEIGHT = 842; // A4 height in points
const MARGIN_LEFT = 50;
const MARGIN_RIGHT = 50;
const MARGIN_TOP = 80;
const MARGIN_BOTTOM = 80;

export const getUsableWidth = () => PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
export const getUsableHeight = () => PAGE_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM;

/**
 * Measures text width using Skia font
 */
export const measureText = (
    text: string,
    style: HandwritingStyle,
    font: any
): number => {
    // More robust fallback checks
    if (!font || !text) return text?.length ? text.length * style.size * 0.6 : 0;

    // Use font.measureText instead of TextBlob.getBounds
    try {
        // Check if font has measureText method
        if (typeof font.measureText === 'function') {
            const textWidth = font.measureText(text);
            return typeof textWidth === 'number' && !isNaN(textWidth) ? textWidth : text.length * style.size * 0.6;
        }
        // Fallback if measureText is not available
        return text.length * style.size * 0.6;
    } catch (error) {
        // Fallback if measureText fails
        return text.length * style.size * 0.6;
    }
};

/**
 * Breaks text into lines that fit within the page width
 */
export const breakTextIntoLines = (
    text: string,
    style: HandwritingStyle,
    font: any
): string[] => {
    // Handle edge cases
    if (!text || typeof text !== 'string') {
        return [];
    }
    
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let currentLine = '';
    const maxWidth = getUsableWidth();

    for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        let width = 0;
        
        // Try to measure text, with better error handling
        try {
            width = measureText(testLine, style, font);
        } catch (error) {
            // If measurement fails, use a fallback based on character count
            width = testLine.length * style.size * 0.6;
        }

        if (width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }

    if (currentLine) {
        lines.push(currentLine);
    }

    return lines;
};

/**
 * Splits lines into pages based on page height
 */
export const splitIntoPages = (
    lines: string[],
    style: HandwritingStyle
): PageData[] => {
    const pages: PageData[] = [];
    const lineHeight = style.size * style.spacing_line;
    const maxLinesPerPage = Math.floor(getUsableHeight() / lineHeight);

    let currentPage: string[] = [];
    let pageNumber = 1;

    for (const line of lines) {
        if (currentPage.length >= maxLinesPerPage) {
            pages.push({ lines: currentPage, pageNumber });
            currentPage = [];
            pageNumber++;
        }
        currentPage.push(line);
    }

    if (currentPage.length > 0) {
        pages.push({ lines: currentPage, pageNumber });
    }

    return pages;
};

/**
 * Generates character positions with randomness for natural handwriting effect
 */
export const generateCharacterPositions = (
    line: string,
    startX: number,
    startY: number,
    style: HandwritingStyle,
    font: any
): CharacterPosition[] => {
    const positions: CharacterPosition[] = [];
    let currentX = startX;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        // Add randomness for natural look
        const jitterX = (Math.random() - 0.5) * 2; // ±1px
        const jitterY = (Math.random() - 0.5) * 2; // ±1px
        const rotation = (Math.random() - 0.5) * 1; // ±0.5 degrees

        // Measure character width with better error handling
        let charWidth = 0;
        try {
            charWidth = measureText(char, style, font);
        } catch (error) {
            // Fallback if measurement fails
            charWidth = style.size * 0.6;
        }
        
        const spacing = char === ' ' ? charWidth * style.spacing_word : charWidth;

        positions.push({
            char,
            x: currentX,
            y: startY,
            rotation,
            offsetX: jitterX,
            offsetY: jitterY,
        });

        currentX += spacing;
    }

    return positions;
};
