import { icons } from ".";
import { z, body } from "../z/z3.9";
import { Dropdown } from "./dropdown";

const InputEvents = (value, options) => ({
    on$created(e) {
        options.target = e.target
    },
    onfocus() {
        options.focused = true;
        body.update();
    },
    onblur() {
        options.focused = false;
        body.update();
    },
    oninput(e) {
        options.error = '';
        value(e.target.value);
        body.update();
    }
})

export const Input = (value, options={}) => z.Input['w-full px-3 py-2 transition-colors border rounded-md outline-none']({
    classes: _=>({
        'border-red-700 hover:border-red-700 focus:border-red-700': options.error,
        'border-gray-300 hover:border-gray-400 focus:border-[#dd88c1]': !options.error
    }),
    ...InputEvents(value, options),
    value, ...options
})

const extend = t => t === ''
    ? ' '.repeat(15)
    : t + ' ';

export const Text = (value, options) =>
    z['w-full px-3 py-2 transition-colors border rounded-md']({
            onclick(e) {
                options.target.focus();
            },
            style: 'min-height: 128px',
            classes: _=>({
                'border-red-700 hover:border-red-700': options.error,
                'border-[#dd88c1]': options.focused && !options.error,
                'border-gray-300 hover:border-gray-400': !options.focused && !options.error
            }),
        },
        z.relative(
            z.U['whitespace-pre break-all color-transparent'](_ => extend(value())),
            z.Textarea['w-full h-full border-none bg-none outline-none resize-none absolute top-0 left-0 overflow-hidden']({
                ...InputEvents(value, options),
                value, spellcheck: 'false', ...options
            })
        )
    );

const Label = (name, val, options={}, off=9, on=-14) => _ => {
    const up = options.focused || (val() !== '' && val() !== undefined) || options.type === 'date';
    return [
    z['absolute select-none top-0 transition-transform duration-200 ease-in-out pointer-events-none']({
        style: {
            'transform': up ? `translateY(${on}px)` : `translateY(${off}px)`
        },
        classes: {
            'text-gray-500': !options.focused && !options.error,
            'text-[#dd88c1]': options.focused && !options.error,
            'text-red-700': options.error,
            'px-1': up,
            'mx-3': up,
            'mx-4': !up
        }
    }, z['absolute bottom-[6px] w-full bg-white h-1 left-0'], z['relative'](name)),
    options.error ? z['text-red-700.mx-4.text-sm.mt-2'](options.error): ''
    ]
}

export const Select = (value, options={}) =>
    Dropdown(
        z['flex items-center min-w-[260px] w-full px-3 py-2 transition-colors border rounded-md outline-none cursor-pointer bg-white']({
            classes: _=>({
                'border-red-700 hover:border-red-700 focus:border-red-700': options.error,
                'border-gray-300 hover:border-gray-400': !options.error
            }),
            ...InputEvents(value, options),
        },
            _ => options.values.find(v => v.value === value())?.name || '',
            z['flex-1'],
            icons.chevronDown
        ),
        c => options.values.map(v => z['cursor-pointer']({ onclick() { value(v.value); c(); } }, v.name))
    );

export const Check = (value, label) => z.Label['flex items-center'](
    {
        onkeydown(e) {
            if (e.keyCode === 32 || e.keyCode === 13) {
                e.preventDefault();
                value(!value());
            }
        }
    },
    z.Input['h-5 w-5 outline-[#dd88c1]']({
        onchange(e) { value(e.target.checked); },
        checked: value,
        type: 'checkbox'
    }),
    z['ml-4'],
    label
);

export const NamedSelect = (name, val, options={}) => z.Label.relative(
    Select(val, options),
    Label(name, val, options)
)

export const NamedInput = (name, val, options={}) => z.Label.relative(
    Input(val, options),
    Label(name, val, options)
);

export const NamedText = (name, val, options={}) => z.relative(
    Text(val, options),
    Label(name, val, options, 9, -16)
);