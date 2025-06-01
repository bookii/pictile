import { mount } from 'svelte'
import './app.css'
import Dock from './Dock.svelte'

const app = mount(Dock, {
  target: document.getElementById('app')!,
})

export default app
