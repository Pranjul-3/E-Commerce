import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router/dom";
import { queryClient } from "@/shared/api";
import { ToastViewport } from "@/shared/ui/reusablecomponent";
import { AppErrorBoundary } from "./errors";
import { store } from "./providers/store";
import { router } from "./router/router";

export function App() {
  return (
    <AppErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ToastViewport />
        </QueryClientProvider>
      </Provider>
    </AppErrorBoundary>
  );
}
