ngx-colors
==========

**This is a fork of [ngx-colors](https://github.com/KroneCorylus/ngx-colors), in order to support Angular 11.**

## Demo and documentation

https://ngx-colors.web.app/


## Preview

![example gif](https://raw.githubusercontent.com/KroneCorylus/ngx-colors/master/projects/ngx-color-examples/src/assets/img/example-gif.gif)

## Installation

#### Npm
```shel
npm install @angular/animations
```

#### Npm
```shell
npm install ngx-colors
```

##### Load the ngx-colors module in your app module:

```javascript
import { NgxColorsModule } from 'ngx-colors';

@NgModule({
  ...
  imports: [
    ...
    NgxColorsModule
  ]
})
```
## Overview and usage
This library is composed of two parts:
1. ngx-colors-trigger: This directive can be applied to any html element turning it into a trigger that when clicked will open the color picker
2. ngx-colors: This component is a premade button that will display the selected color.

##### Use it in your HTML template with ngModel:

```html
<ngx-colors ngx-colors-trigger [(ngModel)]="color"></ngx-colors>
```
##### Or with Reactive Forms:

```html
<form class="example-form">
    <ngx-colors ngx-colors-trigger style="display: inline-block; margin:5px;" [formControl]="colorFormControl"></ngx-colors>
</form>
```
