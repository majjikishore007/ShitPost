import { Button, FormControl, Input, Textarea, VStack } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { Layout } from '../components/layout';
import { useCreatePostMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClinet';
import { useIsAuth } from '../utils/useIsAuth';

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [, createPost] = useCreatePostMutation();
  const formik = useFormik({
    initialValues: {
      title: '',
      text: '',
    },
    onSubmit: async (values) => {
      console.log('values', values);

      const { error } = await createPost({ input: values });
      if (error?.message.includes('not authenticated')) {
        router.push('/login');
      } else {
        router.push('/');
      }
    },
  });
  return (
    <Layout variant={'small'}>
      <form onSubmit={formik.handleSubmit}>
        <VStack spacing={4} align='flex-start'>
          <FormControl>
            <Input
              id='title'
              name='title'
              type='title'
              variant='filled'
              onChange={formik.handleChange}
              placeholder='title'
              value={formik.values.title}
            />
          </FormControl>
          <FormControl>
            <Textarea
              id='text'
              name='text'
              variant='filled'
              placeholder="what's happening?"
              onChange={formik.handleChange}
              value={formik.values.text}
            />
          </FormControl>

          <Button type='submit' colorScheme='twitter' isFullWidth>
            Post
          </Button>
        </VStack>
      </form>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
