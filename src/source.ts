import { mount } from "svelte";
import "./app.css";
import Source from "./Source.svelte";

const app = mount(Source, {
  target: document.getElementById("app")!,
});

export default app;
