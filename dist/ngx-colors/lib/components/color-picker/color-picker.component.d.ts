import { OnInit, OnDestroy, AfterViewInit, ElementRef, EventEmitter, OnChanges } from '@angular/core';
import { Hsva } from '../../clases/formats';
import { SliderPosition } from '../../clases/slider';
import { ConverterService } from '../../services/converter.service';
export declare class ColorPickerComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
    private service;
    color: Hsva;
    colorChange: EventEmitter<Hsva>;
    private hsva;
    private outputColor;
    selectedColor: string;
    private fallbackColor;
    private sliderDimMax;
    slider: SliderPosition;
    hueSliderColor: string;
    alphaSliderColor: string;
    hueSlider: ElementRef;
    alphaSlider: ElementRef;
    constructor(service: ConverterService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    ngOnChanges(changes: any): void;
    ngAfterViewInit(): void;
    onSliderChange(type: string, event: any): void;
    setColor(color: any): void;
    private update;
}
