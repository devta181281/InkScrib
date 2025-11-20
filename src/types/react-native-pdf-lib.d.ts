declare module 'react-native-pdf-lib' {
    export class PDFDocument {
        static create(): Promise<PDFDocument>;
        addPage(size: [number, number]): PDFPage;
        embedJpg(base64: string): Promise<any>;
        save(): Promise<string>;
    }
    
    export class PDFPage {
        drawImage(image: any, options: { x: number; y: number; width: number; height: number }): void;
    }
}