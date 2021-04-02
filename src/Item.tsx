import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Enum from "./components/Enum";
import Record from "./components/Record";
import errorImage from "./error.png";
import loading from "./loading.png";
import { NamedType, Type } from "./models/AvroSchema";
import { AvroTypeHelper } from "./utils/AvroTypeHelper";
import { CustomAvroParser } from "./utils/CustomAvroParser";

const Item = (): JSX.Element => {
    const { item } = useParams<{ item: string }>();
    const [schema, setSchema] = useState<{
        base: NamedType,
        current: NamedType,
    }>();
    const externalTypes: Map<string, Type> = new Map();
    const [error, setError] = useState<boolean>(false);

    const queryString = new URLSearchParams(useLocation().search);
    const source = queryString.get("source") || undefined;

    const filePath = `${(source ? source : item).replaceAll(".", "/")}.avsc`;

    const fetchSchema = async () => {
        try {
            const schemaContent = await fetch(
                `${process.env.PUBLIC_URL}/avro/${filePath}`,
                {
                    headers : {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                },
            );

            const fetchedSchema = CustomAvroParser.getNamedTypes(await schemaContent.text());

            if (source) {
                // @ts-ignore
                CustomAvroParser.extractExternalTypes(fetchedSchema, externalTypes, fetchedSchema.namespace);
                setSchema({
                    base: fetchedSchema,
                    // @ts-ignore
                    current: externalTypes.get(item),
                });
            } else {
                setSchema({
                    base: fetchedSchema,
                    current: fetchedSchema,
                });
            }
        } catch (error) {
            console.error(error);
            setError(true);
        }
    };

    useEffect((): void => {
        fetchSchema();
    }, [item]);

    if (schema && schema.current && schema.current.name) {
        if (AvroTypeHelper.isEnumType(schema.current)) {
            return <Enum schema={schema.current} />;
        } else {
            return <Record schema={schema} sourceItemName={source} />;
        }
    }

    if (error) {
        return (
            <div>
                <img src={errorImage} alt="Error Loading" />
                <p style={{ fontWeight: 900 }}>Schema not found!</p>
            </div>
        );
    }

    return <img src={loading} className="App-logo" alt="loading..." />;
};

export default Item;
