import { Component, HostListener, HostBinding } from '@angular/core';
import { trigger, transition, query, style, stagger, animate, keyframes } from '@angular/animations';
import { ColorFormats } from '../../enums/formats';
import { ConverterService } from '../../services/converter.service';
import { defaultColors } from '../../helpers/default-colors';
import { formats } from '../../helpers/formats';
import { Hsva } from '../../clases/formats';
export class PanelComponent {
    constructor(service) {
        this.service = service;
        this.color = '#000000';
        this.previewColor = '#000000';
        this.hsva = new Hsva(0, 1, 1, 1);
        this.colorsAnimationEffect = 'slide-in';
        this.palette = defaultColors;
        this.variants = [];
        this.colorFormats = formats;
        this.format = ColorFormats.HEX;
        this.canChangeFormat = true;
        this.menu = 1;
        this.hideColorPicker = false;
        this.hideTextInput = false;
    }
    click(event) {
        if (this.isOutside(event)) {
            this.emitClose();
        }
    }
    onScroll() {
        this.setPosition();
    }
    onResize() {
        this.setPosition();
    }
    ngOnInit() {
        this.setPosition();
        this.hsva = this.service.stringToHsva(this.color);
    }
    iniciate(triggerInstance, triggerElementRef, color, palette, animation, format, hideTextInput, hideColorPicker, acceptLabel) {
        this.triggerInstance = triggerInstance;
        this.triggerElementRef = triggerElementRef;
        this.color = color;
        this.hideColorPicker = hideColorPicker;
        this.hideTextInput = hideTextInput;
        this.acceptLabel = acceptLabel;
        if (format) {
            if (formats.includes(format)) {
                this.format = formats.indexOf(format.toLowerCase());
                this.canChangeFormat = false;
                if (this.service.getFormatByString(this.color) != format.toLowerCase()) {
                    this.setColor(this.service.stringToHsva(this.color));
                }
            }
            else {
                console.error('Format provided is invalid, using HEX');
                this.format = ColorFormats.HEX;
            }
        }
        else {
            this.format = formats.indexOf(this.service.getFormatByString(this.color));
        }
        this.previewColor = this.color;
        this.palette = palette !== null && palette !== void 0 ? palette : defaultColors;
        this.colorsAnimationEffect = animation;
    }
    setPosition() {
        if (this.triggerElementRef) {
            var viewportOffset = this.triggerElementRef.nativeElement.getBoundingClientRect();
            this.top = viewportOffset.top + viewportOffset.height;
            this.left = viewportOffset.left + 250 > window.innerWidth ? viewportOffset.right - 250 : viewportOffset.left;
        }
    }
    hasVariant(color) {
        if (!this.previewColor) {
            return false;
        }
        return typeof color != 'string' && color.variants.some(v => v.toUpperCase() == this.previewColor.toUpperCase());
    }
    isSelected(color) {
        if (!this.previewColor) {
            return false;
        }
        return typeof color == 'string' && color.toUpperCase() == this.previewColor.toUpperCase();
    }
    getBackgroundColor(color) {
        if (typeof color == 'string') {
            return { 'background': color };
        }
        else {
            return { 'background': color.preview };
        }
    }
    /**
     * Change color from default colors
     * @param string color
     */
    changeColor(color) {
        this.setColor(this.service.stringToHsva(color));
        // this.triggerInstance.onChange();
        this.emitClose();
    }
    onChangeColorPicker(event) {
        this.setColor(event);
        // this.triggerInstance.onChange();
    }
    changeColorManual(color) {
        this.previewColor = color;
        this.color = color;
        this.hsva = this.service.stringToHsva(color);
        this.triggerInstance.setColor(this.color);
        // this.triggerInstance.onChange();
    }
    setColor(value) {
        this.hsva = value;
        this.color = this.service.toFormat(value, this.format);
        this.setPreviewColor(value);
        this.triggerInstance.setColor(this.color);
    }
    setPreviewColor(value) {
        this.previewColor = this.service.hsvaToRgba(value).toString();
    }
    onChange() {
        // this.triggerInstance.onChange();
    }
    showColors() {
        this.menu = 1;
    }
    onColorClick(color) {
        if (typeof color == 'string') {
            this.changeColor(color);
        }
        else {
            this.variants = color.variants;
            this.menu = 2;
        }
    }
    addColor() {
        this.menu = 3;
    }
    nextFormat() {
        if (this.canChangeFormat) {
            this.format = (this.format + 1) % this.colorFormats.length;
            this.setColor(this.hsva);
        }
    }
    emitClose() {
        this.triggerInstance.close();
    }
    isOutside(event) {
        return event.target.classList.contains('ngx-colors-overlay');
    }
}
PanelComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-colors-panel',
                template: "<div class=\"opened\" #dialog>\r\n  <ng-container *ngIf=\"menu == 1\">\r\n    <div class=\"colors\" [@colorsAnimation]=\"colorsAnimationEffect\">\r\n      <ng-container *ngFor=\"let color of palette\">\r\n        <div class=\"circle wrapper color\">\r\n          <div\r\n            (click)=\"onColorClick(color)\"\r\n            class=\"circle color circle-border\"\r\n            [ngStyle]=\"getBackgroundColor(color)\"\r\n          >\r\n            <div\r\n              *ngIf=\"hasVariant(color) || isSelected(color)\"\r\n              class=\"selected\"\r\n            ></div>\r\n          </div>\r\n        </div>\r\n      </ng-container>\r\n      <div (click)=\"addColor()\" *ngIf=\"!hideColorPicker\" class=\"circle button\">\r\n        <div class=\"add\">\r\n          <icons icon=\"add\"></icons>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </ng-container>\r\n  <ng-container *ngIf=\"menu == 2\">\r\n    <div class=\"colors\" [@colorsAnimation]=\"colorsAnimationEffect\">\r\n      <div class=\"circle wrapper\">\r\n        <div (click)=\"showColors()\" class=\"add\">\r\n          <icons icon=\"back\"></icons>\r\n        </div>\r\n      </div>\r\n\r\n      <ng-container *ngFor=\"let variant of variants\">\r\n        <div class=\"circle wrapper color\">\r\n          <div\r\n            (click)=\"changeColor(variant)\"\r\n            class=\"circle circle-border\"\r\n            [ngStyle]=\"{ background: variant }\"\r\n          >\r\n            <div *ngIf=\"isSelected(variant)\" class=\"selected\"></div>\r\n          </div>\r\n        </div>\r\n      </ng-container>\r\n    </div>\r\n  </ng-container>\r\n  <ng-container *ngIf=\"menu == 3\">\r\n    <div class=\"nav-wrapper\">\r\n      <div\r\n        (click)=\"showColors()\"\r\n        class=\"round-button button\"\r\n        style=\"float: left\"\r\n      >\r\n        <icons icon=\"back\"></icons>\r\n      </div>\r\n      <button (click)=\"emitClose()\" style=\"float: right\">\r\n        {{ acceptLabel }}\r\n      </button>\r\n    </div>\r\n    <div class=\"color-picker-wrapper\">\r\n      <!-- <span [(colorPicker)]=\"color\"></span> -->\r\n      <color-picker\r\n        [color]=\"hsva\"\r\n        (colorChange)=\"onChangeColorPicker($event)\"\r\n      ></color-picker>\r\n    </div>\r\n  </ng-container>\r\n  <div class=\"manual-input-wrapper\" *ngIf=\"!hideTextInput\">\r\n    <p (click)=\"nextFormat()\">{{ colorFormats[format] }}</p>\r\n    <div class=\"g-input\">\r\n      <input\r\n        placeholder=\"#FFFFFF\"\r\n        type=\"text\"\r\n        [value]=\"color\"\r\n        [style.font-size.px]=\"color && color.length > 23 ? 9 : 10\"\r\n        [style.letter-spacing.px]=\"color && color.length > 16 ? 0 : 1.5\"\r\n        (keyup)=\"changeColorManual(paintInput.value)\"\r\n        (keydown.enter)=\"emitClose()\"\r\n        #paintInput\r\n      />\r\n    </div>\r\n  </div>\r\n</div>\r\n",
                animations: [
                    trigger('colorsAnimation', [
                        transition('void => slide-in', [
                            // Initially all colors are hidden
                            query(':enter', style({ opacity: 0 }), { optional: true }),
                            //slide-in animation
                            query(':enter', stagger('10ms', [
                                animate('.3s ease-in', keyframes([
                                    style({ opacity: 0, transform: 'translatex(-50%)', offset: 0 }),
                                    style({ opacity: .5, transform: 'translatex(-10px) scale(1.1)', offset: 0.3 }),
                                    style({ opacity: 1, transform: 'translatex(0)', offset: 1 }),
                                ]))
                            ]), { optional: true }),
                        ]),
                        //popup animation
                        transition('void => popup', [
                            query(':enter', style({ opacity: 0, transform: 'scale(0)' }), { optional: true }),
                            query(':enter', stagger('10ms', [
                                animate('500ms ease-out', keyframes([
                                    style({ opacity: .5, transform: 'scale(.5)', offset: 0.3 }),
                                    style({ opacity: 1, transform: 'scale(1.1)', offset: 0.8 }),
                                    style({ opacity: 1, transform: 'scale(1)', offset: 1 }),
                                ]))
                            ]), { optional: true })
                        ])
                    ]),
                ],
                styles: [":host{position:fixed;z-index:2001}.hidden{display:none}.opened{background:#fff;border-radius:5px;box-shadow:0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12);box-sizing:border-box;position:absolute;width:250px}.opened button{-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;background-color:unset;border:none;border-radius:3px;color:#222;font-family:inherit;font-size:12px;letter-spacing:1px;line-height:20px;padding:10px;user-select:none}.opened .button:hover,.opened button:hover{background-color:rgba(0,0,0,.05);transition:opacity .2s cubic-bezier(.35,0,.25,1),background-color .2s cubic-bezier(.35,0,.25,1);transition-delay:0s,0s;transition-duration:.2s,.2s;transition-property:opacity,background-color;transition-timing-function:cubic-bezier(.35,0,.25,1),cubic-bezier(.35,0,.25,1)}.opened button:focus{outline:none}.opened .colors{align-items:center;display:flex;flex-wrap:wrap;margin:15px}.opened .colors .circle{border-radius:100%;box-sizing:border-box;cursor:pointer;height:34px;width:34px}.opened .colors .circle .add{font-size:20px;line-height:45px;text-align:center}.opened .colors .circle .selected{border:2px solid #fff;border-radius:100%;box-sizing:border-box;height:28px;margin:2px;width:28px}.opened .colors .circle.wrapper{flex:34px 0 0;margin:0 5px 5px}.opened .colors .circle.wrapper.color{background-image:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw1AUhU/TSkUqDnYQEclQnSyIijhqFYpQIdQKrTqYvPQPmjQkKS6OgmvBwZ/FqoOLs64OroIg+APi5Oik6CIl3pcUWsR44fE+zrvn8N59gNCoMM0KjQOabpvpZELM5lbF8CsCCCGKYQzIzDLmJCkF3/q6p26quzjP8u/7s3rVvMWAgEg8ywzTJt4gnt60Dc77xFFWklXic+Ixky5I/Mh1xeM3zkWXBZ4ZNTPpeeIosVjsYKWDWcnUiKeIY6qmU76Q9VjlvMVZq9RY6578hZG8vrLMdVpDSGIRS5AgQkENZVRgI067ToqFNJ0nfPyDrl8il0KuMhg5FlCFBtn1g//B79lahckJLymSALpeHOdjBAjvAs2643wfO07zBAg+A1d6219tADOfpNfbWuwI6NsGLq7bmrIHXO4AA0+GbMquFKQlFArA+xl9Uw7ovwV61ry5tc5x+gBkaFapG+DgEBgtUva6z7u7O+f2b09rfj8vXnKMvOB8PQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+QBBBQmO5r5LH8AAAArSURBVDjLY/z///9/Bjzg7Nmz+KQZmBgoBKMGDAYDWAjFs7Gx8WggDn8DAOBdCYVQIsgKAAAAAElFTkSuQmCC\")}.opened .colors .circle-border{border:1px solid rgba(0,0,0,.03)}.opened .color-picker-wrapper{margin:5px 15px}.opened .nav-wrapper{margin:5px;overflow:hidden}.opened .nav-wrapper .round-button{border-radius:100%;box-sizing:border-box;height:40px;line-height:45px;padding:5px 0;text-align:center;width:40px}.opened .manual-input-wrapper{display:flex;font-family:sans-serif;margin:15px}.opened .manual-input-wrapper p{-moz-user-select:none;-ms-user-select:none;-webkit-touch-callout:none;-webkit-user-select:none;font-size:10px;letter-spacing:1.5px;line-height:48px;margin:0;text-align:center;text-transform:uppercase;user-select:none;width:145px}.opened .manual-input-wrapper .g-input{border:1px solid #e8ebed;border-radius:5px;height:45px;width:100%}.opened .manual-input-wrapper .g-input input{border:none;border-radius:5px;color:#595b65;font-size:9px;height:100%;letter-spacing:1px;margin:0;outline:none;padding:0;text-align:center;text-transform:uppercase;width:100%}"]
            },] }
];
PanelComponent.ctorParameters = () => [
    { type: ConverterService }
];
PanelComponent.propDecorators = {
    click: [{ type: HostListener, args: ['document:click', ['$event'],] }],
    onScroll: [{ type: HostListener, args: ['document:scroll',] }],
    onResize: [{ type: HostListener, args: ['window:resize',] }],
    top: [{ type: HostBinding, args: ['style.top.px',] }],
    left: [{ type: HostBinding, args: ['style.left.px',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFuZWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWNvbG9ycy9zcmMvbGliL2NvbXBvbmVudHMvcGFuZWwvcGFuZWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQWlGLFlBQVksRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDcEosT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRXJHLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNwRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDN0QsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRWhELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQW9DNUMsTUFBTSxPQUFPLGNBQWM7SUFxQnpCLFlBQ1MsT0FBd0I7UUFBeEIsWUFBTyxHQUFQLE9BQU8sQ0FBaUI7UUFNMUIsVUFBSyxHQUFHLFNBQVMsQ0FBQztRQUNsQixpQkFBWSxHQUFXLFNBQVMsQ0FBQztRQUNqQyxTQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUE7UUFFeEIsMEJBQXFCLEdBQUcsVUFBVSxDQUFBO1FBRWxDLFlBQU8sR0FBRyxhQUFhLENBQUM7UUFDeEIsYUFBUSxHQUFHLEVBQUUsQ0FBQztRQUVkLGlCQUFZLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLFdBQU0sR0FBZ0IsWUFBWSxDQUFDLEdBQUcsQ0FBQztRQUV2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QVksU0FBQyxnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsQ0FBQzt1QkFPekMsWUFBWSxTQUFDLGlCQUFpQjt1QkFJOUIsWUFBWSxTQUFDLGVBQWU7a0JBSzVCLFdBQVcsU0FBQyxjQUFjO21CQUMxQixXQUFXLFNBQUMsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIENoYW5nZURldGVjdG9yUmVmLCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciwgSG9zdEJpbmRpbmcgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgdHJpZ2dlciwgdHJhbnNpdGlvbiwgcXVlcnksIHN0eWxlLCBzdGFnZ2VyLCBhbmltYXRlLCBrZXlmcmFtZXMgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcclxuaW1wb3J0IHsgaXNEZXNjZW5kYW50T3JTYW1lIH0gZnJvbSAnLi4vLi4vaGVscGVycy9oZWxwZXJzJztcclxuaW1wb3J0IHsgQ29sb3JGb3JtYXRzIH0gZnJvbSAnLi4vLi4vZW51bXMvZm9ybWF0cyc7XHJcbmltcG9ydCB7IENvbnZlcnRlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jb252ZXJ0ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IGRlZmF1bHRDb2xvcnMgfSBmcm9tICcuLi8uLi9oZWxwZXJzL2RlZmF1bHQtY29sb3JzJztcclxuaW1wb3J0IHsgZm9ybWF0cyB9IGZyb20gJy4uLy4uL2hlbHBlcnMvZm9ybWF0cyc7XHJcbmltcG9ydCB7IE5neENvbG9yc1RyaWdnZXJEaXJlY3RpdmUgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL25neC1jb2xvcnMtdHJpZ2dlci5kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBIc3ZhIH0gZnJvbSAnLi4vLi4vY2xhc2VzL2Zvcm1hdHMnO1xyXG5cclxuXHJcblxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICduZ3gtY29sb3JzLXBhbmVsJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vcGFuZWwuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL3BhbmVsLmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgYW5pbWF0aW9uczogW1xyXG4gICAgdHJpZ2dlcignY29sb3JzQW5pbWF0aW9uJywgW1xyXG4gICAgICB0cmFuc2l0aW9uKCd2b2lkID0+IHNsaWRlLWluJywgW1xyXG4gICAgICAgIC8vIEluaXRpYWxseSBhbGwgY29sb3JzIGFyZSBoaWRkZW5cclxuICAgICAgICBxdWVyeSgnOmVudGVyJywgc3R5bGUoeyBvcGFjaXR5OiAwIH0pLCB7IG9wdGlvbmFsOiB0cnVlIH0pLFxyXG4gICAgICAgIC8vc2xpZGUtaW4gYW5pbWF0aW9uXHJcbiAgICAgICAgcXVlcnkoJzplbnRlcicsIHN0YWdnZXIoJzEwbXMnLCBbXHJcbiAgICAgICAgICBhbmltYXRlKCcuM3MgZWFzZS1pbicsIGtleWZyYW1lcyhbXHJcbiAgICAgICAgICAgIHN0eWxlKHsgb3BhY2l0eTogMCwgdHJhbnNmb3JtOiAndHJhbnNsYXRleCgtNTAlKScsIG9mZnNldDogMCB9KSxcclxuICAgICAgICAgICAgc3R5bGUoeyBvcGFjaXR5OiAuNSwgdHJhbnNmb3JtOiAndHJhbnNsYXRleCgtMTBweCkgc2NhbGUoMS4xKScsIG9mZnNldDogMC4zIH0pLFxyXG4gICAgICAgICAgICBzdHlsZSh7IG9wYWNpdHk6IDEsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZXgoMCknLCBvZmZzZXQ6IDEgfSksXHJcbiAgICAgICAgICBdKSldKSwgeyBvcHRpb25hbDogdHJ1ZSB9KSxcclxuICAgICAgXSksXHJcbiAgICAgIC8vcG9wdXAgYW5pbWF0aW9uXHJcbiAgICAgIHRyYW5zaXRpb24oJ3ZvaWQgPT4gcG9wdXAnLCBbXHJcbiAgICAgICAgcXVlcnkoJzplbnRlcicsIHN0eWxlKHsgb3BhY2l0eTogMCx0cmFuc2Zvcm06ICdzY2FsZSgwKScgfSksIHsgb3B0aW9uYWw6IHRydWUgfSksXHJcbiAgICAgICAgcXVlcnkoJzplbnRlcicsIHN0YWdnZXIoJzEwbXMnLCBbXHJcbiAgICAgICAgICBhbmltYXRlKCc1MDBtcyBlYXNlLW91dCcsIGtleWZyYW1lcyhbXHJcbiAgICAgICAgICAgIHN0eWxlKHsgb3BhY2l0eTogLjUsIHRyYW5zZm9ybTogJ3NjYWxlKC41KScsIG9mZnNldDogMC4zIH0pLFxyXG4gICAgICAgICAgICBzdHlsZSh7IG9wYWNpdHk6IDEsIHRyYW5zZm9ybTogJ3NjYWxlKDEuMSknLCBvZmZzZXQ6IDAuOCB9KSxcclxuICAgICAgICAgICAgc3R5bGUoeyBvcGFjaXR5OiAxLCB0cmFuc2Zvcm06ICdzY2FsZSgxKScsIG9mZnNldDogMSB9KSxcclxuICAgICAgICAgIF0pKV0pLCB7IG9wdGlvbmFsOiB0cnVlIH0pXHJcbiAgICAgIF0pXHJcbiAgICBdKSxcclxuICAgIFxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIFBhbmVsQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6Y2xpY2snLCBbJyRldmVudCddKVxyXG4gIGNsaWNrKGV2ZW50KSB7XHJcbiAgICBpZih0aGlzLmlzT3V0c2lkZShldmVudCkpIHtcclxuICAgICAgdGhpcy5lbWl0Q2xvc2UoKTtcclxuICAgIH0gXHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDpzY3JvbGwnKVxyXG4gIG9uU2Nyb2xsKCl7XHJcbiAgICB0aGlzLnNldFBvc2l0aW9uKClcclxuICB9XHJcbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScpXHJcbiAgb25SZXNpemUoKXtcclxuICAgIHRoaXMuc2V0UG9zaXRpb24oKVxyXG4gIH1cclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS50b3AucHgnKSBwdWJsaWMgdG9wOiBudW1iZXI7XHJcbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5sZWZ0LnB4JykgcHVibGljIGxlZnQ6IG51bWJlcjtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwdWJsaWMgc2VydmljZTpDb252ZXJ0ZXJTZXJ2aWNlXHJcbiAgKVxyXG4gIHtcclxuXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY29sb3IgPSAnIzAwMDAwMCc7XHJcbiAgcHVibGljIHByZXZpZXdDb2xvcjogc3RyaW5nID0gJyMwMDAwMDAnO1xyXG4gIHB1YmxpYyBoc3ZhID0gbmV3IEhzdmEoMCwxLDEsMSlcclxuXHJcbiAgcHVibGljIGNvbG9yc0FuaW1hdGlvbkVmZmVjdCA9ICdzbGlkZS1pbidcclxuXHJcbiAgcHVibGljIHBhbGV0dGUgPSBkZWZhdWx0Q29sb3JzO1xyXG4gIHB1YmxpYyB2YXJpYW50cyA9IFtdO1xyXG5cclxuICBwdWJsaWMgY29sb3JGb3JtYXRzID0gZm9ybWF0cztcclxuICBwdWJsaWMgZm9ybWF0OkNvbG9yRm9ybWF0cyA9IENvbG9yRm9ybWF0cy5IRVg7XHJcbiBcclxuICBwdWJsaWMgY2FuQ2hhbmdlRm9ybWF0OmJvb2xlYW4gPSB0cnVlO1xyXG4gICAgXHJcbiAgcHVibGljIG1lbnUgPSAxO1xyXG5cclxuICBwdWJsaWMgaGlkZUNvbG9yUGlja2VyOmJvb2xlYW4gPSBmYWxzZTtcclxuICBwdWJsaWMgaGlkZVRleHRJbnB1dDpib29sZWFuID0gZmFsc2U7XHJcbiAgcHVibGljIGFjY2VwdExhYmVsOnN0cmluZztcclxuXHJcbiAgcHJpdmF0ZSB0cmlnZ2VySW5zdGFuY2U6Tmd4Q29sb3JzVHJpZ2dlckRpcmVjdGl2ZTtcclxuICBwcml2YXRlIHRyaWdnZXJFbGVtZW50UmVmO1xyXG4gIFxyXG5cclxuXHJcblxyXG4gIHB1YmxpYyBuZ09uSW5pdCgpe1xyXG4gICAgdGhpcy5zZXRQb3NpdGlvbigpO1xyXG4gICAgdGhpcy5oc3ZhID0gdGhpcy5zZXJ2aWNlLnN0cmluZ1RvSHN2YSh0aGlzLmNvbG9yKTtcclxuICB9XHJcblxyXG5cclxuICBwdWJsaWMgaW5pY2lhdGUodHJpZ2dlckluc3RhbmNlOk5neENvbG9yc1RyaWdnZXJEaXJlY3RpdmUsdHJpZ2dlckVsZW1lbnRSZWYsY29sb3IscGFsZXR0ZSxhbmltYXRpb24sZm9ybWF0OnN0cmluZywgaGlkZVRleHRJbnB1dDpib29sZWFuLCBoaWRlQ29sb3JQaWNrZXI6Ym9vbGVhbiwgYWNjZXB0TGFiZWw6c3RyaW5nKXtcclxuICAgICAgdGhpcy50cmlnZ2VySW5zdGFuY2UgPSB0cmlnZ2VySW5zdGFuY2U7XHJcbiAgICAgIHRoaXMudHJpZ2dlckVsZW1lbnRSZWYgPSB0cmlnZ2VyRWxlbWVudFJlZjtcclxuICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xyXG4gICAgICB0aGlzLmhpZGVDb2xvclBpY2tlciA9IGhpZGVDb2xvclBpY2tlcjtcclxuICAgICAgdGhpcy5oaWRlVGV4dElucHV0ID0gaGlkZVRleHRJbnB1dDtcclxuICAgICAgdGhpcy5hY2NlcHRMYWJlbCA9IGFjY2VwdExhYmVsO1xyXG4gICAgICBpZihmb3JtYXQpe1xyXG4gICAgICAgIGlmKGZvcm1hdHMuaW5jbHVkZXMoZm9ybWF0KSl7XHJcbiAgICAgICAgICB0aGlzLmZvcm1hdCA9IGZvcm1hdHMuaW5kZXhPZihmb3JtYXQudG9Mb3dlckNhc2UoKSk7XHJcbiAgICAgICAgICB0aGlzLmNhbkNoYW5nZUZvcm1hdCA9IGZhbHNlO1xyXG4gICAgICAgICAgaWYodGhpcy5zZXJ2aWNlLmdldEZvcm1hdEJ5U3RyaW5nKHRoaXMuY29sb3IpICE9IGZvcm1hdC50b0xvd2VyQ2FzZSgpKXtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuc2V0Q29sb3IodGhpcy5zZXJ2aWNlLnN0cmluZ1RvSHN2YSh0aGlzLmNvbG9yKSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdGb3JtYXQgcHJvdmlkZWQgaXMgaW52YWxpZCwgdXNpbmcgSEVYJyk7XHJcbiAgICAgICAgICB0aGlzLmZvcm1hdCA9IENvbG9yRm9ybWF0cy5IRVg7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2V7XHJcbiAgICAgICAgdGhpcy5mb3JtYXQgPSBmb3JtYXRzLmluZGV4T2YodGhpcy5zZXJ2aWNlLmdldEZvcm1hdEJ5U3RyaW5nKHRoaXMuY29sb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgdGhpcy5wcmV2aWV3Q29sb3IgPSB0aGlzLmNvbG9yO1xyXG4gICAgICB0aGlzLnBhbGV0dGUgPSBwYWxldHRlID8/IGRlZmF1bHRDb2xvcnM7XHJcbiAgICAgIHRoaXMuY29sb3JzQW5pbWF0aW9uRWZmZWN0ID0gYW5pbWF0aW9uO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNldFBvc2l0aW9uKCkge1xyXG4gICAgaWYodGhpcy50cmlnZ2VyRWxlbWVudFJlZil7XHJcbiAgICAgIHZhciB2aWV3cG9ydE9mZnNldCA9IHRoaXMudHJpZ2dlckVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgdGhpcy50b3AgPSB2aWV3cG9ydE9mZnNldC50b3AgKyB2aWV3cG9ydE9mZnNldC5oZWlnaHQ7XHJcbiAgICAgIHRoaXMubGVmdCA9IHZpZXdwb3J0T2Zmc2V0LmxlZnQgKyAyNTAgPiB3aW5kb3cuaW5uZXJXaWR0aCA/IHZpZXdwb3J0T2Zmc2V0LnJpZ2h0IC0gMjUwIDogdmlld3BvcnRPZmZzZXQubGVmdDtcclxuICAgIH1cclxuICB9XHJcbiAgcHVibGljIGhhc1ZhcmlhbnQoY29sb3IpOmJvb2xlYW57XHJcbiAgICBpZighdGhpcy5wcmV2aWV3Q29sb3Ipe1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHlwZW9mIGNvbG9yICE9ICdzdHJpbmcnICYmIGNvbG9yLnZhcmlhbnRzLnNvbWUodiA9PiB2LnRvVXBwZXJDYXNlKCkgPT0gdGhpcy5wcmV2aWV3Q29sb3IudG9VcHBlckNhc2UoKSApO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGlzU2VsZWN0ZWQoY29sb3Ipe1xyXG4gICAgaWYoIXRoaXMucHJldmlld0NvbG9yKXtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHR5cGVvZiBjb2xvciA9PSAnc3RyaW5nJyAmJiBjb2xvci50b1VwcGVyQ2FzZSgpID09IHRoaXMucHJldmlld0NvbG9yLnRvVXBwZXJDYXNlKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0QmFja2dyb3VuZENvbG9yKGNvbG9yKXtcclxuICAgIGlmKHR5cGVvZiBjb2xvciA9PSAnc3RyaW5nJyl7XHJcbiAgICAgIHJldHVybiB7ICdiYWNrZ3JvdW5kJzogY29sb3IgfTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIHJldHVybiB7ICdiYWNrZ3JvdW5kJzogY29sb3IucHJldmlldyB9O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIENoYW5nZSBjb2xvciBmcm9tIGRlZmF1bHQgY29sb3JzXHJcbiAgICogQHBhcmFtIHN0cmluZyBjb2xvclxyXG4gICAqL1xyXG4gIHB1YmxpYyBjaGFuZ2VDb2xvcihjb2xvcjogc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0aGlzLnNldENvbG9yKHRoaXMuc2VydmljZS5zdHJpbmdUb0hzdmEoY29sb3IpKTtcclxuICAgIC8vIHRoaXMudHJpZ2dlckluc3RhbmNlLm9uQ2hhbmdlKCk7XHJcbiAgICB0aGlzLmVtaXRDbG9zZSgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG9uQ2hhbmdlQ29sb3JQaWNrZXIoZXZlbnQ6SHN2YSnCoHtcclxuICAgIHRoaXMuc2V0Q29sb3IoZXZlbnQpO1xyXG4gICAgLy8gdGhpcy50cmlnZ2VySW5zdGFuY2Uub25DaGFuZ2UoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBjaGFuZ2VDb2xvck1hbnVhbChjb2xvcjogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgIHRoaXMucHJldmlld0NvbG9yID0gY29sb3I7XHJcbiAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcclxuICAgICAgdGhpcy5oc3ZhID0gdGhpcy5zZXJ2aWNlLnN0cmluZ1RvSHN2YShjb2xvcik7XHJcbiAgICAgIHRoaXMudHJpZ2dlckluc3RhbmNlLnNldENvbG9yKHRoaXMuY29sb3IpO1xyXG4gICAgICAvLyB0aGlzLnRyaWdnZXJJbnN0YW5jZS5vbkNoYW5nZSgpO1xyXG4gIH1cclxuXHJcbiAgc2V0Q29sb3IodmFsdWU6SHN2YSl7XHJcbiAgICB0aGlzLmhzdmEgPSB2YWx1ZTtcclxuICAgIHRoaXMuY29sb3IgPSB0aGlzLnNlcnZpY2UudG9Gb3JtYXQodmFsdWUsdGhpcy5mb3JtYXQpO1xyXG4gICAgdGhpcy5zZXRQcmV2aWV3Q29sb3IodmFsdWUpO1xyXG4gICAgdGhpcy50cmlnZ2VySW5zdGFuY2Uuc2V0Q29sb3IodGhpcy5jb2xvcik7XHJcbiAgfVxyXG5cclxuXHJcbiAgc2V0UHJldmlld0NvbG9yKHZhbHVlOkhzdmEpe1xyXG4gICAgdGhpcy5wcmV2aWV3Q29sb3IgPSB0aGlzLnNlcnZpY2UuaHN2YVRvUmdiYSh2YWx1ZSkudG9TdHJpbmcoKTtcclxuICB9XHJcblxyXG4gIG9uQ2hhbmdlKCl7XHJcbiAgICAvLyB0aGlzLnRyaWdnZXJJbnN0YW5jZS5vbkNoYW5nZSgpO1xyXG4gIH1cclxuICBcclxuICBwdWJsaWMgc2hvd0NvbG9ycygpe1xyXG4gICAgdGhpcy5tZW51ID0gMTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBvbkNvbG9yQ2xpY2soY29sb3Ipe1xyXG4gICAgaWYodHlwZW9mIGNvbG9yID09ICdzdHJpbmcnKXtcclxuICAgICAgdGhpcy5jaGFuZ2VDb2xvcihjb2xvcik7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICB0aGlzLnZhcmlhbnRzID0gY29sb3IudmFyaWFudHM7XHJcbiAgICAgIHRoaXMubWVudSA9IDI7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYWRkQ29sb3IoKXtcclxuICAgIHRoaXMubWVudSA9IDM7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbmV4dEZvcm1hdCgpe1xyXG4gICAgaWYodGhpcy5jYW5DaGFuZ2VGb3JtYXQpe1xyXG4gICAgICB0aGlzLmZvcm1hdCA9ICh0aGlzLmZvcm1hdCArIDEpICUgdGhpcy5jb2xvckZvcm1hdHMubGVuZ3RoO1xyXG4gICAgICB0aGlzLnNldENvbG9yKHRoaXMuaHN2YSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgcHVibGljIGVtaXRDbG9zZSgpe1xyXG4gICAgdGhpcy50cmlnZ2VySW5zdGFuY2UuY2xvc2UoKTtcclxuICB9XHJcblxyXG4gXHJcblxyXG4gIGlzT3V0c2lkZShldmVudCl7XHJcbiAgICAgICAgcmV0dXJuIGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ25neC1jb2xvcnMtb3ZlcmxheScpO1xyXG4gIH1cclxuXHJcbiAgXHJcblxyXG5cclxufVxyXG4iXX0=