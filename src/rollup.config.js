import { terser } from "rollup-plugin-terser";
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import dotenv from 'dotenv';
dotenv.config();

export default {
  input: 'src/app.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
  },
  plugins: [
    resolve({ browser: true }),
    commonjs(),
    process.env.ENV !== 'DEV' && terser(),
  ],
};
