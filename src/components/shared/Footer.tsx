interface FooterProps {
  brandName?: string
}

export function Footer({ brandName = 'Carlton AI Services' }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-navy-800/60 bg-navy-950" role="contentinfo">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500">
              <span className="text-lg font-extrabold text-navy-950">C</span>
            </div>
            <span className="text-lg font-bold text-white">{brandName}</span>
          </div>

          {/* Links */}
          <nav className="flex gap-8" aria-label="Footer navigation">
            <a
              href="https://carltonaiservices.com"
              className="text-sm text-navy-400 transition-colors hover:text-accent-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              Main Site
            </a>
            <a
              href="https://carltonaiservices.com/privacy"
              className="text-sm text-navy-400 transition-colors hover:text-accent-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy
            </a>
            <a
              href="https://carltonaiservices.com/terms"
              className="text-sm text-navy-400 transition-colors hover:text-accent-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms
            </a>
          </nav>
        </div>

        <div className="mt-8 border-t border-navy-800/40 pt-8 text-center">
          <p className="text-sm text-navy-500">
            &copy; {currentYear} {brandName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
