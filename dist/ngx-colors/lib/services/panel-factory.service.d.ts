import { ComponentFactoryResolver, Injector, ComponentFactory, ApplicationRef, ComponentRef } from '@angular/core';
import { PanelComponent } from '../components/panel/panel.component';
export declare class PanelFactoryService {
    private resolver;
    private applicationRef;
    private injector;
    constructor(resolver: ComponentFactoryResolver, applicationRef: ApplicationRef, injector: Injector);
    componentRef: ComponentRef<PanelComponent>;
    _factory: ComponentFactory<PanelComponent>;
    overlay: any;
    createPanel(): ComponentRef<PanelComponent>;
    removePanel(): void;
}
