import { DateTime } from 'luxon';
import fs from 'fs';
import pluginRss from '@11ty/eleventy-plugin-rss';
import pluginSyntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import pluginNavigation from '@11ty/eleventy-navigation';
import markdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import pluginWebc from '@11ty/eleventy-plugin-webc';
import { EleventyRenderPlugin } from '@11ty/eleventy';
import UpgradeHelper from '@11ty/eleventy-upgrade-help';
import Image from '@11ty/eleventy-img';
import getTagList from './_11ty/getTagList.js';

async function imageShortcode(src, alt, sizes) {
  let metadata = await Image(src, {
    widths: [250, 500],
    formats: ['webp', 'avif', 'jpeg'],
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: 'lazy',
    decoding: 'async',
  };

  return Image.generateHTML(metadata, imageAttributes);
}

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(pluginWebc, {
    components: '_includes/components/**/*.webc',
  });
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addLayoutAlias('post', 'layouts/post.njk');

  eleventyConfig.addFilter('readableDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('dd LLL yyyy');
  });

  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });

  eleventyConfig.addFilter('head', (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }
    return array.slice(0, n);
  });

  eleventyConfig.addCollection('tagList', getTagList);

  eleventyConfig.addNunjucksAsyncShortcode('image', imageShortcode);
  eleventyConfig.addLiquidShortcode('image', imageShortcode);
  eleventyConfig.addJavaScriptFunction('image', imageShortcode);

  eleventyConfig.addPassthroughCopy('img');
  eleventyConfig.addPassthroughCopy('favicon.ico');
  eleventyConfig.addPassthroughCopy('favicon-16x16.png');
  eleventyConfig.addPassthroughCopy('favicon-32x32.png');
  eleventyConfig.addPassthroughCopy('apple-touch-icon.png');
  eleventyConfig.addPassthroughCopy('robots.txt');
  eleventyConfig.addPassthroughCopy('ai.txt');
  eleventyConfig.addPassthroughCopy('css/fonts');

  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({
      placement: 'before',
      class: 'direct-link',
      symbol: '#',
      level: [1, 2, 3, 4],
    }),
    slugify: eleventyConfig.getFilter('slug'),
  });

  eleventyConfig.setLibrary('md', markdownLibrary);

  eleventyConfig.addPlugin(UpgradeHelper);
}
