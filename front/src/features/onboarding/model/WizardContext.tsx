"use client";

import { createContext, useContext, useReducer, type Dispatch } from "react";
import type { WizardAction, WizardState } from "./types";

export const TOTAL_STEPS = 6;

const initialState: WizardState = {
  step: 1,
  completedSteps: [],
  propertyId: null,
  property: {
    name: "",
    taxId: "",
    address: "",
    city: "",
    cityId: "",
    type: "",
    totalUnits: "",
    adminName: "",
    adminEmail: "",
  },
  importFile: null,
  importPreview: null,
  importCommitted: false,
  coefficientsFile: null,
  coefficientsPreview: null,
  coefficientsCommitted: false,
  balanceFile: null,
  balancePreview: null,
  balanceCommitted: false,
  status: null,
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

    case "SET_PROPERTY_ID":
      return { ...state, propertyId: action.id };

    case "SET_IMPORT_FILE":
      return { ...state, importFile: action.file, importPreview: null };

    case "SET_IMPORT_PREVIEW":
      return { ...state, importPreview: action.result };

    case "REMOVE_IMPORT_FILE":
      return {
        ...state,
        importFile: null,
        importPreview: null,
        importCommitted: false,
      };

    case "SET_IMPORT_COMMITTED":
      return { ...state, importPreview: action.result, importCommitted: true };

    case "SET_COEFFICIENTS_FILE":
      return { ...state, coefficientsFile: action.file, coefficientsPreview: null };

    case "SET_COEFFICIENTS_PREVIEW":
      return { ...state, coefficientsPreview: action.result };

    case "REMOVE_COEFFICIENTS_FILE":
      return {
        ...state,
        coefficientsFile: null,
        coefficientsPreview: null,
        coefficientsCommitted: false,
      };

    case "SET_COEFFICIENTS_COMMITTED":
      return {
        ...state,
        coefficientsPreview: action.result,
        coefficientsCommitted: true,
      };

    case "SET_BALANCE_FILE":
      return { ...state, balanceFile: action.file, balancePreview: null };

    case "SET_BALANCE_PREVIEW":
      return { ...state, balancePreview: action.result };

    case "REMOVE_BALANCE_FILE":
      return {
        ...state,
        balanceFile: null,
        balancePreview: null,
        balanceCommitted: false,
      };

    case "SET_BALANCE_COMMITTED":
      return { ...state, balancePreview: action.result, balanceCommitted: true };

    case "SET_STATUS":
      return { ...state, status: action.status };

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
