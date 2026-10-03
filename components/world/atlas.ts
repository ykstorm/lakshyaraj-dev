// Pre-rendered glyph sprites. Setting ctx.font per glyph is the slow path in
// Canvas 2D, so every character is drawn once per colour at two base sizes and
// each frame is a run of drawImage calls from this sheet.

const BASES = [13, 26] as const;
const PAD = 1.3; // sprite cell = base × PAD, room for ascenders and descenders

export class GlyphAtlas {
  readonly sheet: HTMLCanvasElement;
  private readonly stride: number;
  private readonly cells: number[];
  private readonly rowY: number[][]; // [base][colour] → y offset in the sheet

  constructor(chars: string, family: string, colours: string[], dpr: number) {
    this.cells = BASES.map((b) => Math.ceil(b * PAD * dpr));
    this.stride = Math.max(...this.cells);
    this.rowY = [];
    let y = 0;
    for (let b = 0; b < BASES.length; b++) {
      this.rowY.push(colours.map(() => {
        const at = y;
        y += this.cells[b];
        return at;
      }));
    }

    this.sheet = document.createElement('canvas');
    this.sheet.width = chars.length * this.stride;
    this.sheet.height = y;
    const ctx = this.sheet.getContext('2d');
    if (!ctx) return;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let b = 0; b < BASES.length; b++) {
      ctx.font = `500 ${BASES[b] * dpr}px ${family}`;
      const cell = this.cells[b];
      colours.forEach((colour, k) => {
        ctx.fillStyle = colour;
        for (let i = 0; i < chars.length; i++) {
          if (chars[i] === ' ') continue;
          ctx.fillText(chars[i], i * this.stride + cell / 2, this.rowY[b][k] + cell / 2);
        }
      });
    }
  }

  /** Draws glyph `index` in colour `colour`, centred on (x, y), `size` CSS px tall. */
  draw(ctx: CanvasRenderingContext2D, index: number, colour: number, x: number, y: number, size: number): void {
    const b = size <= BASES[0] * 1.15 ? 0 : 1;
    const cell = this.cells[b];
    const d = size * PAD; // sprite cell scaled so its glyph is `size` tall
    ctx.drawImage(this.sheet, index * this.stride, this.rowY[b][colour], cell, cell, x - d / 2, y - d / 2, d, d);
  }
}
