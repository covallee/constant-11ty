---
layout: layouts/home.njk
title: Bookshelf
templateClass: bookshelf
---

<div>
{{notion.json.results[1].book.properties.Name.title[0].text.content}}

{% for book in notion.json.results %}
    <p>Title: {{book.properties.Name.title[0].text.content}} </p>
{% endfor %}
</div>
