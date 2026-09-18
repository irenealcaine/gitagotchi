import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa"
import "./Footer.css"

export default function Footer({ note }) {
  return (
    <footer className="site-footer">
      <div className="site-footer-links">
        <a
          className="site-footer-link"
          href="mailto:irenealcainealvarez@gmail.com"
        >
          <FaEnvelope aria-hidden="true" />
          <span>irenealcainealvarez@gmail.com</span>
        </a>
        <a
          className="site-footer-link"
          href="https://github.com/irenealcaine"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub aria-hidden="true" />
          <span>GitHub</span>
          <span className="visually-hidden"> (se abre en una pestaña nueva)</span>
        </a>
        <a
          className="site-footer-link"
          href="https://www.linkedin.com/in/irenealcaine/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin aria-hidden="true" />
          <span>LinkedIn</span>
          <span className="visually-hidden"> (se abre en una pestaña nueva)</span>
        </a>
      </div>
      {note && <p className="site-footer-note">{note}</p>}
    </footer>
  )
}