const CONFIG = require('./config')
const CopyPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: {
    app: './src/app.ts',
    pi: './src/pi.ts',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  target: 'web',
  output: {
    filename: '[name].js',
    path: __dirname + '/' + CONFIG.appName + '.sdPlugin',
    clean: true,
  },
  optimization: {
    minimizer: [new TerserPlugin({
      terserOptions: {
        compress: {
          unused: false
        },
        mangle: false
      }
  })],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'src',
          globOptions: {
            ignore: ['**/*.ts', '**/*.js'],
          },
        },
      ],
    }),
  ],
}
