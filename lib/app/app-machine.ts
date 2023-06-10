import { createMachine } from "xstate";

type AppContext = {
  placeholder: boolean;
};

type AppEvents = { type: "LOADED" };

export const appMachine = createMachine<AppContext, AppEvents>({
  /** @xstate-layout N4IgpgJg5mDOIC5QEMAOqB0AbA9siAlgHZQDEAMgPICCAIgKK0DaADALqKio6wEAuBHEU4gAHogCMAFgCcGAKwBmGSwBsAJnkAaEAE9EADgkKAvmZ1EcEOCLSoR3XgKEjxCALSqd+j6vMg7bDxCEgcefkFhJDFEKXVvQ3V-QIAnMHwfLnDnKNA3dQB2RQxFeRlFAu09RLMzIA */
  id: "app",
  initial: "loading",
  context: {
    placeholder: true,
  },
  states: {
    loading: {
      on: { LOADED: "ready" },
    },
    ready: {},
  },
});
