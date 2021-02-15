---
title: Flash of dark themed content (FODTC?)
description: test
date: 2020-12-12
tags:
  - 11ty
  - css
layout: layouts/post.njk
---

Setting up this website I ran into a tiny issue. Like all the cool kids I wanted to have two themes: dark and light. Using CSS custom properties and a class to identify the two theme it went pretty well. Then I saw a tweet from [@HenriHelvetica](https://twitter.com/HenriHelvetica/status/1207919960804265985) reminding us that it's nice to have a smooth transition between the two themes and not a full flash of colors. He is 100% right. So just add transition: background-color .5s, right? Well technically yes but that when the problems started for me. On Chrome and Safari, the website was still working fine and the transition was smooth but on Firefox (v83 at the time of the writing) every time you went to a new page you would get a flash of the light theme then the transition to the dark theme. So now you have a transition but the transition is triggered on every new page, which is not nice.
I tried a lot of things. Moved the CSS around. Tried different JS to control the theming. Removed fallback values for CSS custom properties... but nothing would do it. The body of the page would still flash every single time.

## The solution

You need to have the JS handling the theming run as soon as possible. If it's part of your bundle at the end of the HTML (where it should be) it will come in too late, at least for Firefox.

So in my setup (11ty with Nunjucks), this results in:

1. create a new JS file in your \_includes folder. In that file move all the code that is needed to handle the theme switching.

2. in your base.njk add in the head :

```javascript
{% raw %}{% set jsHead %}
  {% include "js/asSoonAsPossible.js" %}
{% endset %}
<script>{{ jsHead | safe }}</script>{% endraw %}
```
