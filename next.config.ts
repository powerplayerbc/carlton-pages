import type { NextConfig } from 'next'

const config: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yrwrswyjawmgtxrgbnim.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default config
