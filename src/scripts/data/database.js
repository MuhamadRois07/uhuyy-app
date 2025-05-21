import { openDB } from 'idb';

const DATABASE_NAME = 'uhuyyapp';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'saved-uhuyy-story';

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database) {
    if (!database.objectStoreNames.contains(OBJECT_STORE_NAME)) {
      database.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
    }
  },
});

const Database = {
  async putStory(story) {
    if (!Object.hasOwn(story, 'id')) throw new Error('`id` is required to save.');
    return (await dbPromise).put(OBJECT_STORE_NAME, story);
  },

  async getStory(id) {
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },

  async getAllStories() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },

  async deleteStory(id) {
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },
};

export default Database;
