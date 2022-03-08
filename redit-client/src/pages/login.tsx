import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputFiled } from "../components/InputFiled";
import { Wrapper } from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClinet";
import { toErrorMap } from "../utils/toErrorMap";

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Wrapper variant={"small"}>
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputFiled
              label='usernameOrEmail'
              name='usernameOrEmail'
              type='username or email'
              placeholder='Username or email'
            ></InputFiled>
            <Box mt={4}>
              <InputFiled
                label='password'
                name='password'
                type='password'
              ></InputFiled>
            </Box>
            <Button
              isLoading={isSubmitting}
              mt={4}
              colorScheme='teal'
              type={"submit"}
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
