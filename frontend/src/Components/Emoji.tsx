import { ReactNode } from "react";

/**
 * Renders Side bar For entries
 *
 * Context:
 *  user: userContext
 *
 * App -> Navbar -> {Link,...}
 */
function Emoji({ code }: { code: ReactNode }) {
  return (
    <div className="col-span-1 bg-secondary-300">
      <span className="" role="img" aria-label="emoji">
        U+{code}
      </span>
    </div>
  );
}

export default Emoji;
