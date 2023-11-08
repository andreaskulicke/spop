import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from './store';

export interface CategoriesState {
    id: string;
    name: string;
}

// Define the initial state using that type
export const initialState: CategoriesState[] = [
    {
        id: "vegetables",
        name: "Gemüse",
    },
    {
        id: "sweets",
        name: "Süßigkeiten",
    },
];

export const categoriesSlice = createSlice({
    name: "categories",
    initialState,
    reducers: {
        addCategory: (state, action: PayloadAction<string>) => {
            state.push({
                id: action.payload,
                name: "Neu",
            });
        },
        deleteCategory: (state, action: PayloadAction<string>) => {
            const index = state.findIndex(x => x.id === action.payload);
            if (index !== -1) {
                state.splice(index, 1);
            }
        },
        resetCategories: (state, action: PayloadAction<void>) => {
            state = initialState;
        },
        setCategories: (state, action: PayloadAction<CategoriesState[]>) => {
            state = action.payload;
        },
        setCategoryName: (state, action: PayloadAction<{ id: string, name: string }>) => {
            const category = state.find(x => x.id === action.payload.id);
            if (category) {
                category.name = action.payload.name;
            }
        },
    }
})

export const {
    addCategory,
    deleteCategory,
    resetCategories,
    setCategories,
    setCategoryName,
} = categoriesSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default categoriesSlice.reducer

export function selectCategory(id: string): (state: RootState) => CategoriesState | undefined {
    return (state: RootState) => {
        const item = state.categories.find(x => x.id === id);
        return item;
    };
}
