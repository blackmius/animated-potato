
import { throttle, Val } from './z/z3.9.js';

const routes = {};

const clearSlashes = path => path.toString().replace(/\/$/, '').replace(/^\//, '');

function getFragment() {
    let fragment = '';
    fragment = clearSlashes(decodeURI(window.location.pathname + window.location.search));
    fragment = fragment.replace(/\?(.*)$/, '');
    return '/' + clearSlashes(fragment)
}

let current, currentState = {}, page=Val(''), unknown;
const render = throttle(10, function render() {
    const frag = getFragment()
    const result = Object.entries(routes).some(([route, cb]) => {
        const match = frag.match(route);
        if (match) {
            match.shift();
            page(cb.apply(currentState, match));
            return match;
        }
    });
    if (!result && unknown !== undefined) {
        page(unknown(frag));
    }
});

window.onpopstate = function(event) {
    let frag = getFragment();
    if (frag !== current) {
        current = frag;
        currentState = event.state;
        render();
    }
    return false;
}

export default Object.assign(page, {
    getFragment,
    register(route, f) {
        routes[route] = f;
        render();
        return this;
    },
    unknown(fn) {
        unknown = fn;
        render();
        return this;
    },
    redraw: render,
    navigate(url, state={}) {
        history.pushState(state, null, url);
        window.onpopstate({state});
        render();
    }
});
