import * as AVRO from "avsc";
import React, { Fragment } from "react";
import DataType from "../components/DataType";
import { TagColorPicker } from "./TagColorPicker";
import { ComplexType, TypeHelper } from "./TypeHelper";

export class TagHelper {

    public static render(schema: ComplexType): JSX.Element {
        const branchName = schema.branchName || "";
        const key = Math.random();

        if (branchName === "array") {
            const tagData = TypeHelper.formatTag(branchName, (schema as AVRO.types.ArrayType).itemsType.branchName || "");
            tagData.text = `ARRAY<${tagData.text}>`;
            return (
                <DataType
                    color={TagColorPicker.pick(branchName)}
                    key={key.toString()}
                    data={tagData}
                />
            );
        } else if (AVRO.Type.isType(schema, "record")) {
            const tagData = TypeHelper.formatTag("record", branchName);

            return (
                <DataType
                    color={TagColorPicker.pick("record")}
                    key={key.toString()}
                    data={tagData}
                />
            );
        } else if (AVRO.Type.isType(schema, "enum")) {
            const tagData = TypeHelper.formatTag("enum", branchName, schema.doc);

            return (
                <DataType
                    color={TagColorPicker.pick("enum")}
                    key={key.toString()}
                    data={tagData}
                />
            );
        } else if (AVRO.Type.isType(schema, "union")) {
            const unionType = schema as AVRO.types.UnwrappedUnionType;
            const branchName1 = unionType.types[0].branchName || "";
            const branchName2 = unionType.types[1].branchName || "";

            return (
                <Fragment key={key.toString()}>
                    <DataType
                        color={TagColorPicker.pick(branchName1)}
                        data={TypeHelper.formatTag(branchName1, branchName1)}
                    />
                    OR&nbsp;&nbsp;
                    <DataType
                        color={TagColorPicker.pick(branchName2)}
                        data={ TypeHelper.formatTag(branchName2, branchName2)}
                    />
                </Fragment>
            );
        }

        const tagData = TypeHelper.formatTag(branchName, branchName);

        return (
            <DataType
                color={TagColorPicker.pick(branchName)}
                key={key.toString()}
                data={tagData}
            />
        );
    }


}
