const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  resolve: {
    extensions: ['.js', '.ts']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'umd'
  },
  devtool: 'cheap-module-source-map',
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
