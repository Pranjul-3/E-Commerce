import { Component, type ReactNode } from "react";
import { ERROR_PAGE_TEXT } from "@/shared/config/constants";
import { logger } from "@/shared/lib";
import { Button } from "@/shared/ui/reusablecomponent";

export function ErrorPage() {
  return (
    <main className="message-page">
      <h1>{ERROR_PAGE_TEXT.title}</h1>
      <p>{ERROR_PAGE_TEXT.message}</p>
      <Button onClick={() => window.location.reload()}>{ERROR_PAGE_TEXT.reload}</Button>
    </main>
  );
}

export class AppErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError = () => ({ failed: true });
  componentDidCatch(error: Error) {
    logger.error(error);
  }
  render() {
    return this.state.failed ? <ErrorPage /> : this.props.children;
  }
}
