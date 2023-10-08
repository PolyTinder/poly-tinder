export const EMAIL_VALIDATION_URL_REGEX =
    /\/verify-email\?(?:.+&)?(?:token=(?<token>[a-zA-Z0-9._-]+))/gm;
export const EMAIL_VALIDATION_TOKEN_KEY = 'email-verification-token';
