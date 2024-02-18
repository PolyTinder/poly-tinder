import { MATCHES_ROUTE, PROFILE_ROUTE, SWIPING_ROUTE } from './routes';

export interface NavigationItem {
    text: string;
    shortText: string;
    href: string;
    icon: string;
}

export const NAVIGATION: NavigationItem[] = [
    {
        text: 'Découvrir',
        shortText: 'Découvrir',
        href: SWIPING_ROUTE,
        icon: 'telescope',
    },
    {
        text: 'Mes matchs',
        shortText: 'Matchs',
        href: MATCHES_ROUTE,
        icon: 'comment',
    },
    {
        text: 'Mon profil',
        shortText: 'Profil',
        href: PROFILE_ROUTE,
        icon: 'user',
    },
];

export const NAVIGATION_NOT_LOGGED_IN: NavigationItem[] = [
    {
        text: 'Se connecter',
        shortText: 'Connexion',
        href: '/login',
        icon: 'sign-in',
    },
    {
        text: "S'inscrire",
        shortText: "S'inscrire",
        href: '/signup',
        icon: 'user-plus',
    },
    {
        text: 'À propos',
        shortText: 'À propos',
        href: '/about',
        icon: 'info-circle',
    },
];
