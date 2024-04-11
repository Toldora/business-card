import { defineConfig, loadEnv } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { createHtmlPlugin } from 'vite-plugin-html';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import * as fs from 'fs';
import * as path from 'path';

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relative => path.resolve(appDirectory, relative);
const root = path.resolve(__dirname, resolveApp('src'));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/',
    publicDir: 'static',
    // build: {
    //   rollupOptions: {
    //     input: {
    //       gabriel: path.resolve(__dirname, '/src/pages/gabriel/index.html'),
    //       traffer: path.resolve(__dirname, '/src/pages/traffer/index.html'),
    //       // path.resolve(__dirname, '/traffer.html')

    //       // 'main-copy': path.resolve(__dirname, '/traffer.html'),
    //     },
    //     // output: {
    //     //   entryFileNames: 'entry-[name].js',
    //     // },
    //   },
    // },
    ...(env.VITE_PORT
      ? {
          server: {
            port: Number(env.VITE_PORT),
          },
        }
      : {}),
    plugins: [
      handlebars({
        partialDirectory: path.resolve(__dirname, 'src/partials'),
      }),
      createHtmlPlugin({
        minify: true,
        // entry: '/src/main.js',
        // template: '/index.html',
        pages: [
          {
            entry: '/src/pages/gabriel/main.js',
            template: '/src/pages/gabriel/index.html',
            // template: '/gabriel.html',
          },
          {
            entry: '/src/pages/traffer/main.js',
            template: '/src/pages/traffer/index.html',
            // filename: '/gabriel.html',
            // template: '/gabriel.html',
          },
          // {
          //   entry: '/src/main.js',
          //   // filename: '/traffer.html',
          //   template: '/traffer.html',
          // },
        ],
      }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(__dirname, 'src/icons')],
        symbolId: '[name]',
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @import "src/styles/base/_mixins.scss";
          @import "src/styles/base/_placeholders.scss";
          @import "src/styles/base/_functions.scss";
          @import "src/styles/base/_media.scss";
        `,
        },
      },
      devSourcemap: true,
    },
    resolve: {
      alias: {
        '@': `${root}/`,
        '@static': `${root}/../static`,
      },
    },
  };
});
