import { Link } from "@remix-run/react";

export default function index() {
  return (
    <p>
      <Link to="new" className="text-blue-600 underline">
        Create a new post
      </Link>
    </p>
  )
}
