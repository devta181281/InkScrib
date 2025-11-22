import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HandwritingStyle, PaperStyle } from '../types';
import { defaultHandwritingStyles, defaultPaperStyles } from '../utils/defaultStyles';
import { availableFonts, getFontByName } from '../utils/fontUtils';

interface EditorScreenProps {
    navigation: any;
}

export const EditorScreen: React.FC<EditorScreenProps> = ({ navigation }) => {
    const [text, setText] = useState('');
    const [selectedStyle, setSelectedStyle] = useState<HandwritingStyle>(
        defaultHandwritingStyles[0]
    );
    const [selectedPaper, setSelectedPaper] = useState<PaperStyle>(
        defaultPaperStyles[0]
    );
    const [wordCount, setWordCount] = useState(0);
    const [showStylePicker, setShowStylePicker] = useState(false);
    const [showPaperPicker, setShowPaperPicker] = useState(false);
    const [showFontPicker, setShowFontPicker] = useState(false);

    const handleTextChange = (newText: string) => {
        setText(newText);
        const words = newText.trim().split(/\s+/).filter(Boolean);
        setWordCount(words.length);
    };

    const estimatedPages = Math.ceil(wordCount / 250);

    const handlePreview = () => {
        navigation.navigate('Preview', {
            text,
            style: selectedStyle,
            paper: selectedPaper,
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#6366f1" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>InkScrib</Text>
                <Text style={styles.headerSubtitle}>Transform text to handwriting</Text>
            </View>

            <ScrollView style={styles.content}>
                {/* Stats Card */}
                <View style={styles.statsCard}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{wordCount}</Text>
                        <Text style={styles.statLabel}>Words</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{estimatedPages}</Text>
                        <Text style={styles.statLabel}>Pages</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{text.length}</Text>
                        <Text style={styles.statLabel}>Characters</Text>
                    </View>
                </View>

                {/* Text Input */}
                <View style={styles.inputCard}>
                    <Text style={styles.sectionTitle}>Your Text</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Type or paste your text here..."
                        placeholderTextColor="#9ca3af"
                        multiline
                        value={text}
                        onChangeText={handleTextChange}
                        textAlignVertical="top"
                    />
                </View>

                {/* Style Selection */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Handwriting Style</Text>
                    <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={() => setShowStylePicker(!showStylePicker)}
                    >
                        <View style={styles.pickerPreview}>
                            <View
                                style={[
                                    styles.colorDot,
                                    { backgroundColor: selectedStyle.ink_color },
                                ]}
                            />
                            <Text style={styles.pickerText}>
                                {getFontByName(selectedStyle.font)?.displayName || selectedStyle.font} • Size: {selectedStyle.size}px • Slant: {selectedStyle.slant}°
                            </Text>
                        </View>
                        <Text style={styles.pickerArrow}>▼</Text>
                    </TouchableOpacity>

                    {showStylePicker && (
                        <View style={styles.pickerOptions}>
                            {defaultHandwritingStyles.map((style, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.styleOption,
                                        selectedStyle === style && styles.styleOptionSelected,
                                    ]}
                                    onPress={() => {
                                        setSelectedStyle(style);
                                        setShowStylePicker(false);
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.colorDot,
                                            { backgroundColor: style.ink_color },
                                        ]}
                                    />
                                    <Text style={styles.styleOptionText}>
                                        Style {index + 1} • {style.size}px
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Font Selection */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Font</Text>
                    <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={() => setShowFontPicker(!showFontPicker)}
                    >
                        <Text style={styles.pickerText}>
                            {getFontByName(selectedStyle.font)?.displayName || selectedStyle.font}
                        </Text>
                        <Text style={styles.pickerArrow}>▼</Text>
                    </TouchableOpacity>

                    {showFontPicker && (
                        <View style={styles.pickerOptions}>
                            {availableFonts.map((font) => (
                                <TouchableOpacity
                                    key={font.name}
                                    style={[
                                        styles.styleOption,
                                        selectedStyle.font === font.name && styles.styleOptionSelected,
                                    ]}
                                    onPress={() => {
                                        setSelectedStyle({
                                            ...selectedStyle,
                                            font: font.name,
                                        });
                                        setShowFontPicker(false);
                                    }}
                                >
                                    <Text style={styles.styleOptionText}>{font.displayName}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Paper Selection */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Paper Style</Text>
                    <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={() => setShowPaperPicker(!showPaperPicker)}
                    >
                        <Text style={styles.pickerText}>{selectedPaper.name}</Text>
                        <Text style={styles.pickerArrow}>▼</Text>
                    </TouchableOpacity>

                    {showPaperPicker && (
                        <View style={styles.pickerOptions}>
                            {defaultPaperStyles.map((paper) => (
                                <TouchableOpacity
                                    key={paper.id}
                                    style={[
                                        styles.styleOption,
                                        selectedPaper.id === paper.id && styles.styleOptionSelected,
                                    ]}
                                    onPress={() => {
                                        setSelectedPaper(paper);
                                        setShowPaperPicker(false);
                                    }}
                                >
                                    <Text style={styles.styleOptionText}>{paper.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Preview Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.previewButton, !text && styles.previewButtonDisabled]}
                    onPress={handlePreview}
                    disabled={!text}
                >
                    <Text style={styles.previewButtonText}>Generate Preview ✨</Text>
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
        paddingVertical: 24,
        paddingHorizontal: 20,
        backgroundColor: '#6366f1',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#e0e7ff',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    statsCard: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#6366f1',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statDivider: {
        width: 1,
        backgroundColor: '#e5e7eb',
        marginHorizontal: 8,
    },
    inputCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 12,
    },
    textInput: {
        minHeight: 200,
        fontSize: 16,
        color: '#1f2937',
        lineHeight: 24,
    },
    pickerButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 12,
        padding: 16,
    },
    pickerPreview: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    colorDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 12,
        borderWidth: 2,
        borderColor: '#ffffff',
        elevation: 1,
    },
    pickerText: {
        fontSize: 14,
        color: '#1f2937',
        fontWeight: '500',
    },
    pickerArrow: {
        fontSize: 12,
        color: '#6b7280',
    },
    pickerOptions: {
        marginTop: 12,
    },
    styleOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        backgroundColor: '#f9fafb',
    },
    styleOptionSelected: {
        backgroundColor: '#eef2ff',
        borderWidth: 2,
        borderColor: '#6366f1',
    },
    styleOptionText: {
        fontSize: 14,
        color: '#1f2937',
        fontWeight: '500',
    },
    footer: {
        padding: 16,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    previewButton: {
        backgroundColor: '#6366f1',
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
    },
    previewButtonDisabled: {
        backgroundColor: '#9ca3af',
        opacity: 0.5,
    },
    previewButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
});
