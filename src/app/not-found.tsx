import { NotFoundView } from "@/components/NotFoundView";

export const metadata = {
  title: "404 - Page Not Found | LOGMAS Odeda",
  description: "The requested page could not be found.",
};

export default function GlobalNotFound() {
  return <NotFoundView />;
}
