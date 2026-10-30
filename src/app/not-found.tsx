import Link from "next/link";
import { Arrow } from "@/components/icons";
export default function NotFound() {
  return (
    <div className="container error-page">
      <span className="eyebrow">404 / NO MEMORY AT THIS ADDRESS</span>
      <h1>A fresh place to start.</h1>
      <p>
        This page could not be found. Head back to the product, or start with
        the developer quickstart.
      </p>
      <Link href="/" className="button">
        Back to UniMem <Arrow />
      </Link>
      <Link href="/developers" className="button button-outline">
        Developer quickstart <Arrow />
      </Link>
    </div>
  );
}
