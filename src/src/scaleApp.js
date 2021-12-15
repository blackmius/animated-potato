import { throttle } from './z/z3.9.js';

let baseWidth = 1280;

function scaleFactor() { return window.innerWidth / baseWidth }//Math.min(1, ); }

const getBoundingClientRect = Element.prototype.getBoundingClientRect;
Element.prototype.getBoundingClientRect = function() {
    const r = getBoundingClientRect.call(this, arguments), d = scaleFactor();
    r.x *= d;
    r.y *= d;
    r.width *= d;
    r.height *= d;
    return r;
}

function scale() {
    const d = scaleFactor();
    Object.assign(document.body.style, {
        posititon: 'relative',
        width: `calc(max(${100 / d}vw, 100%))`,
        height: `calc(${100 / d}vh)`,
        zoom: `${d * 100}%`,
        MozTransform: `scale(${d})`,
        MozTransformOrigin: '0 0'
    });
}
scale();
window.addEventListener('resize', throttle(500, scale));
