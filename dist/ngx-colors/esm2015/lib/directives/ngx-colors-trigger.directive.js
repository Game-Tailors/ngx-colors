import { EventEmitter, Input, Output, Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { PanelFactoryService } from '../services/panel-factory.service';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
export class NgxColorsTriggerDirective {
    constructor(triggerRef, panelFactory) {
        this.triggerRef = triggerRef;
        this.panelFactory = panelFactory;
        //Main input/output of the color picker
        // @Input() color = '#000000';
        // @Output() colorChange:EventEmitter<string> = new EventEmitter<string>();
        this.color = '';
        //This defines the type of animation for the palatte.(slide-in | popup)
        this.colorsAnimation = 'slide-in';
        this.acceptLabel = 'ACCEPT';
        // This event is trigger every time the selected color change
        this.change = new EventEmitter();
        // This event is trigger every time the user change the color using the panel
        this.input = new EventEmitter();
        this.onTouchedCallback = () => { };
        this.onChangeCallback = () => { };
    }
    onClick() {
        this.open();
    }
    open() {
        this.panelRef = this.panelFactory.createPanel();
        this.panelRef.instance.iniciate(this, this.triggerRef, this.color, this.palette, this.colorsAnimation, this.format, this.hideTextInput, this.hideColorPicker, this.acceptLabel);
    }
    close() {
        this.panelFactory.removePanel();
    }
    onChange() {
        this.onChangeCallback(this.color);
    }
    setColor(color) {
        this.writeValue(color);
        this.input.emit(color);
    }
    get value() {
        return this.color;
    }
    set value(value) {
        this.setColor(value);
        this.onChangeCallback(value);
    }
    writeValue(value) {
        if (value !== this.color) {
            this.color = value;
            this.onChange();
            this.change.emit(value);
        }
    }
    registerOnChange(fn) {
        this.onChangeCallback = fn;
    }
    registerOnTouched(fn) {
        this.onTouchedCallback = fn;
    }
}
NgxColorsTriggerDirective.decorators = [
    { type: Directive, args: [{
                selector: '[ngx-colors-trigger]',
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => NgxColorsTriggerDirective),
                        multi: true
                    }
                ]
            },] }
];
NgxColorsTriggerDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: PanelFactoryService }
];
NgxColorsTriggerDirective.propDecorators = {
    colorsAnimation: [{ type: Input }],
    palette: [{ type: Input }],
    format: [{ type: Input }],
    hideTextInput: [{ type: Input }],
    hideColorPicker: [{ type: Input }],
    acceptLabel: [{ type: Input }],
    change: [{ type: Output }],
    input: [{ type: Output }],
    onClick: [{ type: HostListener, args: ['click',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWNvbG9ycy10cmlnZ2VyLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1jb2xvcnMvc3JjL2xpYi9kaXJlY3RpdmVzL25neC1jb2xvcnMtdHJpZ2dlci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQWdCLFlBQVksRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUgsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFFeEUsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBYXpFLE1BQU0sT0FBTyx5QkFBeUI7SUE2QnBDLFlBQ1UsVUFBcUIsRUFDckIsWUFBZ0M7UUFEaEMsZUFBVSxHQUFWLFVBQVUsQ0FBVztRQUNyQixpQkFBWSxHQUFaLFlBQVksQ0FBb0I7UUE1QjFDLHVDQUF1QztRQUN2Qyw4QkFBOEI7UUFDOUIsMkVBQTJFO1FBRTNFLFVBQUssR0FBRyxFQUFFLENBQUM7UUFHWCx1RUFBdUU7UUFDOUQsb0JBQWUsR0FBd0IsVUFBVSxDQUFDO1FBUWxELGdCQUFXLEdBQVUsUUFBUSxDQUFDO1FBQ3ZDLDZEQUE2RDtRQUNuRCxXQUFNLEdBQXdCLElBQUksWUFBWSxFQUFVLENBQUM7UUFDbkUsNkVBQTZFO1FBQ25FLFVBQUssR0FBd0IsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQWVsRSxzQkFBaUIsR0FBZSxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUM7UUFDekMscUJBQWdCLEdBQXFCLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztJQUw5QyxDQUFDO0lBUnNCLE9BQU87UUFDNUIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQWNELElBQUk7UUFDRixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDaEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksRUFBQyxJQUFJLENBQUMsVUFBVSxFQUFDLElBQUksQ0FBQyxLQUFLLEVBQUMsSUFBSSxDQUFDLE9BQU8sRUFBQyxJQUFJLENBQUMsZUFBZSxFQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM1SyxDQUFDO0lBRU0sS0FBSztRQUNWLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVNLFFBQVE7UUFDYixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFHTSxRQUFRLENBQUMsS0FBSztRQUNuQixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDTCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUVELElBQUksS0FBSyxDQUFDLEtBQVk7UUFDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUdELFVBQVUsQ0FBQyxLQUFLO1FBQ2QsSUFBRyxLQUFLLEtBQUssSUFBSSxDQUFDLEtBQUssRUFBQztZQUN0QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNuQixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDaEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDekI7SUFDSCxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsRUFBTztRQUN0QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxFQUFPO1FBQ3JCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7SUFDaEMsQ0FBQzs7O1lBL0ZGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsc0JBQXNCO2dCQUNoQyxTQUFTLEVBQUU7b0JBQ1Q7d0JBQ0UsT0FBTyxFQUFFLGlCQUFpQjt3QkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQzt3QkFDeEQsS0FBSyxFQUFFLElBQUk7cUJBQ1o7aUJBQ0Y7YUFDRjs7O1lBZitDLFVBQVU7WUFDakQsbUJBQW1COzs7OEJBMEJ6QixLQUFLO3NCQUdMLEtBQUs7cUJBRUwsS0FBSzs0QkFDTCxLQUFLOzhCQUNMLEtBQUs7MEJBQ0wsS0FBSztxQkFFTCxNQUFNO29CQUVOLE1BQU07c0JBR04sWUFBWSxTQUFDLE9BQU8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIsSW5wdXQsIE91dHB1dCwgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBDb21wb25lbnRSZWYsIEhvc3RMaXN0ZW5lciwgZm9yd2FyZFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBQYW5lbEZhY3RvcnlTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvcGFuZWwtZmFjdG9yeS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUGFuZWxDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnRzL3BhbmVsL3BhbmVsLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgTmd4Q29sb3IgfSBmcm9tICcuLi9jbGFzZXMvY29sb3InO1xyXG5cclxuQERpcmVjdGl2ZSh7XHJcbiAgc2VsZWN0b3I6ICdbbmd4LWNvbG9ycy10cmlnZ2VyXScsXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgICB7IFxyXG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcclxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmd4Q29sb3JzVHJpZ2dlckRpcmVjdGl2ZSksXHJcbiAgICAgIG11bHRpOiB0cnVlXHJcbiAgICB9XHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmd4Q29sb3JzVHJpZ2dlckRpcmVjdGl2ZSBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29ye1xyXG5cclxuXHJcbiAgLy9NYWluIGlucHV0L291dHB1dCBvZiB0aGUgY29sb3IgcGlja2VyXHJcbiAgLy8gQElucHV0KCkgY29sb3IgPSAnIzAwMDAwMCc7XHJcbiAgLy8gQE91dHB1dCgpIGNvbG9yQ2hhbmdlOkV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XHJcblxyXG4gIGNvbG9yID0gJyc7XHJcblxyXG5cclxuICAvL1RoaXMgZGVmaW5lcyB0aGUgdHlwZSBvZiBhbmltYXRpb24gZm9yIHRoZSBwYWxhdHRlLihzbGlkZS1pbiB8IHBvcHVwKVxyXG4gIEBJbnB1dCgpIGNvbG9yc0FuaW1hdGlvbjonc2xpZGUtaW4nIHwgJ3BvcHVwJyA9ICdzbGlkZS1pbic7XHJcblxyXG4gIC8vVGhpcyBpcyB1c2VkIHRvIHNldCBhIGN1c3RvbSBwYWxldHRlIG9mIGNvbG9ycyBpbiB0aGUgcGFuZWw7XHJcbiAgQElucHV0KCkgcGFsZXR0ZTpBcnJheTxzdHJpbmc+IHwgQXJyYXk8Tmd4Q29sb3I+O1xyXG5cclxuICBASW5wdXQoKSBmb3JtYXQ6c3RyaW5nO1xyXG4gIEBJbnB1dCgpIGhpZGVUZXh0SW5wdXQ6Ym9vbGVhbjtcclxuICBASW5wdXQoKSBoaWRlQ29sb3JQaWNrZXI6Ym9vbGVhbjtcclxuICBASW5wdXQoKSBhY2NlcHRMYWJlbDpzdHJpbmcgPSAnQUNDRVBUJztcclxuICAvLyBUaGlzIGV2ZW50IGlzIHRyaWdnZXIgZXZlcnkgdGltZSB0aGUgc2VsZWN0ZWQgY29sb3IgY2hhbmdlXHJcbiAgQE91dHB1dCgpIGNoYW5nZTpFdmVudEVtaXR0ZXI8c3RyaW5nPiA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xyXG4gIC8vIFRoaXMgZXZlbnQgaXMgdHJpZ2dlciBldmVyeSB0aW1lIHRoZSB1c2VyIGNoYW5nZSB0aGUgY29sb3IgdXNpbmcgdGhlIHBhbmVsXHJcbiAgQE91dHB1dCgpIGlucHV0OkV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XHJcblxyXG5cclxuICBASG9zdExpc3RlbmVyKCdjbGljaycpIG9uQ2xpY2soKXtcclxuICAgIHRoaXMub3BlbigpO1xyXG4gIH1cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgdHJpZ2dlclJlZjpFbGVtZW50UmVmLFxyXG4gICAgcHJpdmF0ZSBwYW5lbEZhY3Rvcnk6UGFuZWxGYWN0b3J5U2VydmljZSxcclxuICApIFxyXG4gIHtcclxuICB9XHJcblxyXG4gIHBhbmVsUmVmOkNvbXBvbmVudFJlZjxQYW5lbENvbXBvbmVudD5cclxuXHJcbiAgb25Ub3VjaGVkQ2FsbGJhY2s6ICgpID0+IHZvaWQgPSAoKSA9PiB7fTtcclxuICBvbkNoYW5nZUNhbGxiYWNrOiAoXzogYW55KSA9PiB2b2lkID0gKCkgPT4ge307XHJcblxyXG5cclxuICBvcGVuKCl7XHJcbiAgICB0aGlzLnBhbmVsUmVmID0gdGhpcy5wYW5lbEZhY3RvcnkuY3JlYXRlUGFuZWwoKTtcclxuICAgIHRoaXMucGFuZWxSZWYuaW5zdGFuY2UuaW5pY2lhdGUodGhpcyx0aGlzLnRyaWdnZXJSZWYsdGhpcy5jb2xvcix0aGlzLnBhbGV0dGUsdGhpcy5jb2xvcnNBbmltYXRpb24sdGhpcy5mb3JtYXQsIHRoaXMuaGlkZVRleHRJbnB1dCwgdGhpcy5oaWRlQ29sb3JQaWNrZXIsdGhpcy5hY2NlcHRMYWJlbCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY2xvc2UoKXtcclxuICAgIHRoaXMucGFuZWxGYWN0b3J5LnJlbW92ZVBhbmVsKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb25DaGFuZ2UoKXtcclxuICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayh0aGlzLmNvbG9yKTtcclxuICB9XHJcblxyXG5cclxuICBwdWJsaWMgc2V0Q29sb3IoY29sb3Ipe1xyXG4gICAgdGhpcy53cml0ZVZhbHVlKGNvbG9yKTtcclxuICAgIHRoaXMuaW5wdXQuZW1pdChjb2xvcik7XHJcbiAgfVxyXG5cclxuICBnZXQgdmFsdWUoKTpzdHJpbmd7XHJcbiAgICAgIHJldHVybiB0aGlzLmNvbG9yO1xyXG4gIH1cclxuXHJcbiAgc2V0IHZhbHVlKHZhbHVlOnN0cmluZyl7XHJcbiAgICAgIHRoaXMuc2V0Q29sb3IodmFsdWUpO1xyXG4gICAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sodmFsdWUpO1xyXG4gIH1cclxuXHJcblxyXG4gIHdyaXRlVmFsdWUodmFsdWUpe1xyXG4gICAgaWYodmFsdWUgIT09IHRoaXMuY29sb3Ipe1xyXG4gICAgICB0aGlzLmNvbG9yID0gdmFsdWU7XHJcbiAgICAgIHRoaXMub25DaGFuZ2UoKTtcclxuICAgICAgdGhpcy5jaGFuZ2UuZW1pdCh2YWx1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpIHtcclxuICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayA9IGZuO1xyXG4gIH1cclxuXHJcbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSkge1xyXG4gICAgICB0aGlzLm9uVG91Y2hlZENhbGxiYWNrID0gZm47XHJcbiAgfVxyXG5cclxuXHJcbn1cclxuIl19