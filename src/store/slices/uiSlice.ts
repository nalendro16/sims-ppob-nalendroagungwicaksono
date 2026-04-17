import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface UiState {
  toast: {
    message: string
    type: 'success' | 'error'
  } | null
}

const initialState: UiState = {
  toast: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showToast: (
      state,
      action: PayloadAction<{ message: string; type: 'success' | 'error' }>,
    ) => {
      state.toast = action.payload
    },
    hideToast: (state) => {
      state.toast = null
    },
  },
})

export const { showToast, hideToast } = uiSlice.actions
export default uiSlice.reducer
