import { Wrapper } from "src/components/template/Wrapper/Wrapper"
import { PostsDocument, usePostsQuery } from 'src/generated/graphql';
import { withUrqlClient } from 'src/utils/createUrqlClient';
import { authorizedGuard,  } from 'src/utils/next';

const Home = () => {
  const [{ data }] = usePostsQuery();

  return (
    <Wrapper>
      <div>Hello world</div>
      {data?.posts.map(post => (
          <div key={post.id}>{post.title}</div>
        ))
      }
    </Wrapper>
  )
}

export const getServerSideProps = authorizedGuard(async(client) => {
  await client.query(PostsDocument).toPromise();
});

export default withUrqlClient(Home);
