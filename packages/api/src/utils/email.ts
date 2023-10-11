export function normaliseEmail(email: string): string {
    return email.trim().toLowerCase();
}

/**
 * Compare two emails
 *
 * @param email1 Email to compare
 * @param email2 Email to compare
 * @param strict If true, emails like me@mail.com and me+2@mail.com will not match
 * @returns boolean
 */
export function matchEmails(
    email1: string,
    email2: string,
    strict = true,
): boolean {
    return strict
        ? normaliseEmail(email1) === normaliseEmail(email2)
        : normaliseEmail(removeEmailModifier(email1)) ===
              normaliseEmail(removeEmailModifier(email2));
}

/**
 * Removes email modifiers
 *
 * **Example:**
 * ```js
 * removeEmailModifier('me+2@mail.com') // returns me@mail.com
 * ```
 *
 * @param email Email
 * @returns Email without the modifier
 */
export function removeEmailModifier(email: string): string {
    return email.replace(
        /([\w.\-_]+)\+[\w.\-_]+(@[\w.\-_]+\.[\w.\-_]+)/gm,
        '$1$2',
    );
}
