(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/animations'), require('@angular/forms'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('ngx-colors', ['exports', '@angular/core', '@angular/animations', '@angular/forms', '@angular/common'], factory) :
    (global = global || self, factory(global['ngx-colors'] = {}, global.ng.core, global.ng.animations, global.ng.forms, global.ng.common));
}(this, (function (exports, core, animations, forms, common) { 'use strict';

    var ColorFormats;
    (function (ColorFormats) {
        ColorFormats[ColorFormats["HEX"] = 0] = "HEX";
        ColorFormats[ColorFormats["RGBA"] = 1] = "RGBA";
        ColorFormats[ColorFormats["HSLA"] = 2] = "HSLA";
        ColorFormats[ColorFormats["CMYK"] = 3] = "CMYK";
    })(ColorFormats || (ColorFormats = {}));

    var Rgba = /** @class */ (function () {
        function Rgba(r, g, b, a) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        Rgba.prototype.denormalize = function () {
            this.r = Math.round(this.r * 255);
            this.g = Math.round(this.g * 255);
            this.b = Math.round(this.b * 255);
            return this;
        };
        Rgba.prototype.toString = function () {
            this.denormalize();
            var output = 'rgb' +
                (this.a != 1 ? 'a(' : '(') +
                this.r + ', ' +
                this.g + ', ' +
                this.b +
                (this.a != 1 ? ', ' + this.a.toPrecision(2) + ')' : ')');
            return output;
        };
        return Rgba;
    }());
    var Hsva = /** @class */ (function () {
        function Hsva(h, s, v, a) {
            this.h = h;
            this.s = s;
            this.v = v;
            this.a = a;
            this.onChange = new core.EventEmitter(true);
        }
        Hsva.prototype.onColorChange = function (value) {
            this.s = value.s / value.rgX;
            this.v = value.v / value.rgY;
        };
        Hsva.prototype.onHueChange = function (value) {
            this.h = value.v / value.rgX;
            // this.sliderH = this.hsva.h;
        };
        Hsva.prototype.onValueChange = function (value) {
            this.v = value.v / value.rgX;
        };
        Hsva.prototype.onAlphaChange = function (value) {
            this.a = value.v / value.rgX;
        };
        return Hsva;
    }());
    var Hsla = /** @class */ (function () {
        function Hsla(h, s, l, a) {
            this.h = h;
            this.s = s;
            this.l = l;
            this.a = a;
        }
        Hsla.prototype.denormalize = function () {
            this.h = Math.round(this.h * 360);
            this.s = Math.round(this.s * 100);
            this.l = Math.round(this.l * 100);
            return this;
        };
        Hsla.prototype.toString = function () {
            var output = 'hsl' +
                (this.a != 1 ? 'a(' : '(') +
                this.h + ', ' +
                this.s + '%, ' +
                this.l + '%' +
                (this.a != 1 ? ', ' + this.a.toPrecision(2) + ')' : ')');
            return output;
        };
        return Hsla;
    }());
    var Cmyk = /** @class */ (function () {
        function Cmyk(c, m, y, k, a) {
            if (a === void 0) { a = 1; }
            this.c = c;
            this.m = m;
            this.y = y;
            this.k = k;
            this.a = a;
        }
        return Cmyk;
    }());

    var ConverterService = /** @class */ (function () {
        // private active: ColorPickerComponent | null = null;
        function ConverterService() {
        }
        // public setActive(active: ColorPickerComponent | null): void {
        //   this.active = active;
        // }
        ConverterService.prototype.toFormat = function (hsva, format) {
            var output = '';
            switch (format) {
                case ColorFormats.HEX:
                    var rgba = this.hsvaToRgba(hsva);
                    rgba.denormalize();
                    var output = this.rgbaToHex(rgba, true);
                    break;
                case ColorFormats.HSLA:
                    var hsla = this.hsva2hsla(hsva);
                    hsla.denormalize();
                    var output = hsla.toString();
                    break;
                case ColorFormats.RGBA:
                    var rgba = this.hsvaToRgba(hsva);
                    var output = rgba.toString();
                    break;
                case ColorFormats.CMYK:
                    var rgba = this.hsvaToRgba(hsva);
                    var cmyk = this.rgbaToCmyk(rgba);
                    break;
            }
            return output;
        };
        ConverterService.prototype.stringToFormat = function (color, format) {
            var hsva = this.stringToHsva(color, true);
            return this.toFormat(hsva, format);
        };
        ConverterService.prototype.hsva2hsla = function (hsva) {
            var h = hsva.h, s = hsva.s, v = hsva.v, a = hsva.a;
            if (v === 0) {
                return new Hsla(h, 0, 0, a);
            }
            else if (s === 0 && v === 1) {
                return new Hsla(h, 1, 1, a);
            }
            else {
                var l = v * (2 - s) / 2;
                return new Hsla(h, v * s / (1 - Math.abs(2 * l - 1)), l, a);
            }
        };
        ConverterService.prototype.hsla2hsva = function (hsla) {
            var h = Math.min(hsla.h, 1), s = Math.min(hsla.s, 1);
            var l = Math.min(hsla.l, 1), a = Math.min(hsla.a, 1);
            if (l === 0) {
                return new Hsva(h, 0, 0, a);
            }
            else {
                var v = l + s * (1 - Math.abs(2 * l - 1)) / 2;
                return new Hsva(h, 2 * (v - l) / v, v, a);
            }
        };
        ConverterService.prototype.hsvaToRgba = function (hsva) {
            var r, g, b;
            var h = hsva.h, s = hsva.s, v = hsva.v, a = hsva.a;
            var i = Math.floor(h * 6);
            var f = h * 6 - i;
            var p = v * (1 - s);
            var q = v * (1 - f * s);
            var t = v * (1 - (1 - f) * s);
            switch (i % 6) {
                case 0:
                    r = v, g = t, b = p;
                    break;
                case 1:
                    r = q, g = v, b = p;
                    break;
                case 2:
                    r = p, g = v, b = t;
                    break;
                case 3:
                    r = p, g = q, b = v;
                    break;
                case 4:
                    r = t, g = p, b = v;
                    break;
                case 5:
                    r = v, g = p, b = q;
                    break;
                default:
                    r = 0, g = 0, b = 0;
            }
            return new Rgba(r, g, b, a);
        };
        ConverterService.prototype.cmykToRgb = function (cmyk) {
            var r = (1 - cmyk.c) * (1 - cmyk.k);
            var g = (1 - cmyk.m) * (1 - cmyk.k);
            var b = (1 - cmyk.y) * (1 - cmyk.k);
            return new Rgba(r, g, b, cmyk.a);
        };
        ConverterService.prototype.rgbaToCmyk = function (rgba) {
            var k = 1 - Math.max(rgba.r, rgba.g, rgba.b);
            if (k === 1) {
                return new Cmyk(0, 0, 0, 1, rgba.a);
            }
            else {
                var c = (1 - rgba.r - k) / (1 - k);
                var m = (1 - rgba.g - k) / (1 - k);
                var y = (1 - rgba.b - k) / (1 - k);
                return new Cmyk(c, m, y, k, rgba.a);
            }
        };
        ConverterService.prototype.rgbaToHsva = function (rgba) {
            var h, s;
            var r = Math.min(rgba.r, 1), g = Math.min(rgba.g, 1);
            var b = Math.min(rgba.b, 1), a = Math.min(rgba.a, 1);
            var max = Math.max(r, g, b), min = Math.min(r, g, b);
            var v = max, d = max - min;
            s = (max === 0) ? 0 : d / max;
            if (max === min) {
                h = 0;
            }
            else {
                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    case b:
                        h = (r - g) / d + 4;
                        break;
                    default:
                        h = 0;
                }
                h /= 6;
            }
            return new Hsva(h, s, v, a);
        };
        ConverterService.prototype.rgbaToHex = function (rgba, allowHex8) {
            /* tslint:disable:no-bitwise */
            var hex = '#' + ((1 << 24) | (rgba.r << 16) | (rgba.g << 8) | rgba.b).toString(16).substr(1);
            if (rgba.a != 1) {
                hex += ((1 << 8) | Math.round(rgba.a * 255)).toString(16).substr(1);
            }
            /* tslint:enable:no-bitwise */
            return hex;
        };
        ConverterService.prototype.normalizeCMYK = function (cmyk) {
            return new Cmyk(cmyk.c / 100, cmyk.m / 100, cmyk.y / 100, cmyk.k / 100, cmyk.a);
        };
        ConverterService.prototype.denormalizeCMYK = function (cmyk) {
            return new Cmyk(Math.floor(cmyk.c * 100), Math.floor(cmyk.m * 100), Math.floor(cmyk.y * 100), Math.floor(cmyk.k * 100), cmyk.a);
        };
        ConverterService.prototype.denormalizeRGBA = function (rgba) {
            return new Rgba(Math.round(rgba.r * 255), Math.round(rgba.g * 255), Math.round(rgba.b * 255), rgba.a);
        };
        ConverterService.prototype.stringToHsva = function (colorString, allowHex8) {
            if (colorString === void 0) { colorString = ''; }
            if (allowHex8 === void 0) { allowHex8 = true; }
            var hsva = null;
            colorString = (colorString || '').toLowerCase();
            var stringParsers = [
                {
                    re: /(rgb)a?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*%?,\s*(\d{1,3})\s*%?(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
                    parse: function (execResult) {
                        return new Rgba(parseInt(execResult[2], 10) / 255, parseInt(execResult[3], 10) / 255, parseInt(execResult[4], 10) / 255, isNaN(parseFloat(execResult[5])) ? 1 : parseFloat(execResult[5]));
                    }
                }, {
                    re: /(hsl)a?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
                    parse: function (execResult) {
                        return new Hsla(parseInt(execResult[2], 10) / 360, parseInt(execResult[3], 10) / 100, parseInt(execResult[4], 10) / 100, isNaN(parseFloat(execResult[5])) ? 1 : parseFloat(execResult[5]));
                    }
                }
            ];
            if (allowHex8) {
                stringParsers.push({
                    re: /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})?$/,
                    parse: function (execResult) {
                        return new Rgba(parseInt(execResult[1], 16) / 255, parseInt(execResult[2], 16) / 255, parseInt(execResult[3], 16) / 255, parseInt(execResult[4] || 'FF', 16) / 255);
                    }
                });
            }
            else {
                stringParsers.push({
                    re: /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})$/,
                    parse: function (execResult) {
                        return new Rgba(parseInt(execResult[1], 16) / 255, parseInt(execResult[2], 16) / 255, parseInt(execResult[3], 16) / 255, 1);
                    }
                });
            }
            stringParsers.push({
                re: /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])$/,
                parse: function (execResult) {
                    return new Rgba(parseInt(execResult[1] + execResult[1], 16) / 255, parseInt(execResult[2] + execResult[2], 16) / 255, parseInt(execResult[3] + execResult[3], 16) / 255, 1);
                }
            });
            for (var key in stringParsers) {
                if (stringParsers.hasOwnProperty(key)) {
                    var parser = stringParsers[key];
                    var match = parser.re.exec(colorString), color = match && parser.parse(match);
                    if (color) {
                        if (color instanceof Rgba) {
                            hsva = this.rgbaToHsva(color);
                        }
                        else if (color instanceof Hsla) {
                            hsva = this.hsla2hsva(color);
                        }
                        return hsva;
                    }
                }
            }
            return hsva;
        };
        ConverterService.prototype.outputFormat = function (hsva) {
            return this.hsvaToRgba(hsva).toString();
        };
        ConverterService.prototype.getFormatByString = function (color) {
            if (color) {
                color = color.toLowerCase();
                var regexHex = /(#([\da-f]{3}(?:[\da-f]{3})?(?:[\da-f]{2})?))/;
                var regexRGBA = /(rgba\((\d{1,3},\s?){3}(1|0?\.\d+)\)|rgb\(\d{1,3}(,\s?\d{1,3}){2}\))/;
                var regexHSLA = /(hsla\((\d{1,3}%?,\s?){3}(1|0?\.\d+)\)|hsl\(\d{1,3}%?(,\s?\d{1,3}%?){2}\))/;
                if (regexHex.test(color)) {
                    return 'hex';
                }
                else if (regexRGBA.test(color)) {
                    return 'rgba';
                }
                else if (regexHSLA.test(color)) {
                    return 'hsla';
                }
            }
            return 'hex';
        };
        return ConverterService;
    }());
    ConverterService.decorators = [
        { type: core.Injectable }
    ];
    ConverterService.ctorParameters = function () { return []; };

    var defaultColors = [
        {
            color: "rojo", preview: "#E57373", variants: ["#FFEBEE", "#FFCDD2", "#EF9A9A", "#E57373", "#EF5350", "#F44336", "#E53935", "#D32F2F", "#C62828"]
        },
        {
            color: "rosa", preview: "#F06292", variants: ["#FCE4EC", "#F8BBD0", "#F48FB1", "#F06292", "#EC407A", "#E91E63", "#D81B60", "#C2185B", "#AD1457"]
        },
        {
            color: "purpura", preview: "#BA68C8", variants: ["#F3E5F5", "#E1BEE7", "#CE93D8", "#BA68C8", "#AB47BC", "#9C27B0", "#8E24AA", "#7B1FA2", "#6A1B9A"]
        },
        {
            color: "purpura oscuro", preview: "#9575CD", variants: ["#EDE7F6", "#D1C4E9", "#B39DDB", "#9575CD", "#7E57C2", "#673AB7", "#5E35B1", "#512DA8", "#4527A0"]
        },
        {
            color: "indigo", preview: "#7986CB", variants: ["#E8EAF6", "#C5CAE9", "#9FA8DA", "#7986CB", "#5C6BC0", "#3F51B5", "#3949AB", "#303F9F", "#283593"]
        },
        {
            color: "azul", preview: "#64B5F6", variants: ["#E3F2FD", "#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5", "#1976D2", "#1565C0"]
        },
        {
            color: "celeste", preview: "#4FC3F7", variants: ["#E1F5FE", "#B3E5FC", "#81D4FA", "#4FC3F7", "#29B6F6", "#03A9F4", "#039BE5", "#0288D1", "#0277BD"]
        },
        {
            color: "cyan", preview: "#4DD0E1", variants: ["#E0F7FA", "#B2EBF2", "#80DEEA", "#4DD0E1", "#26C6DA", "#00BCD4", "#00ACC1", "#0097A7", "#00838F"]
        },
        {
            color: "color", preview: "#4DB6AC", variants: ["#E0F2F1", "#B2DFDB", "#80CBC4", "#4DB6AC", "#26A69A", "#009688", "#00897B", "#00796B", "#00695C"]
        },
        {
            color: "verde", preview: "#81C784", variants: ["#E8F5E9", "#C8E6C9", "#A5D6A7", "#81C784", "#66BB6A", "#4CAF50", "#43A047", "#388E3C", "#2E7D32"]
        },
        {
            color: "verde claro", preview: "#AED581", variants: ["#F1F8E9", "#DCEDC8", "#C5E1A5", "#AED581", "#9CCC65", "#8BC34A", "#7CB342", "#689F38", "#558B2F"]
        },
        {
            color: "lima", preview: "#DCE775", variants: ["#F9FBE7", "#F0F4C3", "#E6EE9C", "#DCE775", "#D4E157", "#CDDC39", "#C0CA33", "#AFB42B", "#9E9D24"]
        },
        {
            color: "amarillo", preview: "#FFF176", variants: ["#FFFDE7", "#FFF9C4", "#FFF59D", "#FFF176", "#FFEE58", "#FFEB3B", "#FDD835", "#FBC02D", "#F9A825"]
        },
        {
            color: "ambar", preview: "#FFD54F", variants: ["#FFF8E1", "#FFECB3", "#FFE082", "#FFD54F", "#FFCA28", "#FFC107", "#FFB300", "#FFA000", "#FF8F00"]
        },
        {
            color: "naranja", preview: "#FFB74D", variants: ["#FFF3E0", "#FFE0B2", "#FFCC80", "#FFB74D", "#FFA726", "#FF9800", "#FB8C00", "#F57C00", "#EF6C00"]
        },
        {
            color: "naranja oscuro", preview: "#FF8A65", variants: ["#FBE9E7", "#FFCCBC", "#FFAB91", "#FF8A65", "#FF7043", "#FF5722", "#F4511E", "#E64A19", "#D84315"]
        },
        {
            color: "marron", preview: "#A1887F", variants: ["#EFEBE9", "#D7CCC8", "#BCAAA4", "#A1887F", "#8D6E63", "#795548", "#6D4C41", "#5D4037", "#4E342E"]
        },
        {
            color: "escala de grises", preview: "#E0E0E0", variants: ["#FFFFFF", "#FAFAFA", "#F5F5F5", "#EEEEEE", "#E0E0E0", "#BDBDBD", "#9E9E9E", "#757575", "#616161", "#424242", "#000000"]
        },
        {
            color: "azul gris", preview: "#90A4AE", variants: ["#ECEFF1", "#CFD8DC", "#B0BEC5", "#90A4AE", "#78909C", "#607D8B", "#546E7A", "#455A64", "#37474F"]
        }
    ];

    var formats = ['hex', 'rgba', 'hsla'];

    var PanelComponent = /** @class */ (function () {
        function PanelComponent(service) {
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
        PanelComponent.prototype.click = function (event) {
            if (this.isOutside(event)) {
                this.emitClose();
            }
        };
        PanelComponent.prototype.onScroll = function () {
            this.setPosition();
        };
        PanelComponent.prototype.onResize = function () {
            this.setPosition();
        };
        PanelComponent.prototype.ngOnInit = function () {
            this.setPosition();
            this.hsva = this.service.stringToHsva(this.color);
        };
        PanelComponent.prototype.iniciate = function (triggerInstance, triggerElementRef, color, palette, animation, format, hideTextInput, hideColorPicker, acceptLabel) {
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
        };
        PanelComponent.prototype.setPosition = function () {
            if (this.triggerElementRef) {
                var viewportOffset = this.triggerElementRef.nativeElement.getBoundingClientRect();
                this.top = viewportOffset.top + viewportOffset.height;
                this.left = viewportOffset.left + 250 > window.innerWidth ? viewportOffset.right - 250 : viewportOffset.left;
            }
        };
        PanelComponent.prototype.hasVariant = function (color) {
            var _this = this;
            if (!this.previewColor) {
                return false;
            }
            return typeof color != 'string' && color.variants.some(function (v) { return v.toUpperCase() == _this.previewColor.toUpperCase(); });
        };
        PanelComponent.prototype.isSelected = function (color) {
            if (!this.previewColor) {
                return false;
            }
            return typeof color == 'string' && color.toUpperCase() == this.previewColor.toUpperCase();
        };
        PanelComponent.prototype.getBackgroundColor = function (color) {
            if (typeof color == 'string') {
                return { 'background': color };
            }
            else {
                return { 'background': color.preview };
            }
        };
        /**
         * Change color from default colors
         * @param string color
         */
        PanelComponent.prototype.changeColor = function (color) {
            this.setColor(this.service.stringToHsva(color));
            // this.triggerInstance.onChange();
            this.emitClose();
        };
        PanelComponent.prototype.onChangeColorPicker = function (event) {
            this.setColor(event);
            // this.triggerInstance.onChange();
        };
        PanelComponent.prototype.changeColorManual = function (color) {
            this.previewColor = color;
            this.color = color;
            this.hsva = this.service.stringToHsva(color);
            this.triggerInstance.setColor(this.color);
            // this.triggerInstance.onChange();
        };
        PanelComponent.prototype.setColor = function (value) {
            this.hsva = value;
            this.color = this.service.toFormat(value, this.format);
            this.setPreviewColor(value);
            this.triggerInstance.setColor(this.color);
        };
        PanelComponent.prototype.setPreviewColor = function (value) {
            this.previewColor = this.service.hsvaToRgba(value).toString();
        };
        PanelComponent.prototype.onChange = function () {
            // this.triggerInstance.onChange();
        };
        PanelComponent.prototype.showColors = function () {
            this.menu = 1;
        };
        PanelComponent.prototype.onColorClick = function (color) {
            if (typeof color == 'string') {
                this.changeColor(color);
            }
            else {
                this.variants = color.variants;
                this.menu = 2;
            }
        };
        PanelComponent.prototype.addColor = function () {
            this.menu = 3;
        };
        PanelComponent.prototype.nextFormat = function () {
            if (this.canChangeFormat) {
                this.format = (this.format + 1) % this.colorFormats.length;
                this.setColor(this.hsva);
            }
        };
        PanelComponent.prototype.emitClose = function () {
            this.triggerInstance.close();
        };
        PanelComponent.prototype.isOutside = function (event) {
            return event.target.classList.contains('ngx-colors-overlay');
        };
        return PanelComponent;
    }());
    PanelComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'ngx-colors-panel',
                    template: "<div class=\"opened\" #dialog>\r\n  <ng-container *ngIf=\"menu == 1\">\r\n    <div class=\"colors\" [@colorsAnimation]=\"colorsAnimationEffect\">\r\n      <ng-container *ngFor=\"let color of palette\">\r\n        <div class=\"circle wrapper color\">\r\n          <div\r\n            (click)=\"onColorClick(color)\"\r\n            class=\"circle color circle-border\"\r\n            [ngStyle]=\"getBackgroundColor(color)\"\r\n          >\r\n            <div\r\n              *ngIf=\"hasVariant(color) || isSelected(color)\"\r\n              class=\"selected\"\r\n            ></div>\r\n          </div>\r\n        </div>\r\n      </ng-container>\r\n      <div (click)=\"addColor()\" *ngIf=\"!hideColorPicker\" class=\"circle button\">\r\n        <div class=\"add\">\r\n          <icons icon=\"add\"></icons>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </ng-container>\r\n  <ng-container *ngIf=\"menu == 2\">\r\n    <div class=\"colors\" [@colorsAnimation]=\"colorsAnimationEffect\">\r\n      <div class=\"circle wrapper\">\r\n        <div (click)=\"showColors()\" class=\"add\">\r\n          <icons icon=\"back\"></icons>\r\n        </div>\r\n      </div>\r\n\r\n      <ng-container *ngFor=\"let variant of variants\">\r\n        <div class=\"circle wrapper color\">\r\n          <div\r\n            (click)=\"changeColor(variant)\"\r\n            class=\"circle circle-border\"\r\n            [ngStyle]=\"{ background: variant }\"\r\n          >\r\n            <div *ngIf=\"isSelected(variant)\" class=\"selected\"></div>\r\n          </div>\r\n        </div>\r\n      </ng-container>\r\n    </div>\r\n  </ng-container>\r\n  <ng-container *ngIf=\"menu == 3\">\r\n    <div class=\"nav-wrapper\">\r\n      <div\r\n        (click)=\"showColors()\"\r\n        class=\"round-button button\"\r\n        style=\"float: left\"\r\n      >\r\n        <icons icon=\"back\"></icons>\r\n      </div>\r\n      <button (click)=\"emitClose()\" style=\"float: right\">\r\n        {{ acceptLabel }}\r\n      </button>\r\n    </div>\r\n    <div class=\"color-picker-wrapper\">\r\n      <!-- <span [(colorPicker)]=\"color\"></span> -->\r\n      <color-picker\r\n        [color]=\"hsva\"\r\n        (colorChange)=\"onChangeColorPicker($event)\"\r\n      ></color-picker>\r\n    </div>\r\n  </ng-container>\r\n  <div class=\"manual-input-wrapper\" *ngIf=\"!hideTextInput\">\r\n    <p (click)=\"nextFormat()\">{{ colorFormats[format] }}</p>\r\n    <div class=\"g-input\">\r\n      <input\r\n        placeholder=\"#FFFFFF\"\r\n        type=\"text\"\r\n        [value]=\"color\"\r\n        [style.font-size.px]=\"color && color.length > 23 ? 9 : 10\"\r\n        [style.letter-spacing.px]=\"color && color.length > 16 ? 0 : 1.5\"\r\n        (keyup)=\"changeColorManual(paintInput.value)\"\r\n        (keydown.enter)=\"emitClose()\"\r\n        #paintInput\r\n      />\r\n    </div>\r\n  </div>\r\n</div>\r\n",
                    animations: [
                        animations.trigger('colorsAnimation', [
                            animations.transition('void => slide-in', [
                                // Initially all colors are hidden
                                animations.query(':enter', animations.style({ opacity: 0 }), { optional: true }),
                                //slide-in animation
                                animations.query(':enter', animations.stagger('10ms', [
                                    animations.animate('.3s ease-in', animations.keyframes([
                                        animations.style({ opacity: 0, transform: 'translatex(-50%)', offset: 0 }),
                                        animations.style({ opacity: .5, transform: 'translatex(-10px) scale(1.1)', offset: 0.3 }),
                                        animations.style({ opacity: 1, transform: 'translatex(0)', offset: 1 }),
                                    ]))
                                ]), { optional: true }),
                            ]),
                            //popup animation
                            animations.transition('void => popup', [
                                animations.query(':enter', animations.style({ opacity: 0, transform: 'scale(0)' }), { optional: true }),
                                animations.query(':enter', animations.stagger('10ms', [
                                    animations.animate('500ms ease-out', animations.keyframes([
                                        animations.style({ opacity: .5, transform: 'scale(.5)', offset: 0.3 }),
                                        animations.style({ opacity: 1, transform: 'scale(1.1)', offset: 0.8 }),
                                        animations.style({ opacity: 1, transform: 'scale(1)', offset: 1 }),
                                    ]))
                                ]), { optional: true })
                            ])
                        ]),
                    ],
                    styles: [":host{position:fixed;z-index:2001}.hidden{display:none}.opened{background:#fff;border-radius:5px;box-shadow:0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12);box-sizing:border-box;position:absolute;width:250px}.opened button{-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;background-color:unset;border:none;border-radius:3px;color:#222;font-family:inherit;font-size:12px;letter-spacing:1px;line-height:20px;padding:10px;user-select:none}.opened .button:hover,.opened button:hover{background-color:rgba(0,0,0,.05);transition:opacity .2s cubic-bezier(.35,0,.25,1),background-color .2s cubic-bezier(.35,0,.25,1);transition-delay:0s,0s;transition-duration:.2s,.2s;transition-property:opacity,background-color;transition-timing-function:cubic-bezier(.35,0,.25,1),cubic-bezier(.35,0,.25,1)}.opened button:focus{outline:none}.opened .colors{align-items:center;display:flex;flex-wrap:wrap;margin:15px}.opened .colors .circle{border-radius:100%;box-sizing:border-box;cursor:pointer;height:34px;width:34px}.opened .colors .circle .add{font-size:20px;line-height:45px;text-align:center}.opened .colors .circle .selected{border:2px solid #fff;border-radius:100%;box-sizing:border-box;height:28px;margin:2px;width:28px}.opened .colors .circle.wrapper{flex:34px 0 0;margin:0 5px 5px}.opened .colors .circle.wrapper.color{background-image:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw1AUhU/TSkUqDnYQEclQnSyIijhqFYpQIdQKrTqYvPQPmjQkKS6OgmvBwZ/FqoOLs64OroIg+APi5Oik6CIl3pcUWsR44fE+zrvn8N59gNCoMM0KjQOabpvpZELM5lbF8CsCCCGKYQzIzDLmJCkF3/q6p26quzjP8u/7s3rVvMWAgEg8ywzTJt4gnt60Dc77xFFWklXic+Ixky5I/Mh1xeM3zkWXBZ4ZNTPpeeIosVjsYKWDWcnUiKeIY6qmU76Q9VjlvMVZq9RY6578hZG8vrLMdVpDSGIRS5AgQkENZVRgI067ToqFNJ0nfPyDrl8il0KuMhg5FlCFBtn1g//B79lahckJLymSALpeHOdjBAjvAs2643wfO07zBAg+A1d6219tADOfpNfbWuwI6NsGLq7bmrIHXO4AA0+GbMquFKQlFArA+xl9Uw7ovwV61ry5tc5x+gBkaFapG+DgEBgtUva6z7u7O+f2b09rfj8vXnKMvOB8PQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+QBBBQmO5r5LH8AAAArSURBVDjLY/z///9/Bjzg7Nmz+KQZmBgoBKMGDAYDWAjFs7Gx8WggDn8DAOBdCYVQIsgKAAAAAElFTkSuQmCC\")}.opened .colors .circle-border{border:1px solid rgba(0,0,0,.03)}.opened .color-picker-wrapper{margin:5px 15px}.opened .nav-wrapper{margin:5px;overflow:hidden}.opened .nav-wrapper .round-button{border-radius:100%;box-sizing:border-box;height:40px;line-height:45px;padding:5px 0;text-align:center;width:40px}.opened .manual-input-wrapper{display:flex;font-family:sans-serif;margin:15px}.opened .manual-input-wrapper p{-moz-user-select:none;-ms-user-select:none;-webkit-touch-callout:none;-webkit-user-select:none;font-size:10px;letter-spacing:1.5px;line-height:48px;margin:0;text-align:center;text-transform:uppercase;user-select:none;width:145px}.opened .manual-input-wrapper .g-input{border:1px solid #e8ebed;border-radius:5px;height:45px;width:100%}.opened .manual-input-wrapper .g-input input{border:none;border-radius:5px;color:#595b65;font-size:9px;height:100%;letter-spacing:1px;margin:0;outline:none;padding:0;text-align:center;text-transform:uppercase;width:100%}"]
                },] }
    ];
    PanelComponent.ctorParameters = function () { return [
        { type: ConverterService }
    ]; };
    PanelComponent.propDecorators = {
        click: [{ type: core.HostListener, args: ['document:click', ['$event'],] }],
        onScroll: [{ type: core.HostListener, args: ['document:scroll',] }],
        onResize: [{ type: core.HostListener, args: ['window:resize',] }],
        top: [{ type: core.HostBinding, args: ['style.top.px',] }],
        left: [{ type: core.HostBinding, args: ['style.left.px',] }]
    };

    var PanelFactoryService = /** @class */ (function () {
        function PanelFactoryService(resolver, applicationRef, injector) {
            this.resolver = resolver;
            this.applicationRef = applicationRef;
            this.injector = injector;
        }
        PanelFactoryService.prototype.createPanel = function () {
            if (this.componentRef != undefined) {
                this.removePanel();
            }
            var factory = this.resolver.resolveComponentFactory(PanelComponent);
            this.componentRef = factory.create(this.injector);
            this.applicationRef.attachView(this.componentRef.hostView);
            var domElem = this.componentRef.hostView.rootNodes[0];
            this.overlay = document.createElement('div');
            this.overlay.id = "ngx-colors-overlay";
            this.overlay.classList.add('ngx-colors-overlay');
            document.body.appendChild(this.overlay);
            this.overlay.appendChild(domElem);
            return this.componentRef;
        };
        PanelFactoryService.prototype.removePanel = function () {
            this.applicationRef.detachView(this.componentRef.hostView);
            this.componentRef.destroy();
            this.overlay.remove();
        };
        return PanelFactoryService;
    }());
    PanelFactoryService.decorators = [
        { type: core.Injectable }
    ];
    PanelFactoryService.ctorParameters = function () { return [
        { type: core.ComponentFactoryResolver },
        { type: core.ApplicationRef },
        { type: core.Injector }
    ]; };

    var NgxColorsTriggerDirective = /** @class */ (function () {
        function NgxColorsTriggerDirective(triggerRef, panelFactory) {
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
            this.change = new core.EventEmitter();
            // This event is trigger every time the user change the color using the panel
            this.input = new core.EventEmitter();
            this.onTouchedCallback = function () { };
            this.onChangeCallback = function () { };
        }
        NgxColorsTriggerDirective.prototype.onClick = function () {
            this.open();
        };
        NgxColorsTriggerDirective.prototype.open = function () {
            this.panelRef = this.panelFactory.createPanel();
            this.panelRef.instance.iniciate(this, this.triggerRef, this.color, this.palette, this.colorsAnimation, this.format, this.hideTextInput, this.hideColorPicker, this.acceptLabel);
        };
        NgxColorsTriggerDirective.prototype.close = function () {
            this.panelFactory.removePanel();
        };
        NgxColorsTriggerDirective.prototype.onChange = function () {
            this.onChangeCallback(this.color);
        };
        NgxColorsTriggerDirective.prototype.setColor = function (color) {
            this.writeValue(color);
            this.input.emit(color);
        };
        Object.defineProperty(NgxColorsTriggerDirective.prototype, "value", {
            get: function () {
                return this.color;
            },
            set: function (value) {
                this.setColor(value);
                this.onChangeCallback(value);
            },
            enumerable: false,
            configurable: true
        });
        NgxColorsTriggerDirective.prototype.writeValue = function (value) {
            if (value !== this.color) {
                this.color = value;
                this.onChange();
                this.change.emit(value);
            }
        };
        NgxColorsTriggerDirective.prototype.registerOnChange = function (fn) {
            this.onChangeCallback = fn;
        };
        NgxColorsTriggerDirective.prototype.registerOnTouched = function (fn) {
            this.onTouchedCallback = fn;
        };
        return NgxColorsTriggerDirective;
    }());
    NgxColorsTriggerDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[ngx-colors-trigger]',
                    providers: [
                        {
                            provide: forms.NG_VALUE_ACCESSOR,
                            useExisting: core.forwardRef(function () { return NgxColorsTriggerDirective; }),
                            multi: true
                        }
                    ]
                },] }
    ];
    NgxColorsTriggerDirective.ctorParameters = function () { return [
        { type: core.ElementRef },
        { type: PanelFactoryService }
    ]; };
    NgxColorsTriggerDirective.propDecorators = {
        colorsAnimation: [{ type: core.Input }],
        palette: [{ type: core.Input }],
        format: [{ type: core.Input }],
        hideTextInput: [{ type: core.Input }],
        hideColorPicker: [{ type: core.Input }],
        acceptLabel: [{ type: core.Input }],
        change: [{ type: core.Output }],
        input: [{ type: core.Output }],
        onClick: [{ type: core.HostListener, args: ['click',] }]
    };

    var NgxColorsComponent = /** @class */ (function () {
        function NgxColorsComponent(triggerDirective) {
            this.triggerDirective = triggerDirective;
            //IO color
            this.color = this.triggerDirective.color;
        }
        // @ViewChild(NgxColorsTriggerDirective) triggerDirective;
        NgxColorsComponent.prototype.ngOnInit = function () {
            var _this = this;
            this.triggerDirective.change.subscribe(function (color) { _this.color = color; });
        };
        return NgxColorsComponent;
    }());
    NgxColorsComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'ngx-colors',
                    template: "<div class=\"app-color-picker\">\r\n  <div class=\"preview\">\r\n    <div class=\"preview-background\">\r\n      <div\r\n        class=\"circle\"\r\n        [class.colornull]=\"!color\"\r\n        [ngStyle]=\"{ background: color }\"\r\n      ></div>\r\n    </div>\r\n  </div>\r\n</div>\r\n",
                    encapsulation: core.ViewEncapsulation.None,
                    styles: ["ngx-colors .app-color-picker{font-family:sans-serif;line-height:1px}ngx-colors .app-color-picker .preview{background:#fff;border-radius:100%;box-shadow:0 1px 1px 0 rgba(0,0,0,.2),0 1px 1px 1px rgba(0,0,0,.14),0 1px 1px 1px rgba(0,0,0,.12);box-sizing:border-box;cursor:pointer;display:inline-block;margin:2px;padding:3px}ngx-colors .app-color-picker .preview .preview-background{background:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw1AUhU/TSkUqDnYQEclQnSyIijhqFYpQIdQKrTqYvPQPmjQkKS6OgmvBwZ/FqoOLs64OroIg+APi5Oik6CIl3pcUWsR44fE+zrvn8N59gNCoMM0KjQOabpvpZELM5lbF8CsCCCGKYQzIzDLmJCkF3/q6p26quzjP8u/7s3rVvMWAgEg8ywzTJt4gnt60Dc77xFFWklXic+Ixky5I/Mh1xeM3zkWXBZ4ZNTPpeeIosVjsYKWDWcnUiKeIY6qmU76Q9VjlvMVZq9RY6578hZG8vrLMdVpDSGIRS5AgQkENZVRgI067ToqFNJ0nfPyDrl8il0KuMhg5FlCFBtn1g//B79lahckJLymSALpeHOdjBAjvAs2643wfO07zBAg+A1d6219tADOfpNfbWuwI6NsGLq7bmrIHXO4AA0+GbMquFKQlFArA+xl9Uw7ovwV61ry5tc5x+gBkaFapG+DgEBgtUva6z7u7O+f2b09rfj8vXnKMvOB8PQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+QBBBQmO5r5LH8AAAArSURBVDjLY/z///9/Bjzg7Nmz+KQZmBgoBKMGDAYDWAjFs7Gx8WggDn8DAOBdCYVQIsgKAAAAAElFTkSuQmCC\");border-radius:100%}ngx-colors .app-color-picker .preview .circle{border-radius:100%;box-sizing:border-box;cursor:pointer;height:20px;width:20px}ngx-colors .app-color-picker .preview .circle.colornull{background:linear-gradient(135deg,hsla(0,0%,92.5%,.7),hsla(0,0%,92.5%,.7) 45%,#de0f00 50%,hsla(0,0%,92.5%,.7) 55%,hsla(0,0%,92.5%,.7))}ngx-colors .app-color-picker .preview .noselected{background:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw1AUhU/TSkUqDnYQEclQnSyIijhqFYpQIdQKrTqYvPQPmjQkKS6OgmvBwZ/FqoOLs64OroIg+APi5Oik6CIl3pcUWsR44fE+zrvn8N59gNCoMM0KjQOabpvpZELM5lbF8CsCCCGKYQzIzDLmJCkF3/q6p26quzjP8u/7s3rVvMWAgEg8ywzTJt4gnt60Dc77xFFWklXic+Ixky5I/Mh1xeM3zkWXBZ4ZNTPpeeIosVjsYKWDWcnUiKeIY6qmU76Q9VjlvMVZq9RY6578hZG8vrLMdVpDSGIRS5AgQkENZVRgI067ToqFNJ0nfPyDrl8il0KuMhg5FlCFBtn1g//B79lahckJLymSALpeHOdjBAjvAs2643wfO07zBAg+A1d6219tADOfpNfbWuwI6NsGLq7bmrIHXO4AA0+GbMquFKQlFArA+xl9Uw7ovwV61ry5tc5x+gBkaFapG+DgEBgtUva6z7u7O+f2b09rfj8vXnKMvOB8PQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+QBBBQmO5r5LH8AAAArSURBVDjLY/z///9/Bjzg7Nmz+KQZmBgoBKMGDAYDWAjFs7Gx8WggDn8DAOBdCYVQIsgKAAAAAElFTkSuQmCC\")}.ngx-colors-overlay{height:100%;left:0;position:fixed;top:0;width:100%;z-index:2000}"]
                },] }
    ];
    NgxColorsComponent.ctorParameters = function () { return [
        { type: NgxColorsTriggerDirective, decorators: [{ type: core.Host }] }
    ]; };

    var IconsComponent = /** @class */ (function () {
        function IconsComponent() {
        }
        IconsComponent.prototype.ngOnInit = function () {
        };
        return IconsComponent;
    }());
    IconsComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'icons',
                    template: "<ng-container *ngIf=\"icon == 'add'\">\r\n    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z\"/><path d=\"M0 0h24v24H0z\" fill=\"none\"/></svg>\r\n</ng-container>\r\n<ng-container *ngIf=\"icon == 'back'\">\r\n    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z\"/></svg>\r\n</ng-container>",
                    styles: [""]
                },] }
    ];
    IconsComponent.ctorParameters = function () { return []; };
    IconsComponent.propDecorators = {
        icon: [{ type: core.Input }]
    };

    var SliderPosition = /** @class */ (function () {
        function SliderPosition(h, s, v, a) {
            this.h = h;
            this.s = s;
            this.v = v;
            this.a = a;
        }
        return SliderPosition;
    }());
    var SliderDimension = /** @class */ (function () {
        function SliderDimension(h, s, v, a) {
            this.h = h;
            this.s = s;
            this.v = v;
            this.a = a;
        }
        return SliderDimension;
    }());

    var ColorPickerComponent = /** @class */ (function () {
        function ColorPickerComponent(service) {
            this.service = service;
            //IO color
            this.color = new Hsva(0, 1, 1, 1);
            this.colorChange = new core.EventEmitter(false);
            //Event triggered when any slider change
            // @Output() colorSelectedChange:EventEmitter<Hsva> = new EventEmitter<Hsva>(false); 
            this.hsva = new Hsva(0, 1, 1, 1);
            this.selectedColor = '#000000';
            this.fallbackColor = '#000000';
        }
        ColorPickerComponent.prototype.ngOnInit = function () {
            if (!this.color) {
                this.color = new Hsva(0, 1, 1, 1);
            }
            this.slider = new SliderPosition(0, 0, 0, 0);
            var hueWidth = this.hueSlider.nativeElement.offsetWidth || 140;
            var alphaWidth = this.alphaSlider.nativeElement.offsetWidth || 140;
            this.sliderDimMax = new SliderDimension(hueWidth, 220, 130, alphaWidth);
            // this.setColorFromString((this.color || this.fallbackColor));
            this.update();
        };
        ColorPickerComponent.prototype.ngOnDestroy = function () {
        };
        ColorPickerComponent.prototype.ngOnChanges = function (changes) {
            if (changes.color && this.color) {
                this.update();
            }
        };
        ColorPickerComponent.prototype.ngAfterViewInit = function () {
        };
        ColorPickerComponent.prototype.onSliderChange = function (type, event) {
            switch (type) {
                case 'saturation-lightness':
                    this.hsva.onColorChange(event);
                    break;
                case 'hue':
                    this.hsva.onHueChange(event);
                    break;
                case 'alpha':
                    this.hsva.onAlphaChange(event);
                    break;
                case 'value':
                    this.hsva.onValueChange(event);
                    break;
            }
            // this.sHue = this.hsva.h;
            this.update();
            this.setColor(this.outputColor);
        };
        ColorPickerComponent.prototype.setColor = function (color) {
            this.color = color;
            this.colorChange.emit(this.color);
        };
        ColorPickerComponent.prototype.update = function () {
            this.hsva = this.color;
            if (this.sliderDimMax) {
                var rgba = this.service.hsvaToRgba(this.hsva).denormalize();
                var hue = this.service.hsvaToRgba(new Hsva(this.hsva.h, 1, 1, 1)).denormalize();
                this.hueSliderColor = 'rgb(' + hue.r + ',' + hue.g + ',' + hue.b + ')';
                this.alphaSliderColor = 'rgb(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ')';
                this.outputColor = this.hsva;
                this.selectedColor = this.service.hsvaToRgba(this.hsva).toString();
                this.slider = new SliderPosition(
                // (this.sHue || this.hsva.h) * this.sliderDimMax.h - 8,
                this.hsva.h * this.sliderDimMax.h - 8, this.hsva.s * this.sliderDimMax.s - 8, (1 - this.hsva.v) * this.sliderDimMax.v - 8, this.hsva.a * this.sliderDimMax.a - 8);
            }
        };
        return ColorPickerComponent;
    }());
    ColorPickerComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'color-picker',
                    template: "\r\n<div #dialogPopup class=\"color-picker\" (click)=\"$event.stopPropagation()\">\r\n  \r\n  <div class=\"saturation-lightness\" [slider] [rgX]=\"1\" [rgY]=\"1\" [style.background-color]=\"hueSliderColor\" (newValue)=\"onSliderChange('saturation-lightness',$event)\">\r\n        <div class=\"cursor\" [style.top.px]=\"slider?.v\" [style.left.px]=\"slider?.s\">\r\n\r\n      <div></div>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"hue-alpha box\">\r\n    <div class=\"left\">\r\n      <div class=\"selected-color-background\"></div>\r\n      <div class=\"selected-color\" [style.background-color]=\"selectedColor\"></div>      \r\n    </div>\r\n\r\n    <div class=\"right\">\r\n\r\n      <div #hueSlider class=\"hue\" [slider] [rgX]=\"1\" (newValue)=\"onSliderChange('hue',$event)\">\r\n         <div class=\"sliderCursor\" [style.left.px]=\"slider?.h\"><div><div></div></div></div>\r\n      </div>\r\n\r\n      <div #alphaSlider class=\"alpha\" [slider] [rgX]=\"1\" [style.background-color]=\"alphaSliderColor\" (newValue)=\"onSliderChange('alpha',$event)\" >\r\n         <div class=\"sliderCursor\" [style.left.px]=\"slider?.a\"><div><div></div></div></div>\r\n      \r\n      </div>\r\n\r\n    </div>\r\n  </div>\r\n</div>",
                    encapsulation: core.ViewEncapsulation.None,
                    styles: [".color-picker{-moz-user-select:none;-ms-user-select:none;-webkit-touch-callout:none;-webkit-user-select:none;background-color:#fff;cursor:default;height:auto;position:relative;touch-action:none;user-select:none;width:220px;z-index:1000}.color-picker *{box-sizing:border-box;font-size:11px;margin:0}.color-picker input{color:#000;font-size:13px;height:26px;min-width:0;text-align:center;width:0}.color-picker input:-moz-submit-invalid,.color-picker input:-moz-ui-invalid,.color-picker input:invalid{box-shadow:none}.color-picker input::-webkit-inner-spin-button,.color-picker input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}.color-picker .sliderCursor{border:1px solid #000;border-radius:5px;margin-top:-3px;position:absolute;width:10px}.color-picker .sliderCursor>div{border:2px solid #fff;border-radius:5px}.color-picker .sliderCursor>div>div{border:1px solid #000;border-radius:5px;height:15px}.color-picker .cursor{border:3px solid #000;border-radius:100%;margin:-2px 0 0 -2px;position:absolute;width:21px}.color-picker .cursor>div{border:3px solid #fff;border-radius:100%;height:15px}.color-picker .box{display:flex;padding:4px 8px}.color-picker .left{padding:16px 8px;position:relative}.color-picker .right{flex:1 1 auto;padding:12px 8px}.color-picker .hue-alpha{align-items:center;margin-bottom:3px}.color-picker .hue{background-image:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAQCAYAAAD06IYnAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AIWDwkUFWbCCAAAAFxJREFUaN7t0kEKg0AQAME2x83/n2qu5qCgD1iDhCoYdpnbQC9bbY1qVO/jvc6k3ad91s7/7F1/csgPrujuQ17BDYSFsBAWwgJhISyEBcJCWAgLhIWwEBYIi2f7Ar/1TCgFH2X9AAAAAElFTkSuQmCC\");direction:ltr;position:relative}.color-picker .hue,.color-picker .value{background-size:100% 100%;border:none;cursor:pointer;height:16px;margin-bottom:16px;width:100%}.color-picker .value{background-image:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAQCAYAAAD06IYnAAACTklEQVR42u3SYUcrABhA4U2SkmRJMmWSJklKJiWZZpKUJJskKUmaTFImKZOUzMySpGRmliRNJilJSpKSJEtmSpIpmWmSdO736/6D+x7OP3gUCoWCv1cqlSQlJZGcnExKSgqpqamkpaWRnp5ORkYGmZmZqFQqsrKyyM7OJicnh9zcXNRqNXl5eeTn56PRaCgoKKCwsJCioiK0Wi3FxcWUlJRQWlpKWVkZ5eXlVFRUUFlZiU6no6qqiurqampqaqitraWurg69Xk99fT0GgwGj0UhDQwONjY00NTXR3NxMS0sLra2ttLW10d7ejslkwmw209HRQWdnJ11dXXR3d9PT00Nvby99fX309/czMDDA4OAgFouFoaEhrFYrw8PDjIyMMDo6ytjYGDabjfHxcSYmJpicnGRqagq73c709DQzMzPMzs4yNzfH/Pw8DocDp9OJy+XC7XazsLDA4uIiS0tLLC8vs7KywurqKmtra3g8HrxeLz6fD7/fz/r6OhsbG2xubrK1tcX29jaBQICdnR2CwSC7u7vs7e2xv7/PwcEBh4eHHB0dcXx8zMnJCaenp5ydnXF+fs7FxQWXl5dcXV1xfX3Nzc0Nt7e33N3dEQqFuL+/5+HhgXA4TCQS4fHxkaenJ56fn3l5eeH19ZVoNMrb2xvv7+98fHwQi8WIx+N8fn6SSCT4+vri+/ubn58ffn9/+VcKgSWwBJbAElgCS2AJLIElsASWwBJYAktgCSyBJbAElsASWAJLYAksgSWwBJbAElgCS2AJLIElsP4/WH8AmJ5Z6jHS4h8AAAAASUVORK5CYII=\");direction:rtl}.color-picker .alpha{background-image:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAQCAYAAAD06IYnAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AIWDwYQlZMa3gAAAWVJREFUaN7tmEGO6jAQRCsOArHgBpyAJYGjcGocxAm4A2IHpmoWE0eBH+ezmFlNvU06shJ3W6VEelWMUQAIIF9f6qZpimsA1LYtS2uF51/u27YVAFZVRUkEoGHdPV/sIcbIEIIkUdI/9Xa7neyv61+SWFUVAVCSct00TWn2fv6u3+Ecfd3tXzy/0+nEUu+SPjo/kqzrmiQpScN6v98XewfA8/lMkiLJ2WxGSUopcT6fM6U0NX9/frfbjev1WtfrlZfLhYfDQQHG/AIOlnGwjINlHCxjHCzjYJm/TJWdCwquJXseFFzGwDNNeiKMOJTO8xQdDQaeB29+K9efeLaBo9J7vdvtJj1RjFFjfiv7qv95tjx/7leSQgh93e1ffMeIp6O+YQjho/N791t1XVOSSI7N//K+4/GoxWLBx+PB5/Op5XLJ+/3OlJJWqxU3m83ovv5iGf8KjYNlHCxjHCzjYBkHy5gf5gusvQU7U37jTAAAAABJRU5ErkJggg==\");background-size:100% 100%;border:none;cursor:pointer;direction:ltr;height:16px;position:relative;width:100%}.color-picker .selected-color{border-radius:50%;box-shadow:0 1px 1px 1px rgba(0,0,0,.15);height:40px;left:8px;position:absolute;top:16px;width:40px}.color-picker .selected-color-background{background-image:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAh0lEQVRYR+2W0QlAMQgD60zdfwOdqa8TmI/wQMr5K0I5bZLIzLOa2nt37VVVbd+dDx5obgCC3KBLwJ2ff4PnVidkf+ucIhw80HQaCLo3DMH3CRK3iFsmAWVl6hPNDwt8EvNE5q+YuEXcMgkonVM6SdyCoEvAnZ8v1Hjx817MilmxSUB5rdLJDycZgUAZUch/AAAAAElFTkSuQmCC\");border-radius:50%;height:40px;width:40px}.color-picker .saturation-lightness{background-image:url(\"data:image/png;base64,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\");background-size:100% 100%;border:none;cursor:crosshair;direction:ltr;height:130px;position:relative;touch-action:manipulation;width:100%}"]
                },] }
    ];
    ColorPickerComponent.ctorParameters = function () { return [
        { type: ConverterService }
    ]; };
    ColorPickerComponent.propDecorators = {
        color: [{ type: core.Input }],
        colorChange: [{ type: core.Output }],
        hueSlider: [{ type: core.ViewChild, args: ['hueSlider', { static: true },] }],
        alphaSlider: [{ type: core.ViewChild, args: ['alphaSlider', { static: true },] }]
    };

    var SliderDirective = /** @class */ (function () {
        function SliderDirective(elRef) {
            var _this = this;
            this.elRef = elRef;
            this.dragEnd = new core.EventEmitter();
            this.dragStart = new core.EventEmitter();
            this.newValue = new core.EventEmitter();
            this.listenerMove = function (event) { return _this.move(event); };
            this.listenerStop = function () { return _this.stop(); };
        }
        SliderDirective.prototype.mouseDown = function (event) {
            this.start(event);
        };
        SliderDirective.prototype.touchStart = function (event) {
            this.start(event);
        };
        SliderDirective.prototype.move = function (event) {
            event.preventDefault();
            this.setCursor(event);
        };
        SliderDirective.prototype.start = function (event) {
            this.setCursor(event);
            event.stopPropagation();
            document.addEventListener('mouseup', this.listenerStop);
            document.addEventListener('touchend', this.listenerStop);
            document.addEventListener('mousemove', this.listenerMove);
            document.addEventListener('touchmove', this.listenerMove);
            this.dragStart.emit();
        };
        SliderDirective.prototype.stop = function () {
            document.removeEventListener('mouseup', this.listenerStop);
            document.removeEventListener('touchend', this.listenerStop);
            document.removeEventListener('mousemove', this.listenerMove);
            document.removeEventListener('touchmove', this.listenerMove);
            this.dragEnd.emit();
        };
        SliderDirective.prototype.getX = function (event) {
            var position = this.elRef.nativeElement.getBoundingClientRect();
            var pageX = (event.pageX !== undefined) ? event.pageX : event.touches[0].pageX;
            return pageX - position.left - window.pageXOffset;
        };
        SliderDirective.prototype.getY = function (event) {
            var position = this.elRef.nativeElement.getBoundingClientRect();
            var pageY = (event.pageY !== undefined) ? event.pageY : event.touches[0].pageY;
            return pageY - position.top - window.pageYOffset;
        };
        SliderDirective.prototype.setCursor = function (event) {
            var width = this.elRef.nativeElement.offsetWidth;
            var height = this.elRef.nativeElement.offsetHeight;
            var x = Math.max(0, Math.min(this.getX(event), width));
            var y = Math.max(0, Math.min(this.getY(event), height));
            if (this.rgX !== undefined && this.rgY !== undefined) {
                this.newValue.emit({ s: x / width, v: (1 - y / height), rgX: this.rgX, rgY: this.rgY });
            }
            else if (this.rgX === undefined && this.rgY !== undefined) {
                this.newValue.emit({ v: y / height, rgY: this.rgY });
            }
            else if (this.rgX !== undefined && this.rgY === undefined) {
                this.newValue.emit({ v: x / width, rgX: this.rgX });
            }
        };
        return SliderDirective;
    }());
    SliderDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[slider]'
                },] }
    ];
    SliderDirective.ctorParameters = function () { return [
        { type: core.ElementRef }
    ]; };
    SliderDirective.propDecorators = {
        rgX: [{ type: core.Input }],
        rgY: [{ type: core.Input }],
        slider: [{ type: core.Input }],
        dragEnd: [{ type: core.Output }],
        dragStart: [{ type: core.Output }],
        newValue: [{ type: core.Output }],
        mouseDown: [{ type: core.HostListener, args: ['mousedown', ['$event'],] }],
        touchStart: [{ type: core.HostListener, args: ['touchstart', ['$event'],] }]
    };

    var NgxColorsModule = /** @class */ (function () {
        function NgxColorsModule() {
        }
        return NgxColorsModule;
    }());
    NgxColorsModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [NgxColorsComponent, IconsComponent, ColorPickerComponent, SliderDirective, PanelComponent, NgxColorsTriggerDirective],
                    imports: [
                        common.CommonModule
                    ],
                    providers: [ConverterService, PanelFactoryService],
                    exports: [NgxColorsComponent, NgxColorsTriggerDirective],
                    entryComponents: [PanelComponent, ColorPickerComponent]
                },] }
    ];

    var NgxColor = /** @class */ (function () {
        function NgxColor() {
        }
        return NgxColor;
    }());

    /*
     * Public API Surface of ngx-colors
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.NgxColor = NgxColor;
    exports.NgxColorsComponent = NgxColorsComponent;
    exports.NgxColorsModule = NgxColorsModule;
    exports.NgxColorsTriggerDirective = NgxColorsTriggerDirective;
    exports.ɵa = PanelFactoryService;
    exports.ɵb = IconsComponent;
    exports.ɵc = ColorPickerComponent;
    exports.ɵd = ConverterService;
    exports.ɵe = SliderDirective;
    exports.ɵf = PanelComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-colors.umd.js.map
