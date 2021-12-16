import router from "../router";
import { z } from "../z/z3.9";

export const ActionLink = (name, onclick) =>
    z['inline cursor-pointer transition border-b border-transition hover:border-[#dd88c1]']({ onclick }, name);

export const Link = (name, href, state) =>
    ActionLink(name, _ => router.navigate(href, state));