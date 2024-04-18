import { useEffect, useRef } from "react";
import { longLines } from "../text.tsx";

//0.0125
/**
 * Component for background wall of text
 * HomeAnon -> TextWall
 */
function TextWall() {
  const containerRef = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    let delay = 0;

    if (containerRef.current) {
      containerRef.current.forEach((line) => {
        if (line) {
          line.style.animationDelay = `${delay}s`;
          delay += (line.textContent?.split(" ").length || 0) * 0.001;
        }
      });
    }
  }, [longLines]);

  return (
    <div className="absolute z-0 max-h-[150%] max-w-full select-none overflow-hidden pt-16 lg:max-h-full">
      {longLines.map((line, index) => (
        <div
          key={index}
          ref={(el) => (containerRef.current[index] = el)}
          className="w-0 animate-revealLine overflow-hidden whitespace-nowrap text-left text-light-300"
          style={{ animationDelay: `${index * 2}s` }} // Adjust the delay multiplier as needed
        >
          {line}
        </div>
      ))}
    </div>
  );
}

export default TextWall;
