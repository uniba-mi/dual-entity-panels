import { writable } from "svelte/store";

export const paths = writable([]);
export const selectedPath = writable({});

export const formats = writable(["Turtle", "Arrow", "Graph: Circle", "Graph: Hierarchy", "LLM", "Heatmap", "Barchart", "Nodelink"]);
