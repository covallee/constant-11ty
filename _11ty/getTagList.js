export default function getTagList(collection) {
  let tagSet = new Set();
  collection.getAll().forEach(function (item) {
    if ('tags' in item.data) {
      let tags = item.data.tags;

      tags = tags.filter(function (item) {
        switch (item) {
          case 'all':
          case 'nav':
          case 'post':
          case 'posts':
            return false;
        }

        return true;
      });

      for (const tag of tags) {
        tagSet.add(tag);
      }
    }
  });

  return [...tagSet];
}
