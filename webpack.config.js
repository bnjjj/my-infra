var path = require('path');


module.exports = {
  entry: [
    path.normalize('es6-shim/es6-shim.min'),
    'reflect-metadata',
    path.normalize('zone.js/dist/zone'),
    path.resolve('app/app')
  ],
  output: {
    path: path.resolve('www/build/js'),
    filename: 'app.bundle.js',
    pathinfo: false // show module paths in the bundle, handy for debugging
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript',
        query: {
          doTypeCheck: true,
          resolveGlobs: false,
          externals: ['typings/browser.d.ts']
        },
        include: path.resolve('app'),
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        include: path.resolve('node_modules/angular2'),
        loader: 'strip-sourcemap'
      }
    ],
    noParse: [
      /es6-shim/,
      /reflect-metadata/,
      /zone\.js(\/|\\)dist(\/|\\)zone-microtask/
    ]
  },
  resolve: {
    root: ['app'],
    alias: {
      'angular2': path.resolve('node_modules/angular2'),
      'lodash': path.resolve('node_modules/lodash/lodash.min.js'),
      'lazy.js': path.resolve('node_modules/lazy.js/lazy.min.js'),
      'moment': path.resolve('node_modules/moment/min/moment.min.js'),
      'ionic-angular': path.resolve('node_modules/ionic-framework')
    },
    modulesDirectories: [
      "node_modules"
    ],
    extensions: ["", ".js", ".ts"]
  }
};
