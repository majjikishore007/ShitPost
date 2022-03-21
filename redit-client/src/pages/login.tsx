import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { InputFeild } from '../components/InputFiled';
import { Wrapper } from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClinet';
import { toErrorMap } from '../utils/toErrorMap';

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Wrapper variant={'small'}>
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            if (typeof router.query.next === 'string') {
              console.log(router);
              router.push(router.query.next);
            } else router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputFeild
              label='usernameOrEmail'
              name='usernameOrEmail'
              type='username or email'
              placeholder='Username or email'
            ></InputFeild>
            <Box mt={4}>
              <InputFeild
                label='password'
                name='password'
                type='password'
              ></InputFeild>
            </Box>
            <Flex mt={2}>
              <NextLink href={'/forgot-password'}>
                <Link ml={'auto'}>Forgot password ?</Link>
              </NextLink>
            </Flex>
            <Button
              isLoading={isSubmitting}
              mt={4}
              colorScheme='teal'
              type={'submit'}
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
