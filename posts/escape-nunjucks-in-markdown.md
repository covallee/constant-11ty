---
title: Escape Nunjucks in Markdown
metaDesc: How to add code blocks with nunjucks templating content in your markdown blog posts
date: 2020-12-13
tags:
  - 11ty
  - Nunjucks
layout: layouts/post.njk
socialImage: /img/socials/escape-nunjucks.jpg
---

Writing my last post I had a problem. How do you include code with Nunjucks template in your markdown when Nunjucks is your templating language?

Well you wrap your code with

```javascript
{{ "{% raw %}" | escape}}
Code goes here
{{ "{% endraw %}" | escape}}
```

I actually had to use another technique to be able to explain this 🤯. Thanks to [Larry Hudson](https://www.larryhudson.io/blog/2020/02/escaping-nunjucks-in-eleventy/) for this one.

```javascript
{% raw %}{{ "{% raw %}" | escape}}{% endraw %}
```

From the [docs](https://mozilla.github.io/nunjucks/templating.html#verbatim) the tag verbatim is supposed to do the same but I get an error with "tag verbatim not found" if I wrap any blocks

```javascript
{% raw %}{% verbatim %}{% endverbatim %}{% endraw %}
```
