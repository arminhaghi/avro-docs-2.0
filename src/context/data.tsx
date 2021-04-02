import React, { createContext, useContext, useMemo, useEffect, useReducer } from "react";
import AvroFileList from "../avro-file-list.json";
import { NamedType } from "../models/AvroSchema";
import { CustomAvroParser } from "../utils/CustomAvroParser";

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
            const namespaceTree = new Map<string, string[]>();
            const schemaArray: NamedType[] = [];

            for (let i = 0; i < AvroFileList.length; i++) {
                const schemaContent = await fetch(
                    `${process.env.PUBLIC_URL}${AvroFileList[i]}`,
                    {
                        headers : {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                        },
                    },
                );
                const namedType = CustomAvroParser.getNamedTypes(await schemaContent.text());
                schemaArray.push({
                    name: namedType.name,
                    namespace: namedType.namespace,
                    type: namedType.type,
                    doc: namedType.doc,
                    aliases: [],
                });

                const children = namespaceTree.get(namedType.namespace) || [];
                children.push(namedType.name);
                namespaceTree.set(namedType.namespace, children);
            }

            dispatch({
                type: DataActions.SetData, payload: {
                    namespaceTree: namespaceTree,
                    schemas: schemaArray,
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
