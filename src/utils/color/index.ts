import {IHSVColor, IRGBColor} from "./types";
import rgbToHsv from "./rgbToHsv";

/**
 * Returns the brightest and most vibrant color
 * from an array of RGB colors
 * @param {IRGBColor[]} colors
 * @returns {IRGBColor} -
 */
export function mostVibrant(colors: IRGBColor[]): IRGBColor {
    let bestCol: IRGBColor = colors[0],
        bestScore: number = -1;

    colors.forEach(c => {
        const hsv: IHSVColor = rgbToHsv(c);
        const score = (hsv.s / 4) * hsv.v;
        if (score > bestScore) {
            bestScore = score;
            bestCol = c;
        }
    });

    return bestCol;
}