/**
 * Text diff utilities using Longest Common Subsequence (LCS) algorithm.
 */

function textsMatch(a: string, b: string, ignoreWS: boolean, ignoreC: boolean): boolean {
    let a2 = a, b2 = b;
    if (ignoreWS) {
        a2 = a2.replace(/\s+/g, '').trim();
        b2 = b2.replace(/\s+/g, '').trim();
    }
    if (ignoreC) {
        a2 = a2.toLowerCase();
        b2 = b2.toLowerCase();
    }
    return a2 === b2;
}

function computeLCS(
    arr1: string[],
    arr2: string[],
    ignoreWS: boolean,
    ignoreC: boolean
): string[] {
    const m = arr1.length;
    const n = arr2.length;
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (textsMatch(arr1[i - 1], arr2[j - 1], ignoreWS, ignoreC)) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    const lcs: string[] = [];
    let i = m, j = n;
    while (i > 0 && j > 0) {
        if (textsMatch(arr1[i - 1], arr2[j - 1], ignoreWS, ignoreC)) {
            lcs.unshift(arr1[i - 1]);
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }
    return lcs;
}

/**
 * Compute a word-level diff between two texts.
 * Returns an HTML string with `<ins>` (added) and `<del>` (deleted) tags.
 */
export function computeWordDiff(
    text1: string,
    text2: string,
    ignoreWhitespace: boolean,
    ignoreCase: boolean
): string {
    const words1 = text1.split(/(\s+)/);
    const words2 = text2.split(/(\s+)/);

    const lcs = computeLCS(words1, words2, ignoreWhitespace, ignoreCase);
    const result: string[] = [];
    let i = 0, j = 0;

    for (const word of lcs) {
        while (i < words1.length && !textsMatch(words1[i], word, ignoreWhitespace, ignoreCase)) {
            result.push(`<del>${words1[i]}</del>`);
            i++;
        }
        while (j < words2.length && !textsMatch(words2[j], word, ignoreWhitespace, ignoreCase)) {
            result.push(`<ins>${words2[j]}</ins>`);
            j++;
        }
        result.push(words1[i]);
        i++;
        j++;
    }

    while (i < words1.length) {
        result.push(`<del>${words1[i]}</del>`);
        i++;
    }
    while (j < words2.length) {
        result.push(`<ins>${words2[j]}</ins>`);
        j++;
    }

    return result.join('');
}

/**
 * Normalize text based on options.
 */
export function normalizeText(text: string, ignoreWhitespace: boolean, ignoreCase: boolean): string {
    let result = text;
    if (ignoreWhitespace) {
        result = result.replace(/\s+/g, ' ').trim();
    }
    if (ignoreCase) {
        result = result.toLowerCase();
    }
    return result;
}
