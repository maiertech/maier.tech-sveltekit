import { getPosts } from '$lib/posts';

import type { RequestHandler } from './__types';
import tags from '$data/tags';

export const get: RequestHandler = async function ({ params }) {
  const { tag: id } = params;
  // Tag is undefined when not found in tags.
  const tag = tags.find((t) => t.id === id);
  if (!tag) {
    return {
      status: 404,
      // This custom error message is currently ignored.
      // https://github.com/sveltejs/kit/issues/3715
      error: `Tag '${id}' is not a valid tag.`,
    };
  }

  // Read tagged posts (in any category that has not set `suppress` to true.
  const posts = await getPosts({ tag: id });

  return {
    status: 200,
    body: { tag, posts },
  };
};
