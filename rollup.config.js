import serve from 'rollup-plugin-serve'
import babel from 'rollup-plugin-babel'
export default {
  input: './src/index.js',
  output: {
    file: 'dist/vue.js',
    name: 'Vue', // 全局名字是Vue
    format: 'umd', // window.Vue
    source: true,
  },
  plugins: [
    babel({
      exclude: 'node_modeles/**', // 这个目录不需要babel转换
    }),
    serve({
      open: true,
      openPage: '/public/index.html',
      port: 3000,
      contentBase: '',
    }),
  ],
}
