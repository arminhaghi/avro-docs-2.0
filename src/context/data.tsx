import React, { createContext, useContext, useMemo, useEffect, useReducer } from "react";
import AllSchemaSummary from "../all-schemas-summary.json";
import { NamedType } from "../models/AvroSchema";
import NamespaceTree from "../namespace-tree.json";
import { MapHelper } from "../utils/MapHelper";

interface ContextState {
    namespaceTree: Map<string, string[]>;
    schemas: NamedType[];
    failure: string;
}

export enum DataActions {
    SetData,
}

interface Action {
    type: DataActions;
    payload: ContextState;
}


const initialState = {
    namespaceTree: new Map(),
    schemas: [],
    failure: "",
};

function reducer(state: ContextState, action: Action): ContextState {
    switch (action.type) {
    case DataActions.SetData: {
        const data = action.payload as ContextState;
        return {
            ...state,
            ...data,
        };
    }
    default:
        throw new Error("Unknown Action!");
    }
}

const DataContext = createContext<[ContextState, React.Dispatch<Action>]>(
    [initialState, (): undefined => undefined],
);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const DataProvider = (props: any): JSX.Element => {
    const [appData, dispatch] = useReducer(reducer, initialState);
    const value = useMemo(() => [appData, dispatch], [appData, dispatch]);

    const readSchemas = async () => {
        try {
            dispatch({
                type: DataActions.SetData, payload: {
                    namespaceTree: MapHelper.jsonToMap(NamespaceTree) as Map<string, string[]>,
                    schemas: AllSchemaSummary,
                    failure: "",
                },
            });
        } catch (error) {
            console.log(error);
            dispatch({
                type: DataActions.SetData, payload: {
                    namespaceTree: new Map(),
                    schemas: [],
                    failure: "Failed loading schema tree!",
                },
            });
        }
    };

    useEffect((): any => {
        readSchemas();
    }, []);

    return (
        <DataContext.Provider value={value} {...props}>
            {props.children}
        </DataContext.Provider>
    );
};

export function useDataContext(): [ContextState, React.Dispatch<Action>] {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error("DataContext must be used within a DataProvider");
    }
    return context;
}
