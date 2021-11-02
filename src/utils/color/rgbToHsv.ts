import {IHSVColor, IRGBColor} from "./types";

/**
 * Converts colors from the RGB to HSL color space
 * Adapted from https://stackoverflow.com/a/8023734
 * @returns {IHSVColor} - Color in RGB
 * @param rgb
 */
export default function rgbToHsv (rgb: IRGBColor): IHSVColor {
    const {r, g, b} = rgb;
    let rabs, gabs, babs, rr, gg, bb, h, s, v: number, diff: number, diffC, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs);
    diff = v - Math.min(rabs, gabs, babs);
    diffC = (c: number) => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = (num: number) => Math.round(num * 100) / 100;

    h = 0;
    if (diff === 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffC(rabs);
        gg = diffC(gabs);
        bb = diffC(babs);

        if (rabs === v) h = bb - gg;
        else if (gabs === v) h = (1 / 3) + rr - bb;
        else if (babs === v) h = (2 / 3) + gg - rr;
        if (h < 0) h += 1;
        else if (h > 1) h -= 1;
    }
    return {
        h: Math.round(h * 360),
        s: percentRoundFn(s * 100),
        v: percentRoundFn(v * 100)
    };
}