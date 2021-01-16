import { ScullyConfig } from '@scullyio/scully';
export const config: ScullyConfig = {
  puppeteerLaunchOptions: { args: ['--no-sandbox', '--disable-setuid-sandbox'] },
  projectRoot: "./src",
  projectName: "obscurify3",
  outDir: './dist/static',
  routes: {
    '/blog/:slug': {
      type: 'contentFolder',
      slug: {
        folder: "./blog"
      }
    },
  }
};
