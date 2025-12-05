//  @type {import('next').NextConfig}
const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
    images: {
        unoptimized: true
    },
    // Only use export mode and basePath for production builds
    ...(isDev ? {} : {
        output: 'export',
        distDir: './build',
        assetPrefix: '/AlgorithmVisualizer',
        basePath: '/AlgorithmVisualizer',
    })
}
   
export default nextConfig;