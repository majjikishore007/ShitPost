import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import { InputFeild } from '../components/InputFiled';
import { InputTextArea } from '../components/InputTextArea';
import { Layout } from '../components/layout';
import { useCreatePostMutation } from '../generated/graphql';
import { useIsAuth } from '../utils/useIsAuth';
import { withApollo } from '../utils/withApollo';

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [createPost] = useCreatePostMutation();

  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (values) => {
          const { errors } = await createPost({
            variables: { input: values },
          });
          if (!errors) {
            router.push('/');
          }
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
              create post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(CreatePost);
