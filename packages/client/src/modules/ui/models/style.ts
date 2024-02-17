export type StyleColor = 'default' | 'danger';
export type StyleSize = 's' | 'default' | 'l' | 'xl' | 'xxl';

export interface Sides<T> {
    all?: T;
    t?: T;
    b?: T;
    l?: T;
    r?: T;
    h?: T;
    v?: T;
}

export interface Corners<T> {
    all?: T;
    t?: T;
    b?: T;
    l?: T;
    r?: T;
    tr?: T;
    tl?: T;
    br?: T;
    bl?: T;
}

export interface StyleAttributes {
    border?: boolean | StyleColor | Sides<boolean | StyleColor>;
    radius?: boolean | StyleSize | Corners<boolean | StyleSize>;
    padding?: boolean | StyleSize | Sides<boolean | StyleSize>;
    margin?: boolean | StyleSize | Sides<boolean | StyleSize>;
    gap?: boolean | StyleSize;
}

export interface Style extends StyleAttributes {
    mobile?: StyleAttributes;
    desktop?: StyleAttributes;
}
