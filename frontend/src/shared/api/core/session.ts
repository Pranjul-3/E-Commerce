/** How the API layer reaches the signed-in session without depending on the store. */
interface SessionBridge {
  getToken: () => string | null;
  onExpired: () => void;
}

let bridge: SessionBridge = { getToken: () => null, onExpired: () => undefined };

export const connectSession = (next: SessionBridge) => {
  bridge = next;
};

export const sessionToken = () => bridge.getToken();
export const sessionExpired = () => bridge.onExpired();
