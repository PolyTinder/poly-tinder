import { UiModule } from 'src/modules/ui/ui.module';
import { AuthenticationLayoutComponent } from '../components/authentication-layout/authentication-layout.component';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const meta: Meta<AuthenticationLayoutComponent> = {
    title: 'Authentication/Layout',
    component: AuthenticationLayoutComponent,
    decorators: [
        moduleMetadata({
            imports: [
                UiModule,
                BrowserAnimationsModule,
                RouterTestingModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatInputModule,
            ],
        }),
    ],
    args: {
        name: 'Authentication',
        description: 'Authentication description',
        formGroup: new FormGroup({
            email: new FormControl('', []),
        }),
        loading: false,
        disabled: false,
    },
    argTypes: {
        loading: {
            type: 'boolean',
        },
        disabled: {
            type: 'boolean',
        },
        formGroup: {
            table: {
                disable: true,
            },
        },
        formsErrors: {
            table: {
                disable: true,
            },
        },
    },
    parameters: {
        layout: 'fullscreen',
    },
    render: (args: AuthenticationLayoutComponent) => ({
        props: args,
        template: `
            <app-authentication-layout
                [name]="name"
                [description]="description"
                [formGroup]="formGroup"
                [loading]="loading"
                [disabled]="disabled"
            >
                <mat-form-field auth-form-field>
                    <mat-label><i class="fas fa-envelope"></i> Email</mat-label>
                    <input formControlName="email" matInput>
                </mat-form-field>
            </app-authentication-layout>
        `,
    }),
};

export default meta;
type Story = StoryObj<AuthenticationLayoutComponent>;

export const Default: Story = {};
