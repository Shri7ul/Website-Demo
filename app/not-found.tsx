import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell section">
      <p className="meta text-steel-deep">404</p>
      <h1 className="display-2 mt-2">That page is not in the dossier.</h1>
      <p className="body-lg mt-4 max-w-[46ch] text-steel-deep">
        The link may be from the previous site, or the record may have been
        renamed. These routes exist.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          Home
        </Link>
        <Link href="/robots" className="btn btn-secondary">
          Robots
        </Link>
        <Link href="/experiments" className="btn btn-secondary">
          Experiments
        </Link>
        <Link href="/contact" className="btn btn-secondary">
          Contact
        </Link>
      </div>
    </div>
  );
}
