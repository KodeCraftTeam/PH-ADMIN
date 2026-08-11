"use client";

import { createContext, useContext, useReducer, type Dispatch } from "react";
import {
  BALANCE_MOCK,
  CORRECTIONS,
  INITIAL_STRUCTURE,
  UNITS_MOCK,
  newStructureRow,
} from "./mocks";
import type { WizardAction, WizardState } from "./types";

export const TOTAL_STEPS = 6;

const initialState: WizardState = {
  step: 1,
  completedSteps: [],
  property: {
    name: "",
    taxId: "",
    address: "",
    city: "",
    cityId: "",
    type: "",
    totalUnits: "",
    totalTowers: "",
    adminName: "",
    adminEmail: "",
  },
  structure: INITIAL_STRUCTURE,
  unitsUploaded: false,
  unitsConfirmed: false,
  units: [],
  validationFixed: false,
  balance: [],
  balanceLoaded: false,
  activated: false,
};

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "GO_TO_STEP":
      return { ...state, step: action.step };

    case "NEXT": {
      const step = Math.min(state.step + 1, TOTAL_STEPS);
      const completedSteps = state.completedSteps.includes(state.step)
        ? state.completedSteps
        : [...state.completedSteps, state.step];
      return { ...state, step, completedSteps };
    }

    case "BACK":
      return { ...state, step: Math.max(state.step - 1, 1) };

    case "SET_PROPERTY":
      return {
        ...state,
        property: { ...state.property, [action.field]: action.value },
      };

    case "ADD_STRUCTURE_ROW":
      return {
        ...state,
        structure: [...state.structure, newStructureRow(state.structure.length + 1)],
      };

    case "REMOVE_STRUCTURE_ROW":
      return {
        ...state,
        structure: state.structure.filter((f) => f.id !== action.id),
      };

    case "EDIT_STRUCTURE_ROW":
      return {
        ...state,
        structure: state.structure.map((f) => {
          if (f.id !== action.id) return f;
          const edited = { ...f, [action.field]: action.value };
          // floors × unitsPerFloor recalculates the total automatically
          if (action.field === "floors" || action.field === "unitsPerFloor") {
            edited.totalUnits = edited.floors * edited.unitsPerFloor;
          }
          return edited;
        }),
      };

    case "UPLOAD_UNITS_FILE":
      return { ...state, unitsUploaded: true, units: UNITS_MOCK };

    case "REMOVE_UNITS_FILE":
      return {
        ...state,
        unitsUploaded: false,
        unitsConfirmed: false,
        units: [],
        validationFixed: false,
      };

    case "CONFIRM_IMPORT":
      return { ...state, unitsConfirmed: true };

    case "FIX_ERRORS":
      return {
        ...state,
        validationFixed: true,
        units: state.units.map((u) =>
          CORRECTIONS[u.id] ? { ...u, ...CORRECTIONS[u.id] } : u
        ),
      };

    case "LOAD_BALANCE":
      return { ...state, balanceLoaded: true, balance: BALANCE_MOCK };

    case "EDIT_BALANCE_ROW":
      return {
        ...state,
        balance: state.balance.map((c) =>
          c.id === action.id ? { ...c, [action.field]: action.value } : c
        ),
      };

    case "ACTIVATE_PROPERTY":
      return { ...state, activated: true };

    default:
      return state;
  }
}

const WizardStateContext = createContext<WizardState | null>(null);
const WizardDispatchContext = createContext<Dispatch<WizardAction> | null>(null);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <WizardStateContext.Provider value={state}>
      <WizardDispatchContext.Provider value={dispatch}>
        {children}
      </WizardDispatchContext.Provider>
    </WizardStateContext.Provider>
  );
}

export function useWizardState(): WizardState {
  const ctx = useContext(WizardStateContext);
  if (!ctx) throw new Error("useWizardState must be used within WizardProvider");
  return ctx;
}

export function useWizardDispatch(): Dispatch<WizardAction> {
  const ctx = useContext(WizardDispatchContext);
  if (!ctx) throw new Error("useWizardDispatch must be used within WizardProvider");
  return ctx;
}
