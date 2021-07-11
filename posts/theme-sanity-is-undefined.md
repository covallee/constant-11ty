---
title: theme.sanity is undefined
metaDesc: How to fix "theme.sanity is undefined" error with Sanity UI
date: 2021-01-30
tags:
  - sanity
layout: layouts/post.njk
socialImage: /img/socials/theme-undefined.jpg
---

I've been refactoring my music blog lately. I switched CMS, from Contentful to Sanity. The why could be another blog post.

Anyways. I added some custom fields and used their new [Sanity UI library](https://www.sanity.io/ui). After installing it to the project and adding some components I got the error: "theme.sanity is undefined".

In the doc it says that "@sanity/ui only comes with one theme right now – studioTheme – which is built for use in Sanity products". Next I tried to add the wrapper <ThemeProvider theme={studioTheme}>. I was still getting the same error message.

Turns out you need to be on Sanity 2.1.0 at minimum to use the UI. At least I think, because when I updated to packages everything worked and I'm getting some beautiful Fields and Cards.

Also ThemeProvide doesn't seem to be mandatory, I guess the Sanity Theme is the default.
