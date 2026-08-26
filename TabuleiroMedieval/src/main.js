import './style.css'
import { Experience } from './core/Experience.js'

const container = document.getElementById('app')
window.__experience = new Experience(container)
