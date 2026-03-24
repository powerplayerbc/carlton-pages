import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-navy-950 px-6 text-center">
      <div className="mx-auto max-w-lg">
        <p className="text-8xl font-extrabold text-accent-400">404</p>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Page Not Found
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-navy-300">
          The page you are looking for does not exist or has been unpublished.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center rounded-xl bg-accent-500 px-8 py-3 text-base font-bold text-navy-950 transition-all duration-200 hover:bg-accent-400 hover:scale-[1.02]"
        >
          Back to Home
        </Link>
      </div>
    </main>
  )
}
