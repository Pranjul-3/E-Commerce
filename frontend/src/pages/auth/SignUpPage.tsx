import { useState, type FormEvent } from "react";
import { useDispatch } from "react-redux";
import { Link, Navigate, useLocation } from "react-router";
import { useCreateUser, useLogin } from "@/shared/api";
import { AUTH_TEXT } from "@/shared/config/constants";
import { ROUTES, safeReturnPath } from "@/shared/config/routes";
import { signedIn, useIsSignedIn, useToast } from "@/shared/slices";
import { Button, TextField } from "@/shared/ui/reusablecomponent";
import styles from "../page.module.scss";

const MIN_USERNAME = 4;
const MIN_PASSWORD = 10;

export default function SignUpPage() {
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "" });
  const createUser = useCreateUser();
  const login = useLogin();
  const dispatch = useDispatch();
  const toast = useToast();
  const isSignedIn = useIsSignedIn();
  const location = useLocation();
  const from = (location.state as { from?: unknown } | null)?.from;
  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (value: string) => setForm({ ...form, [key]: value }),
    required: true,
  });

  if (isSignedIn) return <Navigate to={safeReturnPath(from)} replace />;

  const valid =
    form.name.trim() && form.email.includes("@") &&
    form.username.trim().length >= MIN_USERNAME && form.password.length >= MIN_PASSWORD;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    createUser.mutate(
      { body: form },
      {
        onSuccess: async () => {
          toast.success(AUTH_TEXT.created);
          try {
            dispatch(signedIn(await login.mutateAsync({ body: { username: form.username, password: form.password } })));
          } catch {
            toast.info(AUTH_TEXT.signInTitle);
          }
        },
        onError: () => toast.error(AUTH_TEXT.signUpFailed),
      },
    );
  };

  return (
    <div className={styles.narrow}>
      <h1>{AUTH_TEXT.signUpTitle}</h1>
      <form className={styles.form} onSubmit={submit}>
        <TextField label={AUTH_TEXT.name} autoComplete="name" {...field("name")} />
        <TextField label={AUTH_TEXT.email} type="email" autoComplete="email" {...field("email")} />
        <TextField label={AUTH_TEXT.username} autoComplete="username" {...field("username")}
          validate={(v) => (v.trim().length < MIN_USERNAME ? AUTH_TEXT.usernameTooShort : null)} />
        <TextField label={AUTH_TEXT.password} type="password" autoComplete="new-password" helperText={AUTH_TEXT.passwordHelp} {...field("password")}
          validate={(v) => (v.length < MIN_PASSWORD ? AUTH_TEXT.passwordTooShort : null)} />
        <Button type="submit" size="lg" fullWidth loading={createUser.isPending} disabled={!valid}>{AUTH_TEXT.signUp}</Button>
      </form>
      <p className={styles.switch}>{AUTH_TEXT.haveAccount} <Link to={ROUTES.signIn} state={location.state}>{AUTH_TEXT.signIn}</Link></p>
    </div>
  );
}
