import { ReactNode, useEffect, useRef, useState } from "react";

export default function EllipsisText({ text, className }: { text: string; className?: string }) {
  const [content, setContent] = useState<ReactNode>(text);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const listener = () => {
      console.log(ref.current?.scrollWidth, ref.current?.clientWidth);
      if (ref.current && ref.current.scrollWidth > ref.current.clientWidth) {
        setContent(
          <>
            <div
              className="inline-block overflow-hidden whitespace-nowrap"
              style={{ width: ref.current.clientWidth / 2 }}
            >
              {text}
            </div>
            <div dir="rtl" className="inline-block truncate" style={{ width: ref.current.clientWidth / 2 }}>
              {text}
            </div>
          </>
        );
      } else {
        setContent(text);
      }
    };

    listener();

    window.addEventListener("resize", listener, false);

    return () => window.removeEventListener("resize", listener, false);
  }, [text]);

  return (
    <span ref={ref} className={`truncate ${className}`}>
      {content}
    </span>
  );
}
