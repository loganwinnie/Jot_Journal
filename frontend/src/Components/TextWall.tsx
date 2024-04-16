import { useEffect, useRef } from "react"
import {longLines} from "../text.tsx"


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
          delay += (line.textContent?.split(' ').length || 0) * 0.0125;
        }
      });
    }
  }, [longLines]);


  return (
    <div className="absolute z-0 overflow-hidden max-h-full pt-16 max-w-full select-none">
    {
            longLines.map((line, index) => (
              <div
                key={index}
                ref={(el) => (containerRef.current[index] = el)}
                className="text-left whitespace-nowrap text-light-300 overflow-hidden w-0 animate-revealLine"
                style={{ animationDelay: `${index * 2}s` }} // Adjust the delay multiplier as needed
              >
                {line}
              </div>
            ))
}
    </div>
  );
        }

export default TextWall