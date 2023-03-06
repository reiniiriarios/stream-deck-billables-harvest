const CopyPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: {
    app: './src/app.ts',
    "status-pi": './src/status-pi.ts',
  },
  resolve: {
    extensions: ['.ts'],
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
    path: __dirname + '/build/me.reinii.harvest-billables.sdPlugin',
    clean: true,
  },
  optimization: {
    minimizer: [new TerserPlugin({
      terserOptions: {
        compress: {
          unused: false
        },
        mangle: false,
        keep_classnames: true,
        keep_fnames: true
      }
  })],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'src',
          globOptions: {
            ignore: ['**/*.ts', '**/.*'],
          },
        },
      ],
    }),
  ],
}
