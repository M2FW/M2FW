const path = require('path')

module.exports = {
  mode: 'development',
  watch: true,
  entry: './src/index.ts',
  resolve: {
    extensions: ['.js', '.ts']
  },
  externals: {
    '@m2fw/redux-manager': '@m2fw/redux-manager'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'umd'
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
        exclude: /node_modules/
      }
    ]
  }
}
