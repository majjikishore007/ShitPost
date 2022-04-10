import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import router, { useRouter } from 'next/router';
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
    <Flex
      minH={'80vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={8} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'2xl'}>Sign in to your account</Heading>
        </Stack>
        <Formik
          initialValues={{ usernameOrEmail: '', password: '' }}
          onSubmit={async (values, { setErrors }) => {
            const response = await login(values);
            if (response.data?.login.errors) {
              setErrors(toErrorMap(response.data.login.errors));
            } else if (response.data?.login.user) {
              if (typeof router.query.next === 'string') {
                router.push(router.query.next);
              } else router.push('/');
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputFeild
                label=''
                name='usernameOrEmail'
                type='username or email'
                placeholder='Username or email'
              ></InputFeild>
              <Box mt={4}>
                <InputFeild
                  label=''
                  name='password'
                  type='password'
                  placeholder='password'
                ></InputFeild>
              </Box>
              <Flex mt={2}>
                <NextLink href={'/forgot-password'}>
                  <Link color={'blue.400'} ml={'auto'}>
                    Forgot password ?
                  </Link>
                </NextLink>
              </Flex>
              <Stack spacing={10} pt={2}>
                <Button
                  isLoading={isSubmitting}
                  mt={4}
                  colorScheme='teal'
                  type={'submit'}
                >
                  Login
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>

        <Stack pt={6}>
          <Text align={'center'}>
            Not yet registered ?{' '}
            <NextLink href={'/register'}>
              <Link color={'blue.400'}>register</Link>
            </NextLink>
          </Text>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
