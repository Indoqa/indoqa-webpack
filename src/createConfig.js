const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const createOutput = require('./config/output.js')
const createPlugins = require('./config/plugins.js')
const createRules = require('./config/rules.js')
const createEntry = require('./config/entry.js')
const addExternals = require('./config/externals.js')
const addDevelopmentOptions = require('./config/developmentOptions.js')

const createConfig1 = options => {
  const isDevelopment = process.env.NODE_ENV !== 'production'
  const isLibrary = options.isLibrary

  let config = {
    mode: isDevelopment ? 'development' : 'production',
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      plugins: [new TsconfigPathsPlugin({
        configFile: path.join(process.cwd(), 'tsconfig.json')
      })]
    },
    entry: createEntry(options, isDevelopment, isLibrary),
    output: createOutput(options, isDevelopment, isLibrary),
    module: {
      rules: createRules(options, isDevelopment),
    },
    plugins: createPlugins(options, isDevelopment, isLibrary),
  }

  config = addExternals(config, options, isDevelopment, isLibrary)
  config = addDevelopmentOptions(config, options, isDevelopment)

  // console.log('config=', JSON.stringify(config, null, 2))
  return config
}

const createConfig = options => {
  return {
    entry: "./src/index.tsx",
    output: {
      filename: "bundle.js",
      path: __dirname + "/dist"
    },
  
    // Enable sourcemaps for debugging webpack"s output.
    devtool: "source-map",
  
    resolve: {
      // Add ".ts" and ".tsx" as resolvable extensions.
      extensions: [".ts", ".tsx", ".js", ".json"]
    },
  
    module: {
      rules: [
        // All files with a ".ts" or ".tsx" extension will be handled by "awesome-typescript-loader".
        { test: /\.tsx?$/, loader: "ts-loader" },
  
        // All output ".js" files will have any sourcemaps re-processed by "source-map-loader".
        { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
      ]
    },
  
    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
      "react": "React",
      "react-dom": "ReactDOM"
    }
  };
}

module.exports = exports = createConfig
