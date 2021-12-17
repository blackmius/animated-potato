import { z } from "../z/z3.9";

export default function Button(name, onclick) {
    return z['text-[#dd88c1] font-medium text-center transition rounded uppercase py-2 px-4 cursor-pointer hover:bg-[#dd88c120]']({ onclick }, name);
}