import { MATCHES_ROUTE, PROFILE_ROUTE, SWIPING_ROUTE } from './routes';

export const NAVIGATION = [
    {
        text: 'Découvrir',
        href: SWIPING_ROUTE,
        icon: 'telescope',
    },
    {
        text: 'Mes matchs',
        href: MATCHES_ROUTE,
        icon: 'comment',
    },
    {
        text: 'Mon profil',
        href: PROFILE_ROUTE,
        icon: 'user',
    },
];

export const NAVIGATION_NOT_LOGGED_IN = [
    {
        text: 'Se connecter',
        href: '/login',
        icon: 'sign-in',
    },
    {
        text: 'S\'inscrire',
        href: '/signup',
        icon: 'user-plus',
    },
    {
        text: 'À propos',
        href: '/about',
        icon: 'info-circle',
    }
];