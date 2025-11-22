import RNFS from 'react-native-fs';
import { fontDataBase64 } from './fontData';

export interface FontInfo {
    name: string;
    displayName: string;
    fileName: string;
    filePath: string;
}

export const availableFonts: FontInfo[] = [
    {
        name: 'QEBradenHill',
        displayName: 'Braden Hill',
        fileName: 'QEBradenHill.ttf',
        filePath: 'QEBradenHill',
    },
    {
        name: 'QEDaveMergens',
        displayName: 'Dave Mergens',
        fileName: 'QEDaveMergens.ttf',
        filePath: 'QEDaveMergens',
    },
    {
        name: 'QEDavidReid',
        displayName: 'David Reid',
        fileName: 'QEDavidReid.ttf',
        filePath: 'QEDavidReid',
    },
    {
        name: 'QEDonaldRoss',
        displayName: 'Donald Ross',
        fileName: 'QEDonaldRoss.ttf',
        filePath: 'QEDonaldRoss',
    },
    {
        name: 'QERuthStafford',
        displayName: 'Ruth Stafford',
        fileName: 'QERuthStafford.ttf',
        filePath: 'QERuthStafford',
    },
];

/**
 * Get font info by name
 */
export const getFontByName = (name: string): FontInfo | undefined => {
    return availableFonts.find(font => font.name === name);
};

/**
 * Get font file path for require()
 */
export const getFontRequirePath = (fontName: string): any => {
    const fontMap: { [key: string]: any } = {
        'QEBradenHill': require('../../assets/fonts/QEBradenHill.ttf'),
        'QEDaveMergens': require('../../assets/fonts/QEDaveMergens.ttf'),
        'QEDavidReid': require('../../assets/fonts/QEDavidReid.ttf'),
        'QEDonaldRoss': require('../../assets/fonts/QEDonaldRoss.ttf'),
        'QERuthStafford': require('../../assets/fonts/QERuthStafford.ttf'),
    };
    return fontMap[fontName];
};

/**
 * Convert font file to base64 for PDF embedding
 * Uses pre-generated base64 data from fontData.ts
 */
export const getFontBase64 = async (fontName: string): Promise<string> => {
    try {
        const font = getFontByName(fontName);
        if (!font) {
            throw new Error(`Font ${fontName} not found`);
        }

        // Use pre-generated base64 data
        const base64 = fontDataBase64[fontName];
        if (!base64) {
            throw new Error(`Font data not found for ${fontName}`);
        }

        console.log(`Loaded font ${fontName} from embedded data, base64 length:`, base64.length);
        return base64;
    } catch (error) {
        console.error('Error getting font data:', error);
        throw error;
    }
};

/**
 * Get CSS font-family name for HTML/PDF
 */
export const getCSSFontFamily = (fontName: string): string => {
    const font = getFontByName(fontName);
    return font ? font.displayName : 'cursive';
};
