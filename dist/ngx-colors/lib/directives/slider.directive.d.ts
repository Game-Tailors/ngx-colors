import { EventEmitter, ElementRef } from '@angular/core';
export declare class SliderDirective {
    private elRef;
    private listenerMove;
    private listenerStop;
    rgX: number;
    rgY: number;
    slider: string;
    dragEnd: EventEmitter<any>;
    dragStart: EventEmitter<any>;
    newValue: EventEmitter<any>;
    mouseDown(event: any): void;
    touchStart(event: any): void;
    constructor(elRef: ElementRef);
    private move;
    private start;
    private stop;
    private getX;
    private getY;
    private setCursor;
}
