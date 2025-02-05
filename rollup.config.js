// import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

export default {
  input: 'server.js',
  output: {
    dir: 'dist',
    // file: 'bundle.js',
    format: 'iife',
    name: 'sneezl',
  },
  external: [
    'mock-aws-s3',
    'aws-sdk',
    'nock',
  ],
  plugins: [
    resolve(), 
    // commonjs(),
    json()
  ]
};