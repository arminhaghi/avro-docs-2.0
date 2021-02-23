import * as AVRO from "avsc";
import React, { createContext, useContext, useMemo, useEffect, useReducer } from "react";
import AvroFileList from "../avro-file-list.json";
import { AvroParser } from "../utils/AvroParser";

interface ContextState {
    namespaces: string[];
    namespaceTree: Map<string, string[]>;
    schemas: Map<string, AVRO.Schema>;
}

export enum DataActions {
    SetData,
}

interface Action {
    type: DataActions;
    payload: ContextState;
}


const initialState = {
    namespaces: [],
    namespaceTree: new Map(),
    schemas: new Map(),
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

export const DataProvider = (props: any): JSX.Element => {
    const [appData, dispatch] = useReducer(reducer, initialState);
    const value = useMemo(() => [appData, dispatch], [appData, dispatch]);

    const readSchemas = async () => {
        const records = new Map<string, AVRO.Schema>();

        for (let i = 0; i < AvroFileList.length; i++) {
            const schema = await fetch(
                process.env.PUBLIC_URL + AvroFileList[i],
                {
                    headers : {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                }
            );

            const parsed = AVRO.parse(JSON.stringify(await schema.json()));
            AvroParser.GetAllRecords(parsed, records);
        }

        const namespaces = Array.from(records.keys());
        const namespaceTree = new Map<string, string[]>();
        const schemas = new Map<string, AVRO.Schema>();

        namespaces.forEach(namespace => {
            const parent = namespace.substring(0, namespace.lastIndexOf(".")) || "UNKNOWN";
            const child = namespace.substring(namespace.lastIndexOf(".") + 1);
            const children = namespaceTree.get(parent) || [];
            children.push(child);
            namespaceTree.set(parent, children);

            schemas.set(namespace.toLowerCase(), records.get(namespace) || "");
        });

        dispatch({
            type: DataActions.SetData, payload: {
                namespaceTree: namespaceTree,
                namespaces: namespaces,
                schemas: schemas,
            },
        });
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
