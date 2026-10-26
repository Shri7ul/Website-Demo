"use client";

import { useId, useState } from "react";
import { site } from "@/content/site";

type Subject = "Team inquiry" | "Collaboration" | "Sponsorship" | "Recruitment" | "Technical inquiry" | "Other";

const SUBJECTS: Subject[] = [
  "Team inquiry",
  "Collaboration",
  "Sponsorship",
  "Recruitment",
  "Technical inquiry",
  "Other",
];

/**
 * The site has no backend, so the form composes a mailto: message and hands it
 * to the user's mail client. That is a real, working action — not a dead button
 * pretending to submit.
 */
export function ContactForm({
  defaultSubject = "Team inquiry",
  compact = false,
}: {
  defaultSubject?: Subject;
  compact?: boolean;
}) {
  const id = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState<Subject>(defaultSubject);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [sentHref, setSentHref] = useState("");

  const validate = () => {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "Please enter a valid email address.";
    if (message.trim().length < 12)
      next.message = "Please give us at least a sentence of context.";
    return next;
  };

  const compose = () => {
    const body = `${message}\n\n—\n${name}\n${email}`;
    return `mailto:${site.email}?subject=${encodeURIComponent(
      `[${subject}] via website`
    )}&body=${encodeURIComponent(body)}`;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = Object.keys(next)[0];
      document.getElementById(`${id}-${first}`)?.focus();
      return;
    }

    const href = compose();
    setSentHref(href);
    setSent(true);
    window.location.href = href;
  };

  const field = (k: string) =>
    errors[k] ? "border-needs-review" : "border-steel";

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-[46rem]">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor={`${id}-name`} className="meta block text-steel-deep">
            Full name
          </label>
          <input
            id={`${id}-name`}
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${id}-name-err` : undefined}
            className={`ui mt-1 h-12 w-full border bg-paper px-3 text-ink ${field("name")}`}
          />
          {errors.name && (
            <p id={`${id}-name-err`} className="meta mt-1 text-needs-review">
              {errors.name}
            </p>
          )}
        </div>

        <div className="sm:col-span-1">
          <label htmlFor={`${id}-email`} className="meta block text-steel-deep">
            Email address
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${id}-email-err` : undefined}
            className={`ui mt-1 h-12 w-full border bg-paper px-3 text-ink ${field("email")}`}
          />
          {errors.email && (
            <p id={`${id}-email-err`} className="meta mt-1 text-needs-review">
              {errors.email}
            </p>
          )}
        </div>

        {!compact && (
          <div className="sm:col-span-2">
            <label
              htmlFor={`${id}-subject`}
              className="meta block text-steel-deep"
            >
              Subject
            </label>
            <select
              id={`${id}-subject`}
              name="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
              className="ui mt-1 h-12 w-full border border-steel bg-paper px-2 text-ink"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="sm:col-span-2">
          <label
            htmlFor={`${id}-message`}
            className="meta block text-steel-deep"
          >
            Message
          </label>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? `${id}-message-err` : undefined}
            className={`body mt-1 w-full border bg-paper px-3 py-2 text-ink ${field("message")}`}
          />
          {errors.message && (
            <p id={`${id}-message-err`} className="meta mt-1 text-needs-review">
              {errors.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary">
          {sent ? "Compose message again" : "Compose message"}
        </button>
        <p className="meta text-steel-deep">
          Opens your mail client with the message filled in. Nothing is stored on
          this site.
        </p>
      </div>

      {sent ? (
        <p className="meta mt-3 text-steel-deep">
          Nothing opened?{" "}
          <a href={sentHref} className="link-prose" data-testid="mailto-fallback">
            Open the prepared message
          </a>{" "}
          or write to{" "}
          <a href={`mailto:${site.email}`} className="link-prose">
            {site.email}
          </a>
          .
        </p>
      ) : null}

      <p aria-live="polite" className="sr-only">
        {sent ? "Your mail client should now be open with the message." : ""}
      </p>
    </form>
  );
}
