// The glyphs the hero world is drawn in, in their atlas order. A module of its
// own so the footer can share them without pulling the engine, which loads
// lazily with the canvas, into the first load.
export const CHARS = ' .·:-_/\\^~+';
