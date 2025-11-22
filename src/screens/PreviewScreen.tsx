import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HandwritingCanvas } from '../components/HandwritingCanvas';
import { HandwritingStyle, PaperStyle } from '../types';
import RNFS from 'react-native-fs';
import { generatePDF } from 'react-native-html-to-pdf';
import { getFontByName, getCSSFontFamily, getFontBase64 } from '../utils/fontUtils';

interface PreviewScreenProps {
    route: any;
    navigation: any;
}

export const PreviewScreen: React.FC<PreviewScreenProps> = ({
    route,
    navigation,
}) => {
    const { text, style, paper } = route.params as {
        text: string;
        style: HandwritingStyle;
        paper: PaperStyle;
    };

    const [currentPage, setCurrentPage] = useState(1);

    const handleExport = async () => {
        try {
            // Get font information
            const fontInfo = getFontByName(style.font);
            const fontFamily = getCSSFontFamily(style.font);

            // Read font file as base64
            let fontBase64 = '';
            try {
                fontBase64 = await getFontBase64(style.font);
                console.log('Font loaded successfully for PDF, base64 length:', fontBase64.length);
            } catch (error) {
                console.warn('Could not load font file, using fallback:', error);
            }

            // Create HTML content with the text in a handwritten style
            const htmlContent = `
                <html>
                    <head>
                        <meta charset="utf-8">
                        <title>Handwritten Document</title>
                        <style>
                            ${fontBase64 ? `
                            @font-face {
                                font-family: '${fontFamily}';
                                src: url(data:font/truetype;charset=utf-8;base64,${fontBase64}) format('truetype');
                            }
                            ` : ''}
                            body {
                                font-family: ${fontBase64 ? `'${fontFamily}',` : ''} 'Comic Sans MS', 'Segoe Script', cursive, sans-serif;
                                margin: 40px;
                                background-color: #ffffff;
                                background-image: linear-gradient(transparent 23px, #dddddd 24px);
                                background-size: 100% 24px;
                                line-height: 24px;
                                padding: 20px 0;
                            }
                            .content {
                                white-space: pre-wrap;
                                font-size: 16px;
                                color: #333333;
                                transform: rotate(-0.5deg);
                                text-shadow: 0.5px 0.5px 0px rgba(0,0,0,0.1);
                            }
                            .word {
                                display: inline-block;
                                transform: rotate(0.1deg);
                                margin-right: 2px;
                            }
                            .character {
                                display: inline-block;
                                transform: rotate(0.2deg) scale(1.01);
                            }
                        </style>
                    </head>
                    <body>
                        <div class="content">${text.split(' ').map(word =>
                `<span class="word">${word.split('').map(char =>
                    `<span class="character">${char}</span>`
                ).join('')}</span>`
            ).join(' ')}</div>
                    </body>
                </html>
            `;

            // Options for PDF generation
            const options = {
                html: htmlContent,
                fileName: 'handwritten',
                directory: 'Documents',
            };

            // Generate PDF
            const pdf = await generatePDF(options);

            Alert.alert(
                'Success',
                `PDF saved to: ${pdf.filePath}`,
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.error('Error exporting PDF:', error);
            Alert.alert(
                'Error',
                'Failed to export PDF. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#6366f1" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Preview</Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Canvas Preview */}
            <View style={styles.canvasContainer}>
                <HandwritingCanvas
                    text={text}
                    style={style}
                    paper={paper}
                    pageNumber={currentPage}
                />
            </View>

            {/* Action Buttons */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.actionButton} onPress={handleExport}>
                    <View style={[styles.actionButtonContent, styles.primaryButton]}>
                        <Text style={styles.actionButtonText}>📄 Export PDF</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#6366f1',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    backButton: {
        padding: 8,
    },
    backButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    headerSpacer: {
        width: 60,
    },
    canvasContainer: {
        flex: 1,
        margin: 16,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    footer: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    actionButton: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    actionButtonContent: {
        paddingVertical: 16,
        alignItems: 'center',
        backgroundColor: '#6366f1',
    },
    primaryButton: {
        backgroundColor: '#6366f1',
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
});
