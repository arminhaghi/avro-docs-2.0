import * as AVRO from "avsc";
import React from "react";
import { useParams } from "react-router-dom";
import Enum from "./components/Enum";
import Record from "./components/Record";
import { useDataContext } from "./context/data";

const Item = (): JSX.Element => {
    const { item } = useParams<{ item: string }>();
    const [appData] = useDataContext();
    const schema = appData.schemas.get(item.toLowerCase()) as AVRO.Type;

    if (schema && schema.name) {
        const isEnum =  AVRO.Type.isType(schema, "enum");
        if (isEnum) {
            return <Enum schema={schema} />;
        } else {
            return <Record schema={schema} />;
        }
    }

    return <></>;
};

export default Item;
