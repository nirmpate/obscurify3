import { ScullyConfig } from '@scullyio/scully';

const {MinifyHtml} = require('scully-plugin-minify-html');
const postRenderers = [MinifyHtml];


export const config: ScullyConfig = {
  puppeteerLaunchOptions: { args: ['--no-sandbox', '--disable-setuid-sandbox'] },
  projectRoot: "./src",
  projectName: "obscurify3",
  outDir: './dist/static',
  defaultPostRenderers: postRenderers,
  routes: {
    '/blog/:slug': {
      type: 'contentFolder',
      slug: {
        folder: "./blog"
      }
    },
    '/home': {
      type: 'ignored',
    },
    '/profile': {
      type: 'ignored'
    },
    '/login': {
      type: 'ignored'
    },
    '': {
      type: 'ignored'
    }

  },

};
