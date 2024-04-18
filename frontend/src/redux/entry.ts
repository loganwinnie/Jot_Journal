import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface EntryInterface {
  id: string;
  created_at: string;
  updated_at: string | null;
  content: string | null;
  emoji: string | null;
  emoji_name: string | null;
  title: string | null;
}

const initialState: {
  active: EntryInterface | null;
  entries: EntryInterface[];
} = {
  active: null,
  entries: [],
};

/** Entry slice for entry state */
const entrySlice = createSlice({
  name: "entry",

  initialState,
  reducers: {
    setActive: (
      state,
      action: PayloadAction<{
        entry: EntryInterface | null;
      }>,
    ) => {
      const { entry } = action.payload;
      return (state = {
        ...state,
        active: entry,
      });
    },

    clearEntry: (state) => {
      state.active = null;
    },

    setEntries: (
      state,
      action: PayloadAction<{
        entries: EntryInterface[];
      }>,
    ) => {
      const { entries } = action.payload;
      return (state = {
        ...state,
        entries: entries,
      });
    },

    editEntry: (
      state,
      action: PayloadAction<{
        entry: EntryInterface;
      }>,
    ) => {
      const { entry } = action.payload;
      const idx = state.entries.findIndex((elm) => elm.id === entry.id);
      return (state = {
        active: entry,
        entries: [
          entry,
          ...state.entries.slice(0, idx),
          ...state.entries.slice(idx + 1),
        ],
      });
    },

    addEntry: (
      state,
      action: PayloadAction<{
        entry: EntryInterface;
      }>,
    ) => {
      const { entry } = action.payload;
      return (state = {
        active: entry,
        entries: [entry, ...state.entries],
      });
    },
    deleteAndClearEntry: (
      state,
      action: PayloadAction<{
        entry: EntryInterface | null;
      }>,
    ) => {
      const { entry } = action.payload;
      const idx = state.entries.findIndex((elm) => elm.id === entry!.id);
      return (state = {
        active: null,
        entries: [
          ...state.entries.slice(0, idx),
          ...state.entries.slice(idx + 1),
        ],
      });
    },
  },
});

export const {
  setActive,
  clearEntry,
  setEntries,
  addEntry,
  editEntry,
  deleteAndClearEntry,
} = entrySlice.actions;

export default entrySlice.reducer;

/** getEntry: gets user entry object */
export const getEntry = (state: {
  entry: {
    active: EntryInterface | null;
    entries: EntryInterface[];
  };
}) => {
  return state.entry;
};

/** getActive: Gets user active entry */
export const getActive = (state: {
  entry: {
    active: EntryInterface | null;
    entries: EntryInterface[];
  };
}) => {
  return state?.entry?.active;
};
