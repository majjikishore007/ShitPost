import { AtSignIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Link, Stack, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { useState } from 'react';
import { Layout } from '../components/layout';
import { UpVote } from '../components/UpVote';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClinet';
const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });
  if (!fetching && !data) {
    return <div>Something went wrong.... !</div>;
  }
  return (
    <>
      <Layout>
        {!data && fetching ? (
          <div>loading...</div>
        ) : (
          <Stack p={4} spacing={8} margin={'auto'}>
            {data?.posts.posts.map((post) =>
              !post ? null : (
                <Box
                  p={5}
                  key={post.id}
                  shadow='md'
                  borderWidth='1px'
                  borderRadius='10px'
                >
                  <Flex align='center'>
                    <NextLink href='/post/[id]' as={`/post/${post.id}`}>
                      <Link>
                        <Text fontFamily={'heading'} fontSize={'1.5em'}>
                          {post.title}
                        </Text>
                      </Link>
                    </NextLink>
                    <Text
                      px={2}
                      cursor='pointer'
                      fontSize='12px'
                      textDecoration={'underline'}
                    >
                      <AtSignIcon></AtSignIcon>
                      {post.creator.username}
                    </Text>
                  </Flex>
                  <Text mt={4}>{post.textSnippet}</Text>
                  <UpVote post={post} />
                </Box>
              )
            )}
          </Stack>
        )}
        {data && data?.posts.hasMore ? (
          <Flex>
            <Button
              onClick={() => {
                setVariables({
                  limit: variables.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                });
              }}
              isLoading={fetching}
              m='auto'
              my={8}
            >
              load more
            </Button>
          </Flex>
        ) : null}
      </Layout>
    </>
  );
};
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
