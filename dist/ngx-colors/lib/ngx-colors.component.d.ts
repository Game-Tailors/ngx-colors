import { OnInit } from '@angular/core';
import { NgxColorsTriggerDirective } from './directives/ngx-colors-trigger.directive';
export declare class NgxColorsComponent implements OnInit {
    private triggerDirective;
    constructor(triggerDirective: NgxColorsTriggerDirective);
    ngOnInit(): void;
    color: string;
}
