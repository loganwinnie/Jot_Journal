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

const entrySlice = createSlice({
  name: "entry",
  // `createSlice` will infer the state type from the `initialState` argument
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
      const entriesCopy = [...state.entries];
      entriesCopy[idx] = entry;
      return (state = {
        active: entry,
        entries: entriesCopy,
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
        entries: [...state.entries, entry],
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

export const getEntries = (state: {
  entry: {
    active: EntryInterface | null;
    entries: EntryInterface[];
  };
}) => {
  return state.entry;
};

export const getEntry = (state: {
  entry: {
    active: EntryInterface | null;
    entries: EntryInterface[];
  };
}) => {
  return state.entry;
};
