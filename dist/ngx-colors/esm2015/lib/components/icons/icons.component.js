import { Component, Input } from '@angular/core';
export class IconsComponent {
    constructor() { }
    ngOnInit() {
    }
}
IconsComponent.decorators = [
    { type: Component, args: [{
                selector: 'icons',
                template: "<ng-container *ngIf=\"icon == 'add'\">\r\n    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z\"/><path d=\"M0 0h24v24H0z\" fill=\"none\"/></svg>\r\n</ng-container>\r\n<ng-container *ngIf=\"icon == 'back'\">\r\n    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z\"/></svg>\r\n</ng-container>",
                styles: [""]
            },] }
];
IconsComponent.ctorParameters = () => [];
IconsComponent.propDecorators = {
    icon: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbnMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWNvbG9ycy9zcmMvbGliL2NvbXBvbmVudHMvaWNvbnMvaWNvbnMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBT3pELE1BQU0sT0FBTyxjQUFjO0lBRXpCLGdCQUFnQixDQUFDO0lBSWpCLFFBQVE7SUFDUixDQUFDOzs7WUFaRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLE9BQU87Z0JBQ2pCLGtpQkFBcUM7O2FBRXRDOzs7O21CQUtFLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnaWNvbnMnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9pY29ucy5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vaWNvbnMuY29tcG9uZW50LmNzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBJY29uc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkgeyB9XHJcblxyXG4gIEBJbnB1dCgpIGljb246IHN0cmluZztcclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=