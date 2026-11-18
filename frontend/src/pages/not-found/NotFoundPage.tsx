import { Link } from "react-router";
import { NOT_FOUND_TEXT } from "@/shared/config/constants";
import { ROUTES } from "@/shared/config/routes";

export default function NotFoundPage() {
  return (
    <div className="message-page">
      <h1>{NOT_FOUND_TEXT.title}</h1>
      <Link to={ROUTES.shop}>{NOT_FOUND_TEXT.back}</Link>
    </div>
  );
}
