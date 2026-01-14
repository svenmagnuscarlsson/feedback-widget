import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/feedback-widget.min.js',
    format: 'iife',
    name: 'FeedbackWidget',
    sourcemap: false
  },
  plugins: [
    resolve(),
    postcss({
      inject: true,
      minimize: true
    }),
    terser({
      format: {
        comments: false
      }
    })
  ]
};
