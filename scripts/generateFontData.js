const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, '../assets/fonts');
const outputFile = path.join(__dirname, '../src/utils/fontData.ts');

const fontFiles = [
    'QEBradenHill.ttf',
    'QEDaveMergens.ttf',
    'QEDavidReid.ttf',
    'QEDonaldRoss.ttf',
    'QERuthStafford.ttf',
];

let output = '// Auto-generated file - do not edit manually\n';
output += '// Generated from fonts in assets/fonts/\n\n';
output += 'export const fontDataBase64: { [key: string]: string } = {\n';

fontFiles.forEach((fontFile, index) => {
    const fontPath = path.join(fontsDir, fontFile);
    const fontData = fs.readFileSync(fontPath);
    const base64 = fontData.toString('base64');
    const fontName = fontFile.replace('.ttf', '');

    output += `    '${fontName}': '${base64}'`;
    if (index < fontFiles.length - 1) {
        output += ',';
    }
    output += '\n';

    console.log(`Converted ${fontFile} (${(base64.length / 1024).toFixed(2)} KB)`);
});

output += '};\n';

fs.writeFileSync(outputFile, output);
console.log(`\nFont data written to ${outputFile}`);
console.log(`Total size: ${(output.length / 1024).toFixed(2)} KB`);
