import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput";

const EmailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;

export const validateRegister = (options: UsernamePasswordInput) => {
  if (!EmailRegex.test(options.email)) {
    return [
      {
        field: "email",
        message: "invalid email",
      },
    ];
  }
  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "cannot include an @",
      },
    ];
  }
  if (options.username.length <= 2) {
    return [
      {
        field: "username",
        message: "length must be greater than 2",
      },
    ];
  }

  if (options.password.length <= 2) {
    return [
      {
        field: "password",
        message: "length must be greater than 2",
      },
    ];
  }

  return null;
};
