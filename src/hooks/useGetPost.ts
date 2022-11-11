import { useRouter } from 'next/router';

import { usePostQuery } from 'src/generated/graphql';

const useGetPost = () => {
  const { query } = useRouter();
  const postId = Number(query?.id);
  return usePostQuery({ variables: { id: postId }, pause: !postId });
};

export default useGetPost;
