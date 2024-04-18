import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSidebarOpen } from "../../redux/toggle";
import { deleteAndClearEntry, editEntry } from "../../redux/entry";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import { useDebouncedCallback, useThrottledCallback } from "use-debounce";
import {
  useDeleteEntryMutation,
  useEditEntryMutation,
  useGeneratePromptMutation,
} from "../../api/entry";
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
 *  Component, Entry Form.
 *
 * Props:
 *  entry: entry to display
 *
 * State:
 *
 * Home -> Entry
 */
function Entry({ entry }: { entry: EntryInterface | null }) {
  const [editEntryApi, { isLoading: updateLoading }] = useEditEntryMutation();
  const [generatePromptApi, { isLoading: promptLoading }] =
    useGeneratePromptMutation();
  const [deleteEntry] = useDeleteEntryMutation();
  const sidebarState = useSelector(getSidebarOpen);
  const dispatch = useDispatch();
  const [togglePicker, setTogglePicker] = useState(false);
  const [entrySaved, setEntrySaved] = useState(true);
  const [prompt, setPrompt] = useState<{
    text: null | string;
    regenerate: boolean;
    length: number;
    error: null;
  }>({
    text: null,
    regenerate: false,
    length: 0,
    error: null,
  });

  const debounceUpdate = useDebouncedCallback(
    (value: formInterface) => updateEntry(value),
    1000,
  );

  const debounceGeneration = useThrottledCallback(() => generatePrompt(), 2000);

  const initialForm = {
    id: entry?.id || "",
    title: entry?.title || "",
    content: entry?.content || "",
    emoji: entry?.emoji || "",
    emoji_name: entry?.emoji_name || "",
  };

  useEffect(() => {
    function reloadEntry() {
      setFormData(initialForm);
      setTogglePicker(false);
    }
    reloadEntry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry, dispatch]);

  useEffect(() => {
    function toggleSaved() {
      if (!updateLoading) {
        setEntrySaved(true);
      }
    }
    toggleSaved();
  }, [updateLoading]);

  const [formData, setFormData] = useState(initialForm);

  async function updateEntry(data: formInterface) {
    const updatedEntry: { entry: EntryInterface } = await editEntryApi({
      content: data,
      entryId: data!.id,
    }).unwrap();
    dispatch(editEntry({ entry: updatedEntry.entry }));
  }

  /** handleChange: Handles change of form field.*/
  async function handleChange(
    evt: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setEntrySaved(false);
    // eslint-disable-next-line prefer-const
    let { name, value } = evt.target as HTMLInputElement;
    if (name === "content") {
      if (
        value.length < formData.content.length &&
        prompt.regenerate === true
      ) {
        value = formData.content.slice(
          0,
          formData.content.length - prompt.length,
        );
      }
      setFormData((oldData) => ({ ...oldData, content: value }));
      setPrompt({
        text: null,
        regenerate: false,
        length: 0,
        error: null,
      });
    } else {
      setFormData((oldData) => ({ ...oldData, [name]: value }));
    }
    debounceUpdate({ ...formData, [name]: value });
  }

  function handleEmoji(selected: EmojiInterface) {
    setFormData((prev) => ({
      ...prev,
      emoji: selected.native,
      emoji_name: selected.name,
    }));
    setTogglePicker((prev) => !prev);
    debounceUpdate({
      ...formData,
      emoji: selected.native,
      emoji_name: selected.name,
    });
  }

  async function deleteEntryOnClick() {
    await deleteEntry(entry!.id).unwrap();
    dispatch(deleteAndClearEntry({ entry: entry }));
  }

  async function generatePrompt() {
    const contentLength = formData.content.length;
    const queryChars =
      contentLength > 1000
        ? formData.content.slice(contentLength - 1000)
        : formData.content;

    try {
      const queryResp: { response: string } =
        await generatePromptApi(queryChars).unwrap();
      if (prompt.regenerate) {
        setFormData((oldData) => ({
          ...oldData,
          content: formData.content
            .slice(formData.content.length - prompt.length)
            .concat(` ${queryResp.response}`),
        }));
      } else {
        setFormData((oldData) => ({
          ...oldData,
          content: formData.content.concat(` ${queryResp.response}`),
        }));
      }
      console.log(queryResp);
      setPrompt({
        text: queryResp.response,
        regenerate: true,
        length: queryResp.response.length + 1,
        error: null,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setPrompt({
        text: null,
        regenerate: false,
        length: 0,
        error: err.data.detail,
      });
    }
  }
  return (
    <div
      className={`h-full bg-light-100 ${sidebarState ? "col-span-13" : "col-span-15"} py-4 md:px-16`}
    >
      <div className="mx-8 flex justify-between md:mx-0">
        <p className="mb-4 flex text-light-400">
          {entrySaved ? "All changes saved." : "Saving..."}
        </p>
        <div
          className=" mb-8 flex h-8 w-24 items-center justify-center rounded-md bg-danger font-semibold text-light-100 opacity-80 transition-all duration-100 hover:opacity-95 active:scale-95"
          onClick={() => deleteEntryOnClick()}
        >
          Delete
        </div>
      </div>
      <form action="PATCH" className=" flex h-full min-h-full grow flex-col">
        <div className="absolute z-50 mx-4 md:mx-0">
          <label className="label" htmlFor="emoji"></label>
          {togglePicker ? (
            <Picker data={data} onEmojiSelect={handleEmoji} />
          ) : (
            <button
              className="border-3 rounded-xl bg-light-300 bg-opacity-40 p-2 text-xl"
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
          className="textarea absolute mt-20 h-4/6 w-full max-w-full resize-none border-2 text-left text-light-100 outline-none empty:before:text-neutral-400 empty:before:content-['Today_I_am_feeling...']
          md:max-h-[78%] md:min-h-[78%] md:min-w-[65%] md:max-w-[65%]"
          role="textbox"
          name="content"
          disabled={promptLoading}
          value={formData.content}
          onChange={handleChange}
          placeholder="Today I am feeling..."
        ></textarea>
        <p
          className="textarea pointer-events-none absolute mt-20 h-4/6 w-full max-w-full select-none resize-none text-wrap break-words border-2 text-left outline-none
        md:max-h-[78%] md:min-h-[78%] md:min-w-[65%] md:max-w-[65%]"
        >
          {formData.content.slice(0, formData.content.length - prompt.length)}{" "}
          {promptLoading && (
            <span className="bg-[0%_100% length:200%_200%] bg-size inline-block  animate-gradientReveal bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent transition-all">
              generating...
            </span>
          )}
          {prompt.text && !promptLoading && (
            <span className="text-wrap break-words bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
              {prompt.text}
            </span>
          )}
          {prompt.error && <span className="text-danger">{prompt.error}</span>}
        </p>
      </form>
      <button
        onClick={debounceGeneration}
        className={`fixed bottom-10 right-10 h-12 w-12`}
        disabled={promptLoading}
      >
        {promptLoading || prompt.regenerate ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`fixed bottom-10 right-10 h-14 w-14 text-light-200 ${promptLoading && "animate-spin"} inline-block rounded-full bg-gradient-to-r from-primary-200 to-primary-400 p-2 transition-all duration-150`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="fixed bottom-10 right-10 h-14 w-14 rounded-lg bg-primary-500 p-3 text-light-200"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

export default Entry;
