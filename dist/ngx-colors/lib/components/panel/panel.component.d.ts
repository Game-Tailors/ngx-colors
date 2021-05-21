import { OnInit } from '@angular/core';
import { ColorFormats } from '../../enums/formats';
import { ConverterService } from '../../services/converter.service';
import { NgxColorsTriggerDirective } from '../../directives/ngx-colors-trigger.directive';
import { Hsva } from '../../clases/formats';
export declare class PanelComponent implements OnInit {
    service: ConverterService;
    click(event: any): void;
    onScroll(): void;
    onResize(): void;
    top: number;
    left: number;
    constructor(service: ConverterService);
    color: string;
    previewColor: string;
    hsva: Hsva;
    colorsAnimationEffect: string;
    palette: {
        color: string;
        preview: string;
        variants: string[];
    }[];
    variants: any[];
    colorFormats: string[];
    format: ColorFormats;
    canChangeFormat: boolean;
    menu: number;
    hideColorPicker: boolean;
    hideTextInput: boolean;
    acceptLabel: string;
    private triggerInstance;
    private triggerElementRef;
    ngOnInit(): void;
    iniciate(triggerInstance: NgxColorsTriggerDirective, triggerElementRef: any, color: any, palette: any, animation: any, format: string, hideTextInput: boolean, hideColorPicker: boolean, acceptLabel: string): void;
    setPosition(): void;
    hasVariant(color: any): boolean;
    isSelected(color: any): boolean;
    getBackgroundColor(color: any): {
        background: any;
    };
    /**
     * Change color from default colors
     * @param string color
     */
    changeColor(color: string): void;
    onChangeColorPicker(event: Hsva): void;
    changeColorManual(color: string): void;
    setColor(value: Hsva): void;
    setPreviewColor(value: Hsva): void;
    onChange(): void;
    showColors(): void;
    onColorClick(color: any): void;
    addColor(): void;
    nextFormat(): void;
    emitClose(): void;
    isOutside(event: any): any;
}
