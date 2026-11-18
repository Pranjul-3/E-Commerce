import { useState, type FormEvent } from "react";
import { useDispatch } from "react-redux";
import { Link, Navigate, useLocation } from "react-router";
import { useLogin } from "@/shared/api";
import { AUTH_TEXT } from "@/shared/config/constants";
import { ROUTES, safeReturnPath } from "@/shared/config/routes";
import { signedIn, useIsSignedIn, useToast } from "@/shared/slices";
import { Button, TextField } from "@/shared/ui/reusablecomponent";
import styles from "../page.module.scss";

const TOO_MANY_REQUESTS = 429;

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();
  const dispatch = useDispatch();
  const toast = useToast();
  const isSignedIn = useIsSignedIn();
  const location = useLocation();
  const from = (location.state as { from?: unknown } | null)?.from;

  if (isSignedIn) return <Navigate to={safeReturnPath(from)} replace />;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    login.mutate(
      { body: { username: username.trim(), password } },
      {
        onSuccess: (token) => dispatch(signedIn(token)),
        onError: (error) =>
          toast.error(error.status === TOO_MANY_REQUESTS ? AUTH_TEXT.tooMany : AUTH_TEXT.signInFailed),
      },
    );
  };

  return (
    <div className={styles.narrow}>
      <h1>{AUTH_TEXT.signInTitle}</h1>
      <form className={styles.form} onSubmit={submit}>
        <TextField label={AUTH_TEXT.username} value={username} onChange={setUsername} autoComplete="username" required />
        <TextField label={AUTH_TEXT.password} type="password" value={password} onChange={setPassword} autoComplete="current-password" required />
        <Button type="submit" size="lg" fullWidth loading={login.isPending} disabled={!username || !password}>{AUTH_TEXT.signIn}</Button>
      </form>
      <p className={styles.switch}>{AUTH_TEXT.noAccount} <Link to={ROUTES.signUp} state={location.state}>{AUTH_TEXT.signUp}</Link></p>
    </div>
  );
}
