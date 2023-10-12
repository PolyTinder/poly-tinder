export const HOME_ROUTE = '/';
export const SWIPING_ROUTE = '/swiping';
export const PROFILE_ROUTE = '/profile';
export const PROFILE_EDIT_ROUTE = '/profile-edit';
export const PROFILE_PREVIEW_ROUTE = '/profile-preview';
export const MATCHES_ROUTE = '/matches';
export const MATCHED_USER_ROUTE = '/matches/:id';

export const LOGIN_ROUTE = '/login';
export const SIGNUP_ROUTE = '/signup';
export const REQUEST_PASSWORD_RESET_ROUTE = '/request-password-reset';
export const PASSWORD_RESET_ROUTE = '/password-reset';

export const PUBLIC_ROUTES_PATH = [LOGIN_ROUTE, SIGNUP_ROUTE];
export const PUBLICLY_ACCESSIBLE_ROUTES_PATH = [
    LOGIN_ROUTE,
    SIGNUP_ROUTE,
    REQUEST_PASSWORD_RESET_ROUTE,
    PASSWORD_RESET_ROUTE,
];
export const NO_NAVIGATION_ROUTES_PATH = [MATCHED_USER_ROUTE];
