import type { NextConfig } from 'next'

const config: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'carltondb.72.60.67.2.sslip.io',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default config
