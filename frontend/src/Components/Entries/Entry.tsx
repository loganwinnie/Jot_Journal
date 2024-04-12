import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSidebarOpen } from "../../redux/toggle";
import { deleteAndClearEntry, editEntry, } from "../../redux/entry";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import { useDebouncedCallback } from "use-debounce";
import { useDeleteEntryMutation, useEditEntryMutation } from "../../api/entry";
init({ data });

interface EmojiInterface {
  id: string;
  keywords: string[];
  name: string;
  native: string;
  shortcodes: string;
  unified: string;
}

interface EntryInterface {
  id: string;
  created_at: string;
  updated_at: string | null;
  content: string | null;
  emoji: string | null;
  emoji_name: string | null;
  title: string | null;
}

interface formInterface {
  id: string;
  title: string;
  content: string;
  emoji: string;
  emoji_name: string;
}
// const initialForm = {
//     id: entry?.id || "",
//     title: entry?.title || "",
//     content: entry?.content || "",
//     emoji:entry?.emoji || "",
//     emoji_name: entry?.emoji_name ||""
// }

/*
 *  Component, Form for signing up an user.
 *
 * Props:
 *  signup: Function for signup a user.
 *  displayErrors: Function for setting errors
 *
 * State:
 *  formData: data input from form. Matches initial state fields
 *
 * RouteList -> LoginForm
 */

function Entry({ entry }: { entry: EntryInterface | null }) {
  const [editEntryApi] = useEditEntryMutation();
  const [deleteEntry] = useDeleteEntryMutation();
  const sidebarState = useSelector(getSidebarOpen);
  const dispatch = useDispatch();
  const [togglePicker, setTogglePicker] = useState(false);
  const debouncer = useDebouncedCallback(
    (value: formInterface) => updateEntry(value),
    1000,
  );

  useEffect(() => {
    function reloadEntry() {
        console.log("refresh", entry)
      setFormData({
        id: entry?.id || "",
        title: entry?.title || "",
        content: entry?.content || "",
        emoji: entry?.emoji || "",
        emoji_name: entry?.emoji_name || "",
      });
    }
    reloadEntry();
  }, [entry]);

  const [formData, setFormData] = useState({
    id: entry?.id || "",
    title: entry?.title || "",
    content: entry?.content || "",
    emoji: entry?.emoji || "",
    emoji_name: entry?.emoji_name || "",
  });

  async function updateEntry(data: formInterface) {
    console.log("updating");
    const updatedEntry: {entry: EntryInterface} = await editEntryApi({
      content: data,
      entryId: data!.id,
    }).unwrap();
    console.log(updatedEntry)
    dispatch(editEntry({ entry: updatedEntry.entry }));
  }

  /** handleChange: Handles change of form field.*/
  async function handleChange(
    evt: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = evt.target as HTMLInputElement;
    console.log(name, value);
    setFormData((oldData) => ({ ...oldData, [name]: value }));
    debouncer({ ...formData, [name]: value });
  }

  function handleEmoji(selected: EmojiInterface) {
    setFormData((prev) => ({
      ...prev,
      emoji: selected.native,
      emoji_name: selected.name,
    }));
    console.log(selected.native, selected.name);
    setTogglePicker((prev) => !prev);
    debouncer({ ...formData, emoji: selected.native, emoji_name: selected.name });
  }

  async function deleteEntryOnClick() {
    const deletedEntry = await deleteEntry(entry!.id).unwrap();
    console.log("DELETED", deletedEntry);
    dispatch(deleteAndClearEntry({ entry: entry }));
  }

  return (
    <div
      className={`h-full bg-light-100 ${sidebarState ? "col-span-13" : "col-span-15"} px-16 py-8`}
    >
      <div
        className=" mb-8 flex h-8 w-24 items-center justify-center rounded-md bg-red-300 font-semibold text-primary-500 hover:bg-red-400 active:scale-95"
        onClick={() => deleteEntryOnClick()}
      >
        Delete
      </div>
      <form action="PATCH" className="flex h-full min-h-full grow flex-col">
        <div className="absolute">
          <label className="label" htmlFor="emoji"></label>
          {togglePicker ? (
            <Picker data={data} onEmojiSelect={handleEmoji} />
          ) : (
            <button
              className="text-xl bg-opacity-40 border-3 rounded-xl bg-light-300 p-2"
              onClick={() => setTogglePicker((prev) => !prev)}
            >
              {formData.emoji || "😀"}
            </button>
          )}
          <label className="label" htmlFor="title"></label>
          <input
            className="input ml-4 max-w-64  font-Raleway text-3xl font-semibold"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={(evt) => handleChange(evt)}
            required
          />
        </div>
        <textarea
          className="textarea mt-20 min-h-full resize-none text-left
                    outline-none empty:before:text-neutral-400 empty:before:content-['Today_I_am_feeling...']"
          role="textbox"
          name="content"
          onChange={handleChange}
          placeholder="Today I am feeling..."
        ></textarea>
      </form>
    </div>
  );
}

export default Entry;
