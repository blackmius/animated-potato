import { z, Val } from "../z/z3.9";

function Panel(c) {
    let target;
    return Object.assign(
        z['fixed p-2 opacity-0 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none']({
                on$created(e) {
                    target = e.target;
                    setTimeout(_ => {
                        const r = target.getBoundingClientRect();
                        let x = 0, y = 0;
                        if (r.x + r.width > window.innerWidth) x = window.innerWidth - r.x - r.width - 32;
                        if (r.y + r.height > window.innerHeight) y = window.innerHeight - r.y - r.height - 32;
                        target.style.transform = `translate(${x}px, ${y}px)`;
                        target.animate([
                            { transform: 'scale(0.95)', opacity: 0, easing: 'ease-in' },
                            { transform: 'scale(1)', opacity: 1 }
                        ], {
                            duration: 100,
                            fill: 'forwards'
                        });
                    }, 1)
                }
            },
            c
        ),
        {
            async close() {
                if (target)
                    await target.animate([
                        { transform: 'scale(1)', opacity: 1, easing: 'ease-out' },
                        { transform: 'scale(0.95)', opacity: 0 }
                    ], {
                        duration: 75,
                        fill: 'forwards'
                    }).finished;
            }
        });
}

export function Dropdown(anchor, dropdown) {
    let content = Val('');
    async function remove() {
        window.removeEventListener('click', remove);
        await content()?.close?.();
        content('');
    }
    return z['relative']({
            onclick(e) {
                e.stopPropagation();
                window.addEventListener('click', remove);
                content(Panel(dropdown(remove)));
            }
        },
        anchor,
        content
    );
}