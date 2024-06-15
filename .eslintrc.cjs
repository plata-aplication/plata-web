const { configure, presets } = require('eslint-kit')
const path = require('node:path')

module.exports = configure({
  extend: {
    root: path.join(__dirname, 'src'),
  },
  allowDebug: process.env.NODE_ENV !== 'production',
  presets: [
    presets.imports(),
    presets.node(),
    presets.prettier(),
    presets.typescript(),
    presets.react(),
    presets.effector(),
  ],
})
