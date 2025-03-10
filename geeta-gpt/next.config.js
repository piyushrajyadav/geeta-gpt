/** @type {import('next').NextConfig} */
const nextConfig = {
  optimizeFonts: true,
  images: {
    domains: ['fonts.googleapis.com', 'fonts.gstatic.com'],
  },
}

module.exports = nextConfig 