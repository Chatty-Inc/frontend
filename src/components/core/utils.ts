import Color from "../../utils/vendor/color/color";

/**
 * Get the appropriate text color based on the background.
 * Ensures the text color always contrasts the background.
 * @param {string} bgCol
 * @param {string} txtCol
 * @param {boolean} darkTheme
 * @returns {string}
 */
export function getTextColFromBg(bgCol: string, txtCol: string, darkTheme: boolean = true): string {
    return Color(bgCol).isLight()
        ? (darkTheme ? Color(txtCol).negate().toString() : txtCol)
        : (darkTheme ? txtCol : Color(txtCol).negate().toString())
}