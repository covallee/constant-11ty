---
title: Exploring WebC
metaDesc:
date: 2022-11-30
tags:
  - 11ty
  - webc
layout: layouts/post.njk
socialImage: /img/socials/exploring-webc.jpg
---

A few weeks ago, I was at JamstackConf 22 and WebC was mentioned many times during the talks. It got me curious.

With WebC being pretty new the examples are still limited yet, and since I ran into a few issues, hopefully, sharing my process can help some people in the future.

## Initial Setup

First thing first, you need to have Eleventy 2.0.0-canary.16 or newer. Then you can install the eleventy-plugin following the [documentation](https://www.11ty.dev/docs/languages/webc/#installation). I would also recommend adding the [no-import config](https://www.11ty.dev/docs/languages/webc/#global-no-import-components).

The first component I created was a footer. Following the same folder structure as the documentation, I created a `site-footer.webc` in `_includes/components/`

The content of that component was a basic footer HTML structure. I used the `webc:scoped` property on the style tag to scope the styling. On a side note, I'm not able to figure out how to use postCSS in the style tag (mostly to be able to use nesting), but I will look into that later.

```
<footer class="footer">
    ... a bunch of <div> and <a>
</footer>

<style webc:scoped>
    CSS goes here
</style>
```

This was pretty straightforward so far.

## How to include a WebC component in a Nunjuck layout?

The first hurdle was how to include that new component into a Nunjuck layout. I don't want to fully rewrite my website in WebC right now, so I can't just include `<site-footer></site-footer>` in a .webc layout.

The built-in Render plugin of Eleventy is here to help up, but there are a few tricks you need to know to have it fully working.

Previously I had a `base.njk` layout with the head and the body of my pages. There was also 2 include to import a `_footer.njk` and `_header.njk`. So I replaced the njk include of the footer by:

```javascript
{% raw %}{% renderTemplate "webc" %}
<site-footer></site-footer>
{% endrenderTemplate %}
{% endraw %}
```

The footer was rendering, but the CSS was missing.
Well you also need to include:

```
{% raw %}<style>{{ page.url | webcGetCss | safe }}</style>{% endraw %}
```

But at first, the content of the style tag was empty :(
From reading the following [github issue](https://github.com/11ty/eleventy-plugin-webc/issues/11) it seems that I'm not the only one running into that problem.

Following the same workaround, I created a `root.njk` with the first layer of shared tags (<head> etc..), included the `webcGetCss` code in the head, then removed everything from the `base.njk` except the content placeholder and the renderTemplate block of code from above. Tada! it works 🥳.

I have to admit I don't fully understand why we need to do that chaining of layout to make it work, but it's not too bad.

The second issue I ran into, got me stuck for a bit.

## How to pass data from a Nunjuck layout to WebC components?

The next logical component was the nav bar. I created a `site-nav.webc`, pasted the code from my previous `_nav.njk` and then realized that I had no idea how to deal with the logic part. At build time the Nav was pulling some site information from a `_data/metadata.json` file and some collections.all info. More precisely the collection with the eleventyNavigation tag. [Navigation Plugin info](https://www.11ty.dev/docs/plugins/navigation/)

Most of the examples I saw at first were either a .webc with only some `<template>` or only some `<script>`. I thought I was gonna need to split my nav into smaller components (which would have been fined too). But looking at the repo of [11ty.webc.fun](https://github.com/darthmall/11ty.webc.fun) I realized that I can just mix and match.

You can write your HTML in the .webc file and when you need some logic you can plug a script tag.

```javascript
<script webc:type="render" webc:is="template">
  function ()
  {
    // your code here
    return //html
  }
</script>
```

Initialy, I thought, from looking at examples that I was gonna be able to replace `{{ metadata.title}}` by `${this.metadata.title}`, but I kept getting the following error message: `Error with Nunjucks paired shortcode 'renderTemplate'` telling me that title was not available.

But thanks to a comment by darth_mall in the 11ty Discord, I understood that if you use the renderTemplate, the context is not inherited and that you need to pass the data. In the [documentation](https://www.11ty.dev/docs/plugins/render/#pass-in-data) they are showing how to pass Front Mater (the part between the `---` at the top of the files) data to the renderTemplate. Doing something the following did not work:

```
---
myData:
  myKey: metadata
---
```

It was passing the string "metadata" instead of the actual object.

However, if I passed metadata directly to the renderTemplate, then `this` contained the data from metadata in the script tag.

```
{% raw %}{% renderTemplate "webc", metadata %}
    <site-nav></site-nav>
{% endrenderTemplate %}{% endraw %}
```

Now my issue was that I needed the data from 2 sources. The `_data/metadata.json` and the `collections` 🥺.

**Don't** try the following code, it does not work. You can pass only one item.

```
{% raw %}{% renderTemplate "webc", metadata, collections %}
    <site-nav></site-nav>
{% endrenderTemplate %}{% endraw %}
```

My solution was to put the two objects into an Object.

```
{% raw %}{% renderTemplate "webc", data={collections: collections,metadata: metadata} %}
    <site-nav></site-nav>
{% endrenderTemplate %}{% endraw %}
```

Now `this.data` had all the info I needed to build the nav.

In the njk version of the nav, to get the page to include in the navigation I was able to loop on `collections.all` and filter like this:

```
{% raw %}{%- for entry in collections.all | eleventyNavigation %}
<li>...</li>
{%- endfor %}{% endraw %}
```

In the WebC version of the component I was getting all the collection's items (pages, tags etc...). Because the data used by eleventyNavigation is in the Front Matter, I can access that information in the data object of each page. First I get the collections passed in the renderTemplate, then filter the collections.all to only the ones with a `data.eleventyNavigation`. Finally I use a .map on the leftovers to generate the necessary HTML code. (I probably don't need the eleventyNavigation plugin as long as I keep the variables in the Front Matter of the files 🤔)

```javascript
<script webc:type="render" webc:is="template">
    function () {
        let collection = this.data[0].all;
        let navigation = collection.filter(page => page.data.eleventyNavigation)
        return navigation.map((page) => {
            return `<li class="header__item">
            <a href="${page.url}">${page.data.title}</a>
            </li>`})
        .join("");
    }
</script>
```

Now I'm getting the same rendering as before. Except that the nav & the footer from this website are generated from WebC components instead of Nunjucj includes. Next I should probably try to convert the theme switcher and probably the book cards.

If you want to see the full code can explore it on [github](https://github.com/covallee/constant-11ty).

## Thank you

Zach Leatherman for the documentation and the few [videos on youtube](https://www.youtube.com/@EleventyVideo).
Stephanie Eckles for the [guide to WebC](https://11ty.rocks/posts/understanding-webc-features-and-concepts/).
Evan Sheehan aka darthmall for [11ty.webc.fun](https://11ty.webc.fun/) and the replies in the 11ty Discord.
Bryan Robinson for his [article on renderTemplate](https://bryanlrobinson.com/blog/11ty-second-11ty-the-render-plugin-part-1/).
