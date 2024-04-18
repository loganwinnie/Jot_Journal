import { useSelector } from "react-redux";
import { getSidebarOpen, toggleSidebar } from "../../redux/toggle";
import { useAppDispatch } from "../../redux/hooks";
import { getUser, logoutUser } from "../../redux/user";
import { useCreateEntryMutation } from "../../api/entry";
import { addEntry } from "../../redux/entry";

interface EntryInterface {
  id: string;
  created_at: string;
  updated_at: string | null;
  content: string;
  emoji: string;
  emoji_name: string;
  title: string;
}

/**
 * Renders Nav bar Links depending on if user is logged in
 *
 * Context:
 *
 * App -> Navbar
 */
function NavBar() {
  const [createEntry] = useCreateEntryMutation();
  const sidebarState = useSelector(getSidebarOpen);
  const { user } = useSelector(getUser);
  const dispatch = useAppDispatch();

  /** handleNewEntry: Creates a blank entry for user.  */
  async function handleNewEntry(evt: {
    preventDefault: () => void;
  }): Promise<void> {
    evt.preventDefault();
    try {
      const entry: { entry: EntryInterface } = await createEntry({
        title: null,
        content: null,
        emoji: null,
        emoji_name: null,
      }).unwrap();
      dispatch(addEntry(entry));
    } catch (err) {
      if (err instanceof Array) {
        //   setErrors(err);
      }
    }
  }

  return (
    <>
      <div
        className={`fixed z-50 flex h-16 w-full items-center justify-between border-b-2 bg-light-100 px-8 py-8`}
      >
        <div className="flex items-center gap-4">
          {user && (
            <div
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={`"w-8 h-8 transition-transform delay-75 ${sidebarState ? "rotate-90 scale-x-110 scale-y-150" : "scale-x-100"}`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
                />
              </svg>
            </div>
          )}
          {user && (
            <button onClick={handleNewEntry}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-12 w-12 fill-primary-300 font-extrabold text-light-100 transition-all hover:scale-110 hover:fill-primary-200 active:scale-95 active:fill-primary-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="flex items-center gap-4">
          <h1 className="select-none font-Flegrei text-4xl text-primary-200 underline decoration-primary-300">
            Jot
          </h1>
          {user && (
            <button
              onClick={() => dispatch(logoutUser())}
              className="btn-secondary select-none"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default NavBar;
