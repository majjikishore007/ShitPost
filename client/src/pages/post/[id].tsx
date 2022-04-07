import { Box, Heading } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { Layout } from '../../components/layout';
import { usePostQuery } from '../../generated/graphql';
import { withApollo } from '../../utils/withApollo';

const Post = ({}) => {
  const router = useRouter();
  const intId =
    typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
  const { data, loading, error } = usePostQuery({
    skip: intId == -1,
    variables: {
      id: intId,
    },
  });

  if (loading) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Heading mb={4}>{data.post.title}</Heading>
      <Box mb={4}>{data.post.text}</Box>
    </Layout>
  );
};

export default withApollo({ ssr: true })(Post);
