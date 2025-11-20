export interface HandwritingStyle {
  font: string;
  size: number;
  slant: number; // degrees of tilt
  spacing_line: number; // multiplier
  spacing_word: number; // multiplier
  ink_color: string; // hex color
}

export interface PaperStyle {
  id: string;
  name: string;
  image: any; // require() path
}

export interface DocumentState {
  text: string;
  style: HandwritingStyle;
  paper: PaperStyle;
}

export interface CharacterPosition {
  char: string;
  x: number;
  y: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
}

export interface PageData {
  lines: string[];
  pageNumber: number;
}
