import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FilterState {
    search: string;
    status: string;
    currentPage: number;
    limit: string;
    // Tambahan untuk berbagai unit/module
    unitName?: string; // untuk membedakan filter per halaman/module
}

interface FilterActions {
    // Actions untuk set individual state
    setSearch: (search: string, unitName?: string) => void;
    setStatus: (status: string, unitName?: string) => void;
    setCurrentPage: (page: number, unitName?: string) => void;
    setLimit: (limit: string, unitName?: string) => void;

    // Actions untuk get state berdasarkan unit
    getFilterByUnit: (unitName: string) => FilterState;

    // Action untuk reset filter
    resetFilter: (unitName?: string) => void;

    // Action untuk set multiple filters sekaligus
    setFilters: (filters: Partial<FilterState>, unitName?: string) => void;
}

// Default filter state
const defaultFilterState: FilterState = {
    search: "",
    status: "all",
    currentPage: 1,
    limit: "10",
};

interface FilterStore {
    // Store semua filter berdasarkan unit name
    filters: Record<string, FilterState>;
    actions: FilterActions;
}

export const useFilterStore = create<FilterStore>()(
    persist(
        (set, get) => ({
            filters: {},

            actions: {
                // Set search dengan unit name
                setSearch: (search: string, unitName = 'default') => {
                    set((state) => ({
                        filters: {
                            ...state.filters,
                            [unitName]: {
                                ...state.filters[unitName] || defaultFilterState,
                                search,
                                currentPage: 1, // Reset ke halaman 1 saat search
                            }
                        }
                    }));
                },

                // Set status dengan unit name
                setStatus: (status: string, unitName = 'default') => {
                    set((state) => ({
                        filters: {
                            ...state.filters,
                            [unitName]: {
                                ...state.filters[unitName] || defaultFilterState,
                                status,
                                currentPage: 1, // Reset ke halaman 1 saat ganti status
                            }
                        }
                    }));
                },

                // Set current page
                setCurrentPage: (currentPage: number, unitName = 'default') => {
                    set((state) => ({
                        filters: {
                            ...state.filters,
                            [unitName]: {
                                ...state.filters[unitName] || defaultFilterState,
                                currentPage,
                            }
                        }
                    }));
                },

                // Set limit
                setLimit: (limit: string, unitName = 'default') => {
                    set((state) => ({
                        filters: {
                            ...state.filters,
                            [unitName]: {
                                ...state.filters[unitName] || defaultFilterState,
                                limit,
                                currentPage: 1, // Reset ke halaman 1 saat ganti limit
                            }
                        }
                    }));
                },

                // Get filter berdasarkan unit name
                getFilterByUnit: (unitName: string) => {
                    const { filters } = get();
                    return filters[unitName] || defaultFilterState;
                },

                // Reset filter untuk unit tertentu
                resetFilter: (unitName = 'default') => {
                    set((state) => ({
                        filters: {
                            ...state.filters,
                            [unitName]: { ...defaultFilterState }
                        }
                    }));
                },

                // Set multiple filters sekaligus
                setFilters: (newFilters: Partial<FilterState>, unitName = 'default') => {
                    set((state) => ({
                        filters: {
                            ...state.filters,
                            [unitName]: {
                                ...state.filters[unitName] || defaultFilterState,
                                ...newFilters,
                            }
                        }
                    }));
                },
            },
        }),
        {
            name: 'filter-storage', // localStorage key
            partialize: (state) => ({ filters: state.filters }), // Hanya simpan filters di localStorage
        }
    )
);

// Custom hook untuk memudahkan penggunaan
export const useFilter = (unitName: string) => {
    const filters = useFilterStore((state) => state.filters[unitName] || defaultFilterState);
    const actions = useFilterStore((state) => state.actions);

    return {
        // Filter states
        search: filters.search,
        status: filters.status,
        currentPage: filters.currentPage,
        limit: filters.limit,

        // Actions dengan unit name sudah terikat
        setSearch: (search: string) => actions.setSearch(search, unitName),
        setStatus: (status: string) => actions.setStatus(status, unitName),
        setCurrentPage: (page: number) => actions.setCurrentPage(page, unitName),
        setLimit: (limit: string) => actions.setLimit(limit, unitName),
        resetFilter: () => actions.resetFilter(unitName),
        setFilters: (newFilters: Partial<FilterState>) => actions.setFilters(newFilters, unitName),

        // Get all filters untuk API call
        getAllFilters: () => filters,
    };
};