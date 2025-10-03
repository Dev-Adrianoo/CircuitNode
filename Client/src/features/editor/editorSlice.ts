import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Node, Edge } from 'reactflow';
import type { RootState } from '@/service/store';

interface EditorState {
  nodes: Node[];
  edges: Edge[];
  validatedPinsMap: [string, string][];
}

const initialState: EditorState = {
  nodes: [],
  edges: [],
  validatedPinsMap: [],
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setNodes: (state, action: PayloadAction<Node[]>) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
    },
    setValidatedPinsMap: (state, action: PayloadAction<[string, string][]>) => {
      state.validatedPinsMap = action.payload;
    },
  },
});

export const { setNodes, setEdges, setValidatedPinsMap } = editorSlice.actions;


export const selectEditor = (state: RootState) => state.editor;

export default editorSlice.reducer;
