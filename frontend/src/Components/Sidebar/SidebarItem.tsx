import { useDispatch, useSelector } from "react-redux";
import { getEntry, setActive } from "../../redux/entry";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);

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
 * props:
 *  entry: entry. (object)
 *  sidebarOpen: state of sidebar. (boolean)
 *  last: determines conditional rendering of last entry in sidebar. (boolean)
 *
 * Sidebar ->SidebarItem
 */
function SidebarItem({
  entry,
  sidebarOpen,
  last,
}: {
  entry: EntryInterface;
  last: boolean;
  sidebarOpen: boolean;
}) {
  const timeAgo = new TimeAgo("en-US");
  const entries = useSelector(getEntry);
  const dispatch = useDispatch();

  /** updateActive: function that updates active entry on click */
  function updateActive() {
    dispatch(setActive({ entry }));
  }

  /** Renders if sidebar is open. */
  function ifOpen() {
    return (
      entry && (
        <div
          className={`flex items-center justify-start gap-4 border-t-2 border-light-200 p-4
         hover:bg-light-200 ${last && "border-b-2"} ${entries?.active?.id === entry.id && "bg-light-200"}
         `}
          id={entry.id}
          onClick={() => updateActive()}
        >
          {entry.emoji && entry.emoji_name ? (
            <h4 className="text-3xl" aria-details={entry.emoji_name}>
              {entry.emoji}
            </h4>
          ) : (
            <div className="h-12 w-12 rounded-full bg-light-300 opacity-70"></div>
          )}
          <h1 className="overflow-hidden text-nowrap font-Raleway text-xl font-bold">
            {entry.title || "No Title"}
          </h1>
          {entry.updated_at && (
            <p>{timeAgo.format(new Date(entry.updated_at))}</p>
          )}
        </div>
      )
    );
  }
  /** Renders if sidebar is closed. */
  function ifClosed() {
    return (
      entry && (
        <div
          className={`flex items-center justify-center border-t-2 border-light-200 py-4
         hover:bg-light-200 ${last && "border-b-2"} ${entries?.active?.id === entry.id && "bg-light-200"}
         `}
          id={entry.id}
          onClick={() => updateActive()}
        >
          {entry.emoji && entry.emoji_name ? (
            <h4 className="text-3xl" aria-details={entry.emoji_name}>
              {entry.emoji}
            </h4>
          ) : (
            <div className="h-12 w-12 rounded-full bg-light-300 opacity-70"></div>
          )}
        </div>
      )
    );
  }
  return sidebarOpen ? ifOpen() : ifClosed();
}

export default SidebarItem;
