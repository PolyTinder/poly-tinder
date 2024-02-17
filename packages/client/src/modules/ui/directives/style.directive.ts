import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Style, StyleAttributes } from '../models/style';

@Directive({
    selector: '[appStyle]',
})
export class StyleDirective implements OnInit {
    @Input() appStyle: Style = {};

    constructor(
        private renderer: Renderer2,
        private hostElement: ElementRef,
    ) {}

    ngOnInit(): void {
        for (const className of this.getClasses()) {
            this.renderer.addClass(this.hostElement.nativeElement, className);
        }
    }

    private getClasses(): string[] {
        let classesList: string[] = this.getClassesForAttributes(this.appStyle);
        if (this.appStyle.mobile) {
            classesList = [
                ...classesList,
                ...this.getClassesForAttributes(
                    this.appStyle.mobile,
                    'app-style--m--',
                ),
            ];
        }

        if (this.appStyle.desktop) {
            classesList = [
                ...classesList,
                ...this.getClassesForAttributes(
                    this.appStyle.desktop,
                    'app-style--d--',
                ),
            ];
        }

        return classesList;
    }

    private getClassesForAttributes(
        attributes: StyleAttributes,
        prefix: string = 'app-style--',
    ): string[] {
        let classesList: string[] = [];

        classesList = [
            ...classesList,
            ...this.resolveComposedAttr('border', attributes.border, prefix),
        ];

        classesList = [
            ...classesList,
            ...this.resolveComposedAttr('radius', attributes.radius, prefix),
        ];

        classesList = [
            ...classesList,
            ...this.resolveComposedAttr('padding', attributes.padding, prefix),
        ];

        classesList = [
            ...classesList,
            ...this.resolveComposedAttr('margin', attributes.margin, prefix),
        ];

        if (attributes.gap) {
            classesList.push(prefix + this.resolveAttr('gap', attributes.gap));
        }

        return classesList;
    }

    private resolveComposedAttr(
        attr: string,
        value: boolean | string | object | undefined,
        prefix: string,
    ): string[] {
        const classesList: string[] = [];

        if (typeof value === 'object') {
            for (const [a, v] of Object.entries(value)) {
                classesList.push(prefix + this.resolveAttr(attr, v, `${a}--`));
            }
        } else if (value) {
            classesList.push(prefix + this.resolveAttr(attr, value, 'all--'));
        }

        return classesList;
    }

    private resolveAttr(
        attr: string,
        value: boolean | string,
        infix: string = '',
    ): string {
        if (value === true) {
            return `${attr}--${infix}default`;
        } else if (value === false) {
            return `${attr}--${infix}none`;
        } else if (typeof value === 'string') {
            return `${attr}--${infix}${value}`;
        } else {
            throw new Error(
                `Invalid type for attribute ${attr}. Value received: ${value}`,
            );
        }
    }
}
