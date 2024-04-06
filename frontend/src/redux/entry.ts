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
      state = {
        ...state,
        active: entry,
      };
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

    addEntry: (
      state,
      action: PayloadAction<{
        entry: EntryInterface;
      }>,
    ) => {
      const { entry } = action.payload;
      state.active = entry;
      state.entries = [...state.entries, entry];
    },
  },
});

export const { setActive, clearEntry, setEntries, addEntry } =
  entrySlice.actions;

export default entrySlice.reducer;

export const getEntries = (state: {
  entry: {
    active: EntryInterface | null;
    entries: EntryInterface[];
  };
}) => {
  return state.entry;
};
