import Cache from '@11ty/eleventy-fetch';
import dotenv from 'dotenv';

dotenv.config();

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

export default async function () {
  let url = 'https://api.notion.com/v1/databases/238c4654c5444b6a959e86f7388fb9f6/query';

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

  return json;
}
