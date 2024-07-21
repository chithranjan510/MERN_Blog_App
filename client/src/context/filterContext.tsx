import { createContext, useState } from "react";

interface FilterContextInterface {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUserId: string | null;
  setSelectedUserId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedCategoryId: string | null;
  setSelectedCategoryId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const FilterContext = createContext<FilterContextInterface>({
  loading: false,
  setLoading: () => {},
  selectedUserId: null,
  setSelectedUserId: () => {},
  selectedCategoryId: null,
  setSelectedCategoryId: () => {},
});

const FilterContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  return (
    <FilterContext.Provider
      value={{
        loading,
        setLoading,
        selectedUserId,
        setSelectedUserId,
        selectedCategoryId,
        setSelectedCategoryId,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export default FilterContextProvider;
