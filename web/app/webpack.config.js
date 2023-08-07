const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {DefinePlugin, ProvidePlugin} = require('webpack');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const SANDNET_ENV = {
  ALGOD_SERVER: 'http://localhost',
  ALGOD_PORT: 4001,
  ALGOD_TOKEN: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  ALGOD_AUTH_HEADER: 'X-Algo-API-Token',

  NIFTGEN_ADDRESS: 'JT3B3XGWXLA4OTE56GBDBYRRQX7MDVZH2EMH47ND24BNAMFIWJKLITV7TE',

  NIFTGEN_ASSET_ID: 1,
  USDC_ASSET_ID: 2,
  ADMIN_ID: 3,
  REWARD_MODULE_ID: 9,
  SUBSCRIPTION_MODULE_ID: 17,
  CREATOR_POOL_ID: 19,
  PLATFORM_SUBSCRIPTION_APP_ID: 25,

  chainId: 4160,
};

function appConfig() {
  const version = {time: new Date(), sha: 'local'};

  return {
    env: 'sandnet',
    version,
    www: 'https://www.niftgen.com',
    api: '',
    apikey: '',
    txn: 'http://localhost:3001',
    ipfs: 'https://www.storj-ipfs.com/ipfs',
    region: 'us-east-1',
    transak: '',
    explorer: 'dappflow',
    network: 'sandnet',
    ledger: 'TestNet',
    magic: '',

    MONTHLY_CREATOR_SUBSCRIPTION: 499,
    MONTHLY_PLATFORM_SUBSCRIPTION: 899,

    ...SANDNET_ENV,
  };
}

function config() {
  const DIR = path.resolve(__dirname);
  const isProd = process.env.NODE_ENV === 'production';
  const mode = isProd ? 'production' : 'development';

  const babelLoaderRule = {
    test: /\.js$/,
    include: [/\/web\//, /\/node_modules\/@nkbt\//, /\/node_modules\/date-fns\/esm\//, /\/node_modules\/@date-io\//],
    resolve: {
      fullySpecified: false,
    },
    use: {
      loader: require.resolve('babel-loader'),
      options: {
        configFile: path.resolve(DIR, 'babel.config.js'),
      },
    },
  };

  const tealLoaderRule = {
    test: /\.teal$/,
    include: [/\/teal\//],
    type: 'asset/source',
  };

  const graphqlLoaderRule = {
    test: /\.graphql$/,
    include: [/\/web\//],
    type: 'asset/source',
  };

  const markdownLoaderRule = {
    test: /\.md$/,
    include: [/\/wiki\//],
    type: 'asset/source',
  };

  const fileLoaderRule = {
    test: /\.(svg|png|jpg|ico|gif|woff|woff2|ttf|eot|doc|pdf|zip|wav|avi|txt)$/,
    type: 'asset/resource',
  };

  const cssRule = {
    test: /\.css$/,
    use: [
      {
        loader: require.resolve('style-loader'),
        options: {
          insert: 'body',
        },
      },
      require.resolve('css-loader'),
    ],
  };

  const faviconLoaderRule = {
    test: /favicon\.svg/,
    type: 'asset/resource',
    generator: {
      filename: '[name][ext]',
    },
  };

  const robotsLoaderRule = {
    test: /robots\.txt$/,
    type: 'asset/resource',
    generator: {
      filename: '[name][ext]',
    },
  };

  const splitChunks = {
    chunks: 'async',
  };

  const optimization = isProd
    ? {
        runtimeChunk: false,
        splitChunks,
        moduleIds: 'deterministic',
        chunkIds: 'deterministic',
        minimize: true,
        innerGraph: true,
      }
    : {
        runtimeChunk: false,
        splitChunks,
        moduleIds: 'deterministic',
        chunkIds: 'deterministic',
        emitOnErrors: false,
        minimize: false,
      };

  const config = appConfig();
  // eslint-disable-next-line no-console
  console.log(config);
  const htmlPlugin = new HtmlWebpackPlugin({
    appConfig: JSON.stringify(config, null, 2),
    template: './index.html',
    minify: false,
    hash: false,
    xhtml: true,
    excludeChunks: ['main'],
  });

  const definePlugin = new DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(mode),
  });

  const moduleReplacement = [
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ];

  const productionPlugins =
    process.env.BUNDLE_ANALYZER === 'true'
      ? [
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: path.resolve(DIR, 'reports', 'webpack.html'),
            openAnalyzer: false,
            generateStatsFile: true,
            statsFilename: path.resolve(DIR, 'reports', 'webpack.json'),
          }),
        ]
      : [];

  return {
    mode,
    devtool: isProd ? false : 'source-map',
    optimization,
    entry: {
      main: './main.js',
    },
    output: {
      publicPath: '',
      filename: '[name].js',
      chunkFilename: isProd ? 'chunk/[name].[contenthash:8].js' : '[name].js',
      assetModuleFilename: '[name].[contenthash:8][ext]',
      path: path.join(DIR, 'dist'),
      clean: true,
    },
    plugins: [htmlPlugin, definePlugin]
      .concat(moduleReplacement)
      .concat(isProd ? productionPlugins : [new ReactRefreshWebpackPlugin({overlay: false})]),
    module: {
      rules: [
        tealLoaderRule,
        babelLoaderRule,
        fileLoaderRule,
        cssRule,
        faviconLoaderRule,
        robotsLoaderRule,
        graphqlLoaderRule,
        markdownLoaderRule,
      ],
    },
    resolve: {
      extensions: ['.js', '.json', '.mjs', '.jsx'],
      alias: {
        'date-fns/': 'date-fns/esm/',
        '@date-io/date-fns': '@date-io/date-fns/build/index.esm.js',
      },
      fallback: {
        buffer: require.resolve('buffer'),
        crypto: false,
        http: false,
        https: false,
        os: false,
      },
    },
    devServer: {
      port: '3000',

      hot: true,
      liveReload: false,

      historyApiFallback: {
        index: '/index.html',
      },

      devMiddleware: {
        writeToDisk: true,
        publicPath: '/',
      },

      client: {
        logging: 'log',
        overlay: false,
        progress: false,
      },

      static: false,

      headers: {'Access-Control-Allow-Origin': '*'},
      allowedHosts: 'all',
      open: false,
      compress: true,
    },
    stats: {errorDetails: true},
  };
}

module.exports = config;
