const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        checkResource(resource, context) {
          // متوافق مع سلاش ويندوز (\) وسلاش لينكس/ماك (/)
          const isSplineRuntime = /splinetool[\\/]+runtime/i.test(context);
          const isDynamicAsset = resource.endsWith('.wasm') || resource.includes('draco');
          return isSplineRuntime && isDynamicAsset;
        },
      })
    );
    return config;
  },
};

module.exports = nextConfig;