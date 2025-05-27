import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'

export function Footer() {
  return (
    <footer className="w-full py-8 border-t">
        <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-6">
                <a href="https://dydxsoft.my" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <FontAwesomeIcon icon={faGlobe} className="w-6 h-6" />
                </a>
                <a href="https://github.com/DyDxdYdX" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <FontAwesomeIcon icon={faGithub} className="w-6 h-6" />
                </a>
                <a href="https://www.linkedin.com/in/dykesdexter" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <FontAwesomeIcon icon={faLinkedin} className="w-6 h-6" />
                </a>
                <a href="https://www.instagram.com/dexterdykes/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <FontAwesomeIcon icon={faInstagram} className="w-6 h-6" />
                </a>
                </div>
                <div className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Dexter Dykes Timothy. All rights reserved.
                </div>
            </div>
        </div>
    </footer>
  )
} 