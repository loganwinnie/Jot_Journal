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
  const [editEntryApi, {isLoading: updateLoading}] = useEditEntryMutation();
  const [deleteEntry] = useDeleteEntryMutation();
  const sidebarState = useSelector(getSidebarOpen);
  const dispatch = useDispatch();
  const [togglePicker, setTogglePicker] = useState(false);
  const [entrySaved, setEntrySaved] = useState(true)
  const debouncer = useDebouncedCallback(
    (value: formInterface) => updateEntry(value),
    1000,
  );

  const initialForm = {
    id: entry?.id || "",
    title: entry?.title || "",
    content: entry?.content || "",
    emoji:entry?.emoji || "",
    emoji_name: entry?.emoji_name ||""
}
  
  useEffect(() => {
    function reloadEntry() {
      setFormData(initialForm);
      console.log(entry?.id)
    }
    reloadEntry();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry, dispatch]);

  useEffect(() => {
    function toggleSaved() {
      if (!updateLoading) {
        setEntrySaved(true)
      }
    }
    toggleSaved()
  }, [updateLoading])

  const [formData, setFormData] = useState(initialForm);

  async function updateEntry(data: formInterface) {
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
    setEntrySaved(false)
    const { name, value } = evt.target as HTMLInputElement;
    setFormData((oldData) => ({ ...oldData, [name]: value }));
    debouncer({ ...formData, [name]: value });
  }

  function handleEmoji(selected: EmojiInterface) {
    setFormData((prev) => ({
      ...prev,
      emoji: selected.native,
      emoji_name: selected.name,
    }));
    setTogglePicker((prev) => !prev);
    debouncer({ ...formData, emoji: selected.native, emoji_name: selected.name });
  }

  async function deleteEntryOnClick() {
    await deleteEntry(entry!.id).unwrap();
    dispatch(deleteAndClearEntry({ entry: entry }));
  }

  return (
    <div
      className={`h-full bg-light-100 ${sidebarState ? "col-span-13" : "col-span-15"} px-16 py-4`}
    >
      <div className="flex justify-between">
        <p className="flex mb-4">{entrySaved ? "All changes saved." : "Saving..."}</p>
        <div
          className=" mb-8 flex h-8 w-24 items-center justify-center rounded-md bg-red-300 font-semibold text-primary-500 hover:bg-red-400 active:scale-95"
          onClick={() => deleteEntryOnClick()}
          >
          Delete
        </div>
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
          value={formData.content}
          onChange={handleChange}
          placeholder="Today I am feeling..."
        ></textarea>
      </form>
    </div>
  );
}

export default Entry;
