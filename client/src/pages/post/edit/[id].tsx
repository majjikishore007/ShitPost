import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { InputFeild } from '../../../components/InputFiled';
import { InputTextArea } from '../../../components/InputTextArea';
import { Layout } from '../../../components/layout';
import {
  usePostQuery,
  useUpdatePostMutation,
} from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClinet';
import { useGetIntId } from '../../../utils/useGetIntId';
import { withApollo } from '../../../utils/withApollo';
const EditPost = ({}) => {
  const router = useRouter();
  const intId = useGetIntId();
  const { data, loading, error } = usePostQuery({
    skip: intId == -1,
    variables: {
      id: intId,
    },
  });
  const [updatePost] = useUpdatePostMutation();
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
    <Layout variant='small'>
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          await updatePost({ variables: { id: intId, ...values } });
          router.push('/');
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputFeild name='title' placeholder='title' label='Title' />
            <Box mt={4}>
              <InputTextArea
                placeholder='text'
                label='text'
                name='text'
              ></InputTextArea>
            </Box>
            <Button
              mt={4}
              type='submit'
              isLoading={isSubmitting}
              colorScheme='teal'
            >
              Update post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(EditPost);
