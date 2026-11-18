import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useCurrentUser, useLogout } from "@/shared/api";
import { ACCOUNT_TEXT, AUTH_TEXT } from "@/shared/config/constants";
import { ROUTES } from "@/shared/config/routes";
import { signedOut, useToast } from "@/shared/slices";
import { Button, SkeletonList } from "@/shared/ui/reusablecomponent";
import styles from "../page.module.scss";

export default function AccountPage() {
  const user = useCurrentUser();
  const logout = useLogout();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const signOut = () =>
    // The local session ends even if the server call fails.
    logout.mutate({}, {
      onSettled: () => {
        dispatch(signedOut());
        toast.info(AUTH_TEXT.signedOut);
      },
    });

  if (user.isPending) return <SkeletonList rows={3} />;

  return (
    <div className={styles.narrow}>
      <h1>{ACCOUNT_TEXT.title}</h1>
      {user.isError ? <p>{ACCOUNT_TEXT.loadFailed}</p> : (
        <dl className={styles.details}>
          <dt>{ACCOUNT_TEXT.name}</dt><dd>{user.data.name}</dd>
          <dt>{ACCOUNT_TEXT.email}</dt><dd>{user.data.email}</dd>
          <dt>{ACCOUNT_TEXT.username}</dt><dd>{user.data.username}</dd>
        </dl>
      )}
      <div className={styles.form}>
        <Button variant="outline" fullWidth onClick={() => void navigate(ROUTES.orders)}>{ACCOUNT_TEXT.orders}</Button>
        <Button variant="ghost" fullWidth loading={logout.isPending} onClick={signOut}>{ACCOUNT_TEXT.signOut}</Button>
      </div>
    </div>
  );
}
