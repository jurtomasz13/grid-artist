import { useContext } from "react";
import { GridContext } from "../context/GridContext";

export const useGrid = () => {
  return useContext(GridContext);
};
