import * as AVRO from "avsc";
import React, { createContext, useContext, useMemo, useEffect, useReducer } from "react";
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
        // @ts-ignore
        const schema1 = await import("../avro/user.json");
        const schema2 = await import("../avro/persons.json");
        const schema3 = await import("../avro/BalanceAdjustment.json");
        const schema4 = await import("../avro/ComplexRecord.json");
        const schema5 = await import("../avro/CommUpdateType.json");

        const parsed1 = AVRO.parse(JSON.stringify(schema1));
        const parsed2 = AVRO.parse(JSON.stringify(schema2));
        const parsed3 = AVRO.parse(JSON.stringify(schema3));
        const parsed4 = AVRO.parse(JSON.stringify(schema4));
        const parsed5 = AVRO.parse(JSON.stringify(schema5));

        const records = new Map<string, AVRO.Schema>();
        AvroParser.GetAllRecords(parsed1, records);
        AvroParser.GetAllRecords(parsed1, records);
        AvroParser.GetAllRecords(parsed1, records);
        AvroParser.GetAllRecords(parsed2, records);
        AvroParser.GetAllRecords(parsed3, records);
        AvroParser.GetAllRecords(parsed4, records);
        AvroParser.GetAllRecords(parsed5, records);

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

        dispatch({ type: DataActions.SetData, payload: {
            namespaceTree: namespaceTree,
            namespaces: namespaces,
            schemas: schemas,
        } });
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
