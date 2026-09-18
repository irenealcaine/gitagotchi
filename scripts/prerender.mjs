import { readFile, writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("..", import.meta.url))
const indexPath = `${root}dist/index.html`

const LANDING_MARKUP = `
<div class="user-search">
  <h1 class="user-search-title">Gitagotchi</h1>
  <p class="user-search-subtitle">
    Introduce tu usuario de GitHub para alimentar a tu mascota
  </p>
  <form class="user-search-form" action="#">
    <label class="visually-hidden" for="github-username">Nombre de usuario de GitHub</label>
    <input
      id="github-username"
      class="user-search-input"
      type="text"
      placeholder="nombre de usuario..."
    />
    <button class="user-search-button" type="submit">Alimentar</button>
  </form>
</div>
<footer class="site-footer">
  <div class="site-footer-links">
    <a class="site-footer-link" href="mailto:irenealcainealvarez@gmail.com">irenealcainealvarez@gmail.com</a>
    <a class="site-footer-link" href="https://github.com/irenealcaine" target="_blank" rel="noopener noreferrer">GitHub</a>
    <a class="site-footer-link" href="https://www.linkedin.com/in/irenealcaine/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
  </div>
</footer>
`

let html = await readFile(indexPath, "utf8")

const marker = '<div id="root"></div>'
if (!html.includes(marker)) {
  throw new Error('No se encontró el marcador <div id="root"></div> en dist/index.html')
}

html = html.replace(marker, `<div id="root">${LANDING_MARKUP}</div>`)
await writeFile(indexPath, html)

console.log(
  "Prerender OK: index.html incluye la landing estática (h1: Gitagotchi). React la reemplaza al montar.",
)