import { MATCHES_ROUTE, PROFILE_ROUTE, SWIPING_ROUTE } from "./routes";

export const NAVIGATION = [
    {
        text: 'Découvrir',
        href: SWIPING_ROUTE,
        icon: 'telescope'
    },
    {
        text: 'Mes matchs',
        href: MATCHES_ROUTE,
        icon: 'comment'
    },
    {
        text: 'Mon profil',
        href: PROFILE_ROUTE,
        icon: 'user',
    }
]