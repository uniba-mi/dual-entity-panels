import { writable } from "svelte/store";

export const paths = writable([]);
export const selectedPath = writable({});

export const modes = writable(["Turtle", "Arrow", "Graph: Circle", "Graph: Hierarchy", "LLM"]);
