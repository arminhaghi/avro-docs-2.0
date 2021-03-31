import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Enum from "./components/Enum";
import Record from "./components/Record";
import { NamedType } from "./models/AvroSchema";
import { AvroTypeHelper } from "./utils/AvroTypeHelper";
import { CustomAvroParser } from "./utils/CustomAvroParser";

const Item = (): JSX.Element => {
    const { item } = useParams<{ item: string }>();
    const [schema, setSchema] = useState<NamedType>();

    const fetchSchema = async () => {
        try {
            const schemaContent = await fetch(
                `${process.env.PUBLIC_URL}/avro/${item.replaceAll(".", "/")}.avsc`,
                {
                    headers : {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                },
            );

            setSchema(CustomAvroParser.getNamedTypes(await schemaContent.text()));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect((): any => {
        fetchSchema();
    }, [item]);


    if (schema && schema.name) {
        if (AvroTypeHelper.isEnumType(schema)) {
            return <Enum schema={schema} />;
        } else {
            return <Record schema={schema} />;
        }
    }

    return <></>;
};

export default Item;
