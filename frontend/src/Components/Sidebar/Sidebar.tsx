import { useSelector } from "react-redux";
import { getSidebarOpen } from "../../redux/toggle";
import SidebarItem from "./SidebarItem";

interface EntryInterface {
  id: string;
  created_at: string;
  updated_at: string | null;
  content: string | null;
  emoji: string | null;
  emoji_name: string | null;
  title: string | null;
}

/**
 * Renders Side bar For entries
 *
 * Props:
 * entries: Array of entries ([object])
 *
 * App -> Sidebar -> SidebarItem
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Sidebar({ entries }: { entries: EntryInterface[] }) {
  const sidebarState = useSelector(getSidebarOpen);

  return (
    <div
      className={`border-r-4 bg-light-100 ${sidebarState ? "col-span-3" : "hidden md:col-span-1"} no-scrollbar max-h-full overflow-y-scroll`}
    >
      {entries &&
        entries.map((entry: EntryInterface, index) => (
          <SidebarItem
            entry={entry}
            sidebarOpen={sidebarState}
            key={`${entry.id}+${index}`}
            last={index === entries.length - 1}
          />
        ))}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="text-bold fixed bottom-4 left-4 h-8 w-8 rounded-full bg-dark-300 p-2 text-white opacity-60 bg-blend-color-dodge filter"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
        />
      </svg>
    </div>
  );
}

export default Sidebar;
