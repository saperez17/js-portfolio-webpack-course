const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const DotEnv = require("dotenv-webpack");
//con webpack, damos soporte a nuestro codigo JS para que pueda ser
//ejecutado en cualquier navegador

module.exports = {
  entry: "./src/index.js", //punto de entrada de mi app
  output: {
    path: path.resolve(__dirname, "dist"), //path del folder donde se compila el proyecto
    filename: "[name].[contenthash].js", //nombre del archivo compilado
    assetModuleFilename: "assets/images/[hash][ext][query]", //para copiar las images a dist agregamos esta linea y la configuracion del copy plugin abajo
  },
  mode: "development",
  watch: true,
  resolve: {
    extensions: [".js"], //extensiones con las que vamos a trabajar
    alias: {
      "@utils": path.resolve(__dirname, "src/utils"),
      "@templates": path.resolve(__dirname, "src/templates"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@images": path.resolve(__dirname, "src/assets/images"),
    },
  },
  module: {
    rules: [
      {
        //test: indica el tipo de archivos con los que vamos a trabajar
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css|.styl$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "stylus-loader"],
      },
      {
        test: /\.png/,
        type: "asset/resource",
      },
      {
        // Este objecto configura la lectura y procesamiento de los archivos de fuentes .woff y .woff2. No es necesario
        //instala url-loader, file-loader y raw-loader
        test: /\.(woff|woff2)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[hash][ext][query]",
        },
        // use: {
        //   loader: "url-loader",
        //   options: {
        //     limit: 10000,
        //     mimetype: "application/font-woff",
        //     name: "[name].[ext]",
        //     outputPath: "./assets/fonts/",
        //     publicPath: "./assets/fonts/",
        //     esModule: false,
        //   },
        // },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true, // instalacion de los elementos
      template: "./public/index.html", //html template source
      filename: "./index.html", //nombre del archivo en la carpeta dist del html transformado
    }),
    new MiniCssExtractPlugin({
      filename: "assets/[name].[contenthash].css",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src", "assets/images"),
          to: "assets/images",
        },
      ],
    }),
    new DotEnv(),
  ],
  //se elimina en la configuracion de desarrollo de webpack
  //   optimization: {
  //     minimize: true,
  //     minimizer: [
  //       new CssMinimizerPlugin(), //support to minimize CSS files
  //       new TerserPlugin(), //plugin that uses terser to minify/minimize js files
  //     ],
  //   },
};

//npx  webpack --mode production --config webpack.config.js para ejecutar la compilacion del codigo usando este archivo de configuracion
//o crear otro script en el package.json
