module.exports = {
  presets: [[require.resolve('@babel/preset-react'), {runtime: 'automatic'}]],

  env: {
    production: {
      presets: [
        [
          require.resolve('@babel/preset-env'),
          {
            modules: false,
            targets: {
              browsers: [
                'last 1 Chrome version',
                'last 1 iOS version',
                'last 1 Safari version',
                'last 1 Firefox version',
                'last 1 Edge version',
              ],
            },
          },
        ],
      ],
      plugins: [
        [
          require.resolve('babel-plugin-transform-react-remove-prop-types'),
          {
            removeImport: true,
          },
        ],
      ],
    },

    development: {
      presets: [
        [
          require.resolve('@babel/preset-env'),
          {
            modules: false,
            targets: {browsers: ['last 1 Chrome version']},
          },
        ],
      ],
      plugins: [require.resolve('react-refresh/babel')],
    },
  },
};
