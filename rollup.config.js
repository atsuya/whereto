import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodePolyfills from 'rollup-plugin-node-polyfills'
import resolve from '@rollup/plugin-node-resolve'

export default [
  {
    input: './background.js',
    output: {
      file: 'build/background.js',
      format: 'iife',
      compact: true,
      sourcemap: true,
    },
    plugins: [
      commonjs(),
    ],
  },
  {
    input: './popup.js',
    output: {
      file: 'build/popup.js',
      format: 'iife',
      compact: true,
      sourcemap: true,
    },
    plugins: [
      commonjs(),
      json(),
      nodePolyfills(),
      resolve({
        preferBuiltins: true,
      }),
    ],
  },
]
