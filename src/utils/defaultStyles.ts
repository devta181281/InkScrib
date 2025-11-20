import { HandwritingStyle, PaperStyle } from '../types';

export const defaultHandwritingStyles: HandwritingStyle[] = [
    {
        font: 'Caveat',
        size: 20,
        slant: 0,
        spacing_line: 1.5,
        spacing_word: 1.1,
        ink_color: '#000000',
    },
    {
        font: 'Caveat',
        size: 22,
        slant: 4,
        spacing_line: 1.4,
        spacing_word: 1.1,
        ink_color: '#1b3fd6',
    },
    {
        font: 'Caveat',
        size: 18,
        slant: -2,
        spacing_line: 1.6,
        spacing_word: 1.2,
        ink_color: '#2d2d2d',
    },
];

export const defaultPaperStyles: PaperStyle[] = [
    {
        id: 'ruled',
        name: 'Ruled',
        image: null, // Will be generated
    },
    {
        id: 'blank',
        name: 'Blank',
        image: null,
    },
    {
        id: 'margin',
        name: 'Margin Notebook',
        image: null,
    },
];
