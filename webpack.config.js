const CopyPlugin = require('copy-webpack-plugin')
const CONFIG = require('./config')

module.exports = {
  entry: {
    app: './src/app.ts',
    pi: './src/pi.ts',
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
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'src',
          globOptions: {
            ignore: ['src/*.ts', 'src/*.js'],
          },
        },
      ],
    }),
  ],
}
