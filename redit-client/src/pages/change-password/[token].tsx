import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { InputFiled } from '../../components/InputFiled';
import { Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClinet';
import { toErrorMap } from '../../utils/toErrorMap';
import NextLink from 'next/link';

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();
  const [tokenErrors, setTokenErrors] = useState('');
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token: token,
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            console.log(errorMap.token);

            if ('token' in toErrorMap) {
              setTokenErrors(errorMap.token);
            }
            console.log('token errors', tokenErrors);

            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputFiled
              label='newPassword'
              name='newPassword'
              type='password'
              placeholder='new Password'
            ></InputFiled>
            {tokenErrors ? (
              <Flex>
                <Box mr={2}>{tokenErrors}</Box>
                <NextLink href={'/forgot-password'}>
                  <Link>Click here to create a new password</Link>
                </NextLink>
              </Flex>
            ) : null}
            <Button
              isLoading={isSubmitting}
              mt={4}
              colorScheme='teal'
              type={'submit'}
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
