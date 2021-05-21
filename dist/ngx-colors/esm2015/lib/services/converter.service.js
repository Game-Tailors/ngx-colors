import { Injectable } from '@angular/core';
import { Cmyk, Rgba, Hsla, Hsva } from '../clases/formats';
import { ColorFormats } from '../enums/formats';
export class ConverterService {
    // private active: ColorPickerComponent | null = null;
    constructor() { }
    // public setActive(active: ColorPickerComponent | null): void {
    //   this.active = active;
    // }
    toFormat(hsva, format) {
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
    }
    stringToFormat(color, format) {
        var hsva = this.stringToHsva(color, true);
        return this.toFormat(hsva, format);
    }
    hsva2hsla(hsva) {
        const h = hsva.h, s = hsva.s, v = hsva.v, a = hsva.a;
        if (v === 0) {
            return new Hsla(h, 0, 0, a);
        }
        else if (s === 0 && v === 1) {
            return new Hsla(h, 1, 1, a);
        }
        else {
            const l = v * (2 - s) / 2;
            return new Hsla(h, v * s / (1 - Math.abs(2 * l - 1)), l, a);
        }
    }
    hsla2hsva(hsla) {
        const h = Math.min(hsla.h, 1), s = Math.min(hsla.s, 1);
        const l = Math.min(hsla.l, 1), a = Math.min(hsla.a, 1);
        if (l === 0) {
            return new Hsva(h, 0, 0, a);
        }
        else {
            const v = l + s * (1 - Math.abs(2 * l - 1)) / 2;
            return new Hsva(h, 2 * (v - l) / v, v, a);
        }
    }
    hsvaToRgba(hsva) {
        let r, g, b;
        const h = hsva.h, s = hsva.s, v = hsva.v, a = hsva.a;
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
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
    }
    cmykToRgb(cmyk) {
        const r = (1 - cmyk.c) * (1 - cmyk.k);
        const g = (1 - cmyk.m) * (1 - cmyk.k);
        const b = (1 - cmyk.y) * (1 - cmyk.k);
        return new Rgba(r, g, b, cmyk.a);
    }
    rgbaToCmyk(rgba) {
        const k = 1 - Math.max(rgba.r, rgba.g, rgba.b);
        if (k === 1) {
            return new Cmyk(0, 0, 0, 1, rgba.a);
        }
        else {
            const c = (1 - rgba.r - k) / (1 - k);
            const m = (1 - rgba.g - k) / (1 - k);
            const y = (1 - rgba.b - k) / (1 - k);
            return new Cmyk(c, m, y, k, rgba.a);
        }
    }
    rgbaToHsva(rgba) {
        let h, s;
        const r = Math.min(rgba.r, 1), g = Math.min(rgba.g, 1);
        const b = Math.min(rgba.b, 1), a = Math.min(rgba.a, 1);
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const v = max, d = max - min;
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
    }
    rgbaToHex(rgba, allowHex8) {
        /* tslint:disable:no-bitwise */
        let hex = '#' + ((1 << 24) | (rgba.r << 16) | (rgba.g << 8) | rgba.b).toString(16).substr(1);
        if (rgba.a != 1) {
            hex += ((1 << 8) | Math.round(rgba.a * 255)).toString(16).substr(1);
        }
        /* tslint:enable:no-bitwise */
        return hex;
    }
    normalizeCMYK(cmyk) {
        return new Cmyk(cmyk.c / 100, cmyk.m / 100, cmyk.y / 100, cmyk.k / 100, cmyk.a);
    }
    denormalizeCMYK(cmyk) {
        return new Cmyk(Math.floor(cmyk.c * 100), Math.floor(cmyk.m * 100), Math.floor(cmyk.y * 100), Math.floor(cmyk.k * 100), cmyk.a);
    }
    denormalizeRGBA(rgba) {
        return new Rgba(Math.round(rgba.r * 255), Math.round(rgba.g * 255), Math.round(rgba.b * 255), rgba.a);
    }
    stringToHsva(colorString = '', allowHex8 = true) {
        let hsva = null;
        colorString = (colorString || '').toLowerCase();
        const stringParsers = [
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
        for (const key in stringParsers) {
            if (stringParsers.hasOwnProperty(key)) {
                const parser = stringParsers[key];
                const match = parser.re.exec(colorString), color = match && parser.parse(match);
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
    }
    outputFormat(hsva) {
        return this.hsvaToRgba(hsva).toString();
    }
    getFormatByString(color) {
        if (color) {
            color = color.toLowerCase();
            let regexHex = /(#([\da-f]{3}(?:[\da-f]{3})?(?:[\da-f]{2})?))/;
            let regexRGBA = /(rgba\((\d{1,3},\s?){3}(1|0?\.\d+)\)|rgb\(\d{1,3}(,\s?\d{1,3}){2}\))/;
            let regexHSLA = /(hsla\((\d{1,3}%?,\s?){3}(1|0?\.\d+)\)|hsl\(\d{1,3}%?(,\s?\d{1,3}%?){2}\))/;
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
    }
}
ConverterService.decorators = [
    { type: Injectable }
];
ConverterService.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udmVydGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtY29sb3JzL3NyYy9saWIvc2VydmljZXMvY29udmVydGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFHM0QsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBR2hELE1BQU0sT0FBTyxnQkFBZ0I7SUFDM0Isc0RBQXNEO0lBRXRELGdCQUFlLENBQUM7SUFFaEIsZ0VBQWdFO0lBQ2hFLDBCQUEwQjtJQUMxQixJQUFJO0lBR0osUUFBUSxDQUFDLElBQVMsRUFBQyxNQUFtQjtRQUNwQyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEIsUUFBTyxNQUFNLEVBQUM7WUFDWixLQUFLLFlBQVksQ0FBQyxHQUFHO2dCQUNuQixJQUFJLElBQUksR0FBUSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ25CLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN2QyxNQUFNO1lBQ1IsS0FBSyxZQUFZLENBQUMsSUFBSTtnQkFDcEIsSUFBSSxJQUFJLEdBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDckMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUNuQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQzdCLE1BQU07WUFDUixLQUFLLFlBQVksQ0FBQyxJQUFJO2dCQUNwQixJQUFJ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RUFBRSxDQUFTLENBQUM7UUFFcEMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUVyRCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM1QixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwQixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMxQixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFaEMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2IsS0FBSyxDQUFDO2dCQUNKLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQixNQUFNO1lBQ1IsS0FBSyxDQUFDO2dCQUNKLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQixNQUFNO1lBQ1IsS0FBSyxDQUFDO2dCQUNKLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQixNQUFNO1lBQ1IsS0FBSyxDQUFDO2dCQUNKLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQixNQUFNO1lBQ1IsS0FBSyxDQUFDO2dCQUNKLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQixNQUFNO1lBQ1IsS0FBSyxDQUFDO2dCQUNKLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQixNQUFNO1lBQ1I7Z0JBQ0UsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDdkI7UUFFRCxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFTSxTQUFTLENBQUMsSUFBVTtRQUN6QixNQUFNLENBQUMsR0FBRyxDQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxHQUFHLENBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEMsTUFBTSxDQUFDLEdBQUcsQ0FBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV4QyxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRU0sVUFBVSxDQUFDLElBQVU7UUFDMUIsTUFBTSxDQUFDLEdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV2RCxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDWCxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDckM7YUFBTTtZQUNMLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDckMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNyQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBRXJDLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNyQztJQUNILENBQUM7SUFFTSxVQUFVLENBQUMsSUFBVTtRQUMxQixJQUFJLENBQVMsRUFBRSxDQUFTLENBQUM7UUFFekIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkQsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFdkQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxD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LEtBQUssRUFBRTtvQkFDVCxJQUFJLEtBQUssWUFBWSxJQUFJLEVBQUU7d0JBQ3pCLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO3FCQUMvQjt5QkFBTSxJQUFJLEtBQUssWUFBWSxJQUFJLEVBQUU7d0JBQ2hDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO3FCQUM5QjtvQkFFRCxPQUFPLElBQUksQ0FBQztpQkFDYjthQUNGO1NBQ0Y7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSxZQUFZLENBQUMsSUFBVTtRQUU1QixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDMUMsQ0FBQztJQUVNLGlCQUFpQixDQUFDLEtBQWE7UUFDcEMsSUFBRyxLQUFLLEVBQUM7WUFDUCxLQUFLLEdBQUcsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQzVCLElBQUksUUFBUSxHQUFVLCtDQUErQyxDQUFBO1lBQ3JFLElBQUksU0FBUyxHQUFVLHNFQUFzRSxDQUFBO1lBQzdGLElBQUksU0FBUyxHQUFVLDRFQUE0RSxDQUFBO1lBQ25HLElBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBQztnQkFDdEIsT0FBTyxLQUFLLENBQUE7YUFDYjtpQkFDSSxJQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUM7Z0JBQzVCLE9BQU8sTUFBTSxDQUFBO2FBQ2Q7aUJBQ0ksSUFBRyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFDO2dCQUM1QixPQUFPLE1BQU0sQ0FBQTthQUNkO1NBQ0Y7UUFDRCxPQUFPLEtBQUssQ0FBQTtJQUNkLENBQUM7OztZQWpTRixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgQ215aywgUmdiYSwgSHNsYSwgSHN2YSB9IGZyb20gJy4uL2NsYXNlcy9mb3JtYXRzJztcclxuXHJcbmltcG9ydCB7IENvbG9yUGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi4vY29tcG9uZW50cy9jb2xvci1waWNrZXIvY29sb3ItcGlja2VyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENvbG9yRm9ybWF0cyB9IGZyb20gJy4uL2VudW1zL2Zvcm1hdHMnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ29udmVydGVyU2VydmljZSB7XHJcbiAgLy8gcHJpdmF0ZSBhY3RpdmU6IENvbG9yUGlja2VyQ29tcG9uZW50IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgLy8gcHVibGljIHNldEFjdGl2ZShhY3RpdmU6IENvbG9yUGlja2VyQ29tcG9uZW50IHwgbnVsbCk6IHZvaWQge1xyXG4gIC8vICAgdGhpcy5hY3RpdmUgPSBhY3RpdmU7XHJcbiAgLy8gfVxyXG5cclxuXHJcbiAgdG9Gb3JtYXQoaHN2YTpIc3ZhLGZvcm1hdDpDb2xvckZvcm1hdHMpe1xyXG4gICAgdmFyIG91dHB1dCA9ICcnO1xyXG4gICAgc3dpdGNoKGZvcm1hdCl7XHJcbiAgICAgIGNhc2UgQ29sb3JGb3JtYXRzLkhFWDpcclxuICAgICAgICB2YXIgcmdiYTpSZ2JhID0gdGhpcy5oc3ZhVG9SZ2JhKGhzdmEpO1xyXG4gICAgICAgIHJnYmEuZGVub3JtYWxpemUoKTtcclxuICAgICAgICB2YXIgb3V0cHV0ID0gdGhpcy5yZ2JhVG9IZXgocmdiYSx0cnVlKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBDb2xvckZvcm1hdHMuSFNMQTpcclxuICAgICAgICB2YXIgaHNsYTpIc2xhID0gdGhpcy5oc3ZhMmhzbGEoaHN2YSk7XHJcbiAgICAgICAgaHNsYS5kZW5vcm1hbGl6ZSgpO1xyXG4gICAgICAgIHZhciBvdXRwdXQgPSBoc2xhLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgQ29sb3JGb3JtYXRzLlJHQkE6XHJcbiAgICAgICAgdmFyIHJnYmE6UmdiYSA9IHRoaXMuaHN2YVRvUmdiYShoc3ZhKTtcclxuICAgICAgICB2YXIgb3V0cHV0ID0gcmdiYS50b1N0cmluZygpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIENvbG9yRm9ybWF0cy5DTVlLOlxyXG4gICAgICAgIHZhciByZ2JhOlJnYmEgPSB0aGlzLmhzdmFUb1JnYmEoaHN2YSk7XHJcbiAgICAgICAgdmFyIGNteWs6Q215ayA9IHRoaXMucmdiYVRvQ215ayhyZ2JhKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RyaW5nVG9Gb3JtYXQoY29sb3I6c3RyaW5nLCBmb3JtYXQ6Q29sb3JGb3JtYXRzKXtcclxuICAgIHZhciBoc3ZhID0gdGhpcy5zdHJpbmdUb0hzdmEoY29sb3IsdHJ1ZSk7XHJcbiAgICByZXR1cm4gdGhpcy50b0Zvcm1hdChoc3ZhLGZvcm1hdCk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIHB1YmxpYyBoc3ZhMmhzbGEoaHN2YTogSHN2YSk6IEhzbGEge1xyXG4gICAgY29uc3QgaCA9IGhzdmEuaCwgcyA9IGhzdmEucywgdiA9IGhzdmEudiwgYSA9IGhzdmEuYTtcclxuXHJcbiAgICBpZiAodiA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gbmV3IEhzbGEoaCwgMCwgMCwgYSk7XHJcbiAgICB9IGVsc2UgaWYgKHMgPT09IDAgJiYgdiA9PT0gMSkge1xyXG4gICAgICByZXR1cm4gbmV3IEhzbGEoaCwgMSwgMSwgYSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCBsID0gdiAqICgyIC0gcykgLyAyO1xyXG5cclxuICAgICAgcmV0dXJuIG5ldyBIc2xhKGgsIHYgKiBzIC8gKDEgLSBNYXRoLmFicygyICogbCAtIDEpKSwgbCwgYSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaHNsYTJoc3ZhKGhzbGE6IEhzbGEpOiBIc3ZhIHtcclxuICAgIGNvbnN0IGggPSBNYXRoLm1pbihoc2xhLmgsIDEpLCBzID0gTWF0aC5taW4oaHNsYS5zLCAxKTtcclxuICAgIGNvbnN0IGwgPSBNYXRoLm1pbihoc2xhLmwsIDEpLCBhID0gTWF0aC5taW4oaHNsYS5hLCAxKTtcclxuXHJcbiAgICBpZiAobCA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gbmV3IEhzdmEoaCwgMCwgMCwgYSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCB2ID0gbCArIHMgKiAoMSAtIE1hdGguYWJzKDIgKiBsIC0gMSkpIC8gMjtcclxuXHJcbiAgICAgIHJldHVybiBuZXcgSHN2YShoLCAyICogKHYgLSBsKSAvIHYsIHYsIGEpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGhzdmFUb1JnYmEoaHN2YTogSHN2YSk6IFJnYmEge1xyXG4gICAgbGV0IHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXI7XHJcblxyXG4gICAgY29uc3QgaCA9IGhzdmEuaCwgcyA9IGhzdmEucywgdiA9IGhzdmEudiwgYSA9IGhzdmEuYTtcclxuXHJcbiAgICBjb25zdCBpID0gTWF0aC5mbG9vcihoICogNik7XHJcbiAgICBjb25zdCBmID0gaCAqIDYgLSBpO1xyXG4gICAgY29uc3QgcCA9IHYgKiAoMSAtIHMpO1xyXG4gICAgY29uc3QgcSA9IHYgKiAoMSAtIGYgKiBzKTtcclxuICAgIGNvbnN0IHQgPSB2ICogKDEgLSAoMSAtIGYpICogcyk7XHJcblxyXG4gICAgc3dpdGNoIChpICUgNikge1xyXG4gICAgICBjYXNlIDA6XHJcbiAgICAgICAgciA9IHYsIGcgPSB0LCBiID0gcDtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAxOlxyXG4gICAgICAgIHIgPSBxLCBnID0gdiwgYiA9IHA7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgMjpcclxuICAgICAgICByID0gcCwgZyA9IHYsIGIgPSB0O1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIDM6XHJcbiAgICAgICAgciA9IHAsIGcgPSBxLCBiID0gdjtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSA0OlxyXG4gICAgICAgIHIgPSB0LCBnID0gcCwgYiA9IHY7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgNTpcclxuICAgICAgICByID0gdiwgZyA9IHAsIGIgPSBxO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHIgPSAwLCBnID0gMCwgYiA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5ldyBSZ2JhKHIsIGcsIGIsIGEpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGNteWtUb1JnYihjbXlrOiBDbXlrKTogUmdiYSB7XHJcbiAgICBjb25zdCByID0gKCAxIC0gY215ay5jICkgKiAoMSAtIGNteWsuayk7XHJcbiAgICBjb25zdCBnID0gKCAxIC0gY215ay5tICkgKiAoMSAtIGNteWsuayk7XHJcbiAgICBjb25zdCBiID0gKCAxIC0gY215ay55ICkgKiAoMSAtIGNteWsuayk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBSZ2JhKHIsIGcsIGIsIGNteWsuYSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmdiYVRvQ215ayhyZ2JhOiBSZ2JhKTogQ215ayB7XHJcbiAgICBjb25zdCBrOiBudW1iZXIgPSAxIC0gTWF0aC5tYXgocmdiYS5yLCByZ2JhLmcsIHJnYmEuYik7XHJcblxyXG4gICAgaWYgKGsgPT09IDEpIHtcclxuICAgICAgcmV0dXJuIG5ldyBDbXlrKDAsIDAsIDAsIDEsIHJnYmEuYSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCBjID0gKDEgLSByZ2JhLnIgLSBrKSAvICgxIC0gayk7XHJcbiAgICAgIGNvbnN0IG0gPSAoMSAtIHJnYmEuZyAtIGspIC8gKDEgLSBrKTtcclxuICAgICAgY29uc3QgeSA9ICgxIC0gcmdiYS5iIC0gaykgLyAoMSAtIGspO1xyXG5cclxuICAgICAgcmV0dXJuIG5ldyBDbXlrKGMsIG0sIHksIGssIHJnYmEuYSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmdiYVRvSHN2YShyZ2JhOiBSZ2JhKTogSHN2YSB7XHJcbiAgICBsZXQgaDogbnVtYmVyLCBzOiBudW1iZXI7XHJcblxyXG4gICAgY29uc3QgciA9IE1hdGgubWluKHJnYmEuciwgMSksIGcgPSBNYXRoLm1pbihyZ2JhLmcsIDEpO1xyXG4gICAgY29uc3QgYiA9IE1hdGgubWluKHJnYmEuYiwgMSksIGEgPSBNYXRoLm1pbihyZ2JhLmEsIDEpO1xyXG5cclxuICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KHIsIGcsIGIpLCBtaW4gPSBNYXRoLm1pbihyLCBnLCBiKTtcclxuXHJcbiAgICBjb25zdCB2OiBudW1iZXIgPSBtYXgsIGQgPSBtYXggLSBtaW47XHJcblxyXG4gICAgcyA9IChtYXggPT09IDApID8gMCA6IGQgLyBtYXg7XHJcblxyXG4gICAgaWYgKG1heCA9PT0gbWluKSB7XHJcbiAgICAgIGggPSAwO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc3dpdGNoIChtYXgpIHtcclxuICAgICAgICBjYXNlIHI6XHJcbiAgICAgICAgICBoID0gKGcgLSBiKSAvIGQgKyAoZyA8IGIgPyA2IDogMCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIGc6XHJcbiAgICAgICAgICBoID0gKGIgLSByKSAvIGQgKyAyO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBiOlxyXG4gICAgICAgICAgaCA9IChyIC0gZykgLyBkICsgNDtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBoID0gMDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaCAvPSA2O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBuZXcgSHN2YShoLCBzLCB2LCBhKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZ2JhVG9IZXgocmdiYTogUmdiYSwgYWxsb3dIZXg4PzogYm9vbGVhbik6IHN0cmluZyB7XHJcbiAgICAvKiB0c2xpbnQ6ZGlzYWJsZTpuby1iaXR3aXNlICovXHJcbiAgICBsZXQgaGV4ID0gJyMnICsgKCgxIDw8IDI0KSB8IChyZ2JhLnIgPDwgMTYpIHwgKHJnYmEuZyA8PCA4KSB8IHJnYmEuYikudG9TdHJpbmcoMTYpLnN1YnN0cigxKTtcclxuXHJcbiAgICBpZiAocmdiYS5hICE9IDEpIHtcclxuICAgICAgaGV4ICs9ICgoMSA8PCA4KSB8IE1hdGgucm91bmQocmdiYS5hICogMjU1KSkudG9TdHJpbmcoMTYpLnN1YnN0cigxKTtcclxuICAgIH1cclxuICAgIC8qIHRzbGludDplbmFibGU6bm8tYml0d2lzZSAqL1xyXG5cclxuICAgIHJldHVybiBoZXg7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbm9ybWFsaXplQ01ZSyhjbXlrOiBDbXlrKTogQ215ayB7XHJcbiAgICByZXR1cm4gbmV3IENteWsoY215ay5jIC8gMTAwLCBjbXlrLm0gLyAxMDAsIGNteWsueSAvIDEwMCwgY215ay5rIC8gMTAwLCBjbXlrLmEpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRlbm9ybWFsaXplQ01ZSyhjbXlrOiBDbXlrKTogQ215ayB7XHJcbiAgICByZXR1cm4gbmV3IENteWsoTWF0aC5mbG9vcihjbXlrLmMgKiAxMDApLCBNYXRoLmZsb29yKGNteWsubSAqIDEwMCksIE1hdGguZmxvb3IoY215ay55ICogMTAwKSxcclxuICAgICAgTWF0aC5mbG9vcihjbXlrLmsgKiAxMDApLCBjbXlrLmEpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRlbm9ybWFsaXplUkdCQShyZ2JhOiBSZ2JhKTogUmdiYSB7XHJcbiAgICByZXR1cm4gbmV3IFJnYmEoTWF0aC5yb3VuZChyZ2JhLnIgKiAyNTUpLCBNYXRoLnJvdW5kKHJnYmEuZyAqIDI1NSksIE1hdGgucm91bmQocmdiYS5iICogMjU1KSwgcmdiYS5hKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdHJpbmdUb0hzdmEoY29sb3JTdHJpbmc6IHN0cmluZyA9ICcnLCBhbGxvd0hleDg6IGJvb2xlYW4gPSB0cnVlKTogSHN2YSB8IG51bGwge1xyXG4gICAgbGV0IGhzdmE6IEhzdmEgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBjb2xvclN0cmluZyA9IChjb2xvclN0cmluZyB8fCAnJykudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICBjb25zdCBzdHJpbmdQYXJzZXJzID0gW1xyXG4gICAgICB7XHJcbiAgICAgICAgcmU6IC8ocmdiKWE/XFwoXFxzKihcXGR7MSwzfSlcXHMqLFxccyooXFxkezEsM30pXFxzKiU/LFxccyooXFxkezEsM30pXFxzKiU/KD86LFxccyooXFxkKyg/OlxcLlxcZCspPylcXHMqKT9cXCkvLFxyXG4gICAgICAgIHBhcnNlOiBmdW5jdGlvbihleGVjUmVzdWx0OiBhbnkpIHtcclxuICAgICAgICAgIHJldHVybiBuZXcgUmdiYShwYXJzZUludChleGVjUmVzdWx0WzJdLCAxMCkgLyAyNTUsXHJcbiAgICAgICAgICAgIHBhcnNlSW50KGV4ZWNSZXN1bHRbM10sIDEwKSAvIDI1NSxcclxuICAgICAgICAgICAgcGFyc2VJbnQoZXhlY1Jlc3VsdFs0XSwgMTApIC8gMjU1LFxyXG4gICAgICAgICAgICBpc05hTihwYXJzZUZsb2F0KGV4ZWNSZXN1bHRbNV0pKSA/IDEgOiBwYXJzZUZsb2F0KGV4ZWNSZXN1bHRbNV0pKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIHtcclxuICAgICAgICByZTogLyhoc2wpYT9cXChcXHMqKFxcZHsxLDN9KVxccyosXFxzKihcXGR7MSwzfSklXFxzKixcXHMqKFxcZHsxLDN9KSVcXHMqKD86LFxccyooXFxkKyg/OlxcLlxcZCspPylcXHMqKT9cXCkvLFxyXG4gICAgICAgIHBhcnNlOiBmdW5jdGlvbihleGVjUmVzdWx0OiBhbnkpIHtcclxuICAgICAgICAgIHJldHVybiBuZXcgSHNsYShwYXJzZUludChleGVjUmVzdWx0WzJdLCAxMCkgLyAzNjAsXHJcbiAgICAgICAgICAgIHBhcnNlSW50KGV4ZWNSZXN1bHRbM10sIDEwKSAvIDEwMCxcclxuICAgICAgICAgICAgcGFyc2VJbnQoZXhlY1Jlc3VsdFs0XSwgMTApIC8gMTAwLFxyXG4gICAgICAgICAgICBpc05hTihwYXJzZUZsb2F0KGV4ZWNSZXN1bHRbNV0pKSA/IDEgOiBwYXJzZUZsb2F0KGV4ZWNSZXN1bHRbNV0pKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIF07XHJcblxyXG4gICAgaWYgKGFsbG93SGV4OCkge1xyXG4gICAgICBzdHJpbmdQYXJzZXJzLnB1c2goe1xyXG4gICAgICAgIHJlOiAvIyhbYS1mQS1GMC05XXsyfSkoW2EtZkEtRjAtOV17Mn0pKFthLWZBLUYwLTldezJ9KShbYS1mQS1GMC05XXsyfSk/JC8sXHJcbiAgICAgICAgcGFyc2U6IGZ1bmN0aW9uKGV4ZWNSZXN1bHQ6IGFueSkge1xyXG4gICAgICAgICAgcmV0dXJuIG5ldyBSZ2JhKHBhcnNlSW50KGV4ZWNSZXN1bHRbMV0sIDE2KSAvIDI1NSxcclxuICAgICAgICAgICAgcGFyc2VJbnQoZXhlY1Jlc3VsdFsyXSwgMTYpIC8gMjU1LFxyXG4gICAgICAgICAgICBwYXJzZUludChleGVjUmVzdWx0WzNdLCAxNikgLyAyNTUsXHJcbiAgICAgICAgICAgIHBhcnNlSW50KGV4ZWNSZXN1bHRbNF0gfHwgJ0ZGJywgMTYpIC8gMjU1KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc3RyaW5nUGFyc2Vycy5wdXNoKHtcclxuICAgICAgICByZTogLyMoW2EtZkEtRjAtOV17Mn0pKFthLWZBLUYwLTldezJ9KShbYS1mQS1GMC05XXsyfSkkLyxcclxuICAgICAgICBwYXJzZTogZnVuY3Rpb24oZXhlY1Jlc3VsdDogYW55KSB7XHJcbiAgICAgICAgICByZXR1cm4gbmV3IFJnYmEocGFyc2VJbnQoZXhlY1Jlc3VsdFsxXSwgMTYpIC8gMjU1LFxyXG4gICAgICAgICAgICBwYXJzZUludChleGVjUmVzdWx0WzJdLCAxNikgLyAyNTUsXHJcbiAgICAgICAgICAgIHBhcnNlSW50KGV4ZWNSZXN1bHRbM10sIDE2KSAvIDI1NSxcclxuICAgICAgICAgICAgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzdHJpbmdQYXJzZXJzLnB1c2goe1xyXG4gICAgICByZTogLyMoW2EtZkEtRjAtOV0pKFthLWZBLUYwLTldKShbYS1mQS1GMC05XSkkLyxcclxuICAgICAgcGFyc2U6IGZ1bmN0aW9uKGV4ZWNSZXN1bHQ6IGFueSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUmdiYShwYXJzZUludChleGVjUmVzdWx0WzFdICsgZXhlY1Jlc3VsdFsxXSwgMTYpIC8gMjU1LFxyXG4gICAgICAgICAgcGFyc2VJbnQoZXhlY1Jlc3VsdFsyXSArIGV4ZWNSZXN1bHRbMl0sIDE2KSAvIDI1NSxcclxuICAgICAgICAgIHBhcnNlSW50KGV4ZWNSZXN1bHRbM10gKyBleGVjUmVzdWx0WzNdLCAxNikgLyAyNTUsXHJcbiAgICAgICAgICAxKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgZm9yIChjb25zdCBrZXkgaW4gc3RyaW5nUGFyc2Vycykge1xyXG4gICAgICBpZiAoc3RyaW5nUGFyc2Vycy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgY29uc3QgcGFyc2VyID0gc3RyaW5nUGFyc2Vyc1trZXldO1xyXG5cclxuICAgICAgICBjb25zdCBtYXRjaCA9IHBhcnNlci5yZS5leGVjKGNvbG9yU3RyaW5nKSwgY29sb3I6IGFueSA9IG1hdGNoICYmIHBhcnNlci5wYXJzZShtYXRjaCk7XHJcblxyXG4gICAgICAgIGlmIChjb2xvcikge1xyXG4gICAgICAgICAgaWYgKGNvbG9yIGluc3RhbmNlb2YgUmdiYSkge1xyXG4gICAgICAgICAgICBoc3ZhID0gdGhpcy5yZ2JhVG9Ic3ZhKGNvbG9yKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoY29sb3IgaW5zdGFuY2VvZiBIc2xhKSB7XHJcbiAgICAgICAgICAgIGhzdmEgPSB0aGlzLmhzbGEyaHN2YShjb2xvcik7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgcmV0dXJuIGhzdmE7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGhzdmE7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb3V0cHV0Rm9ybWF0KGhzdmE6IEhzdmEpOiBzdHJpbmcge1xyXG5cclxuICAgIHJldHVybiB0aGlzLmhzdmFUb1JnYmEoaHN2YSkudG9TdHJpbmcoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRGb3JtYXRCeVN0cmluZyhjb2xvcjogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGlmKGNvbG9yKXtcclxuICAgICAgY29sb3IgPSBjb2xvci50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICBsZXQgcmVnZXhIZXg6UmVnRXhwID0gLygjKFtcXGRhLWZdezN9KD86W1xcZGEtZl17M30pPyg/OltcXGRhLWZdezJ9KT8pKS9cclxuICAgICAgbGV0IHJlZ2V4UkdCQTpSZWdFeHAgPSAvKHJnYmFcXCgoXFxkezEsM30sXFxzPyl7M30oMXwwP1xcLlxcZCspXFwpfHJnYlxcKFxcZHsxLDN9KCxcXHM/XFxkezEsM30pezJ9XFwpKS9cclxuICAgICAgbGV0IHJlZ2V4SFNMQTpSZWdFeHAgPSAvKGhzbGFcXCgoXFxkezEsM30lPyxcXHM/KXszfSgxfDA/XFwuXFxkKylcXCl8aHNsXFwoXFxkezEsM30lPygsXFxzP1xcZHsxLDN9JT8pezJ9XFwpKS9cclxuICAgICAgaWYocmVnZXhIZXgudGVzdChjb2xvcikpe1xyXG4gICAgICAgIHJldHVybiAnaGV4J1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYocmVnZXhSR0JBLnRlc3QoY29sb3IpKXtcclxuICAgICAgICByZXR1cm4gJ3JnYmEnXHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZihyZWdleEhTTEEudGVzdChjb2xvcikpe1xyXG4gICAgICAgIHJldHVybiAnaHNsYSdcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuICdoZXgnXHJcbiAgfVxyXG59XHJcbiJdfQ==