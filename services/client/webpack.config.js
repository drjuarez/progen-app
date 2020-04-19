const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require("path")

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

module.exports = {
  output: {
      path: path.join(__dirname,'build'),
      filename: 'index.bundle.js'
    },
    mode: process.env.NODE_ENV || 'development',
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
    devtool: 'cheap-module-eval-source-map',
    devServer: {
      contentBase: path.join(__dirname,'src'),
      // historyApiFallback: true,
      hot: true,
      host: HOST || "localhost",
      port: 3000,
      proxy: {
        '/api/**': {
          target: 'http://localhost:'+PORT,
          pathRewrite: { '^/api': '' },
          secure: false,
          changeOrigin: true
      }
    }
    },
  module: {
    rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader"
            }
          ]
        },
        {
            test: /\.css$/,
            include: /node_modules/,
            loaders: ['style-loader', 'css-loader'],
          },
          {
              test: /\.scss$/,
              use: [
                  "style-loader", // creates style nodes from JS strings
                  "css-loader", // translates CSS into CommonJS
                  "sass-loader" // compiles Sass to CSS, using Node Sass by default
              ]
          },
          {
              test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
              loader: 'url-loader',
            },
          {
              test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
              loader: 'url-loader',
            }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    })
  ],
}
