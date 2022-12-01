---
title: Notion API with 11ty
metaDesc: How to use the Notion API in 11ty
date: 2021-07-04
tags:
  - notion
layout: layouts/post.njk
socialImage: /img/socials/notion-11ty.jpg
---

My latest weekend project was to play with the new container query in CSS, but since it's very experimental for the moment I didn't want to use it on the main part of the website. Notion released the first beta version of their much-awaited API a few weeks ago. So might as well combine two betas. I have a list of the books I've read in a Notion table. (Post on container query will come ~~soon~~ one day)

Notion released an SDK to use their API (`@notionhq/client`). It's probably great, but I don't want to add another package to call an API. 11ty has the great `eleventy-cache-assets` plugins to load external data, and in our case, the data is not gonna change very often so caching the response makes perfect sense.
So first let's add that package to our repo. Also, there is a token so we are gonna use `dotenv`.

```
npm install -D @11ty/eleventy-cache-assets
npm install -D dotenv
```

## Set up Integration

In Notion, go to the `Setting & Members` panel, then `Integrations` tab and click on the "Develop your own integrations" link. Choose "Create new integration", pick a name, and then submit. Your API token will be under Secrets. Copy and paste it into your `.env`, we will need it in our API calls.

Next, we need to give our Integration access to the databases/pages we want to access through the API. By default, nothing is shared for safety. To make the data available, it's the same process as giving access to a friend to your page. On your page, click on the share button in the top right corner, then invite and you should see the integration as an option.

Finaly, we need to get the Database_ID. Click again on the share button and then copy the link. When you paste the link into a browser window you will be able to see the ID of your database. It's the part after the slash and before the ?.

## Call the API

Everything is set up and we have all the information we need to make our first call. In your \_data folder, create a new .js file and import our two packages like this.

```javascript
const Cache = require('@11ty/eleventy-cache-assets');
require('dotenv').config();
```

To read the data from our database we can make a call like this.

```javascript
module.exports = async function () {
  let url = 'https://api.notion.com/v1/databases/DATABASE_ID/query';

  let json = await Cache(url, {
    duration: '1d',
    type: 'json',
    fetchOptions: {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
        'Notion-Version': '2021-05-13',
        'Content-Type': 'application/json',
      },
    },
  });

  return {
    json,
  };
};
```

It will create a new .cache folder with the response. (It is strongly recommended that you add the .cache folder to your .gitignore file so that network responses aren’t checked in to your git repository.)

In our templates, we can call the data directly. For example, in my case, my file in \_data is called notion.js, so in my nunjuck I can access the data with notion.json.results.

## Add filters

If we want to filter and/or sort directly the query we can pass an object in the body of the request. For example, I just want the book I have finish reading sorted by date.

```javascript
const filter = {
  filter: {
    property: 'Read',
    checkbox: {
      equals: true,
    },
  },
  sorts: [
    {
      property: 'Finish',
      direction: 'descending',
    },
  ],
};

module.exports = async function () {
  let url = 'https://api.notion.com/v1/databases/DATABASE_ID/query';

  let json = await Cache(url, {
    duration: '1d',
    type: 'json',
    fetchOptions: {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
        'Notion-Version': '2021-05-13',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filter),
    },
  });

  return {
    json,
  };
};
```

# Few Gotcha from the API

You need to do a POST to get the data in your database, even if you are not doing any filtering or sorting. If you use a GET you only receive the structure of your database.

If you are fetching a table and some cells are empty, they will not be in the response. You might expect something like `properties.NameOfTheColumn.text.content = null` but the whole key NameOfTheColumn will be absent from the JSON. So you need to either have a check in your template or make sure that you have something in every cells you are gonna use in your template.
