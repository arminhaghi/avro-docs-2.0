import React, { Fragment } from "react";
import DataType from "../components/DataType";
import { ArrayType, ComplexType, ComplexTypes, LogicalType, MapType, NullType, PrimitiveTypes, Type } from "../models/AvroSchema";
import { RowData } from "../models/TableColumns";
import { TagColorPicker } from "./TagColorPicker";
import { TypeHelper } from "./TypeHelper";

export class TagHelper {

    public static render(type: Type, record: RowData): JSX.Element {
        const key = Math.random();

        switch (type) {
        case NullType:
        case PrimitiveTypes.BOOLEAN:
        case PrimitiveTypes.BYTES:
        case PrimitiveTypes.DOUBLE:
        case PrimitiveTypes.FLOAT:
        case PrimitiveTypes.INT:
        case PrimitiveTypes.LONG:
        case PrimitiveTypes.STRING:
            return (
                <DataType
                    color={TagColorPicker.pick(type)}
                    key={key.toString()}
                    data={TypeHelper.formatTag(type, record)}
                />
            );

        case ComplexTypes.RECORD:
        case ComplexTypes.ENUM:
        case ComplexTypes.FIXED:
            return (
                <DataType
                    color={TagColorPicker.pick((type as unknown as ComplexType).type)}
                    key={key.toString()}
                    data={TypeHelper.formatTag(type, record)}
                />
            );
        }

        const complexType = type as ComplexType;

        if (!complexType) {
            return <></>;
        }

        if (complexType.type === ComplexTypes.RECORD || complexType.type === ComplexTypes.ENUM || complexType.type === ComplexTypes.FIXED) {
            return (
                <DataType
                    color={TagColorPicker.pick(complexType.type)}
                    key={key.toString()}
                    data={TypeHelper.formatTag(type, record)}
                />
            );
        } else if (complexType.type === ComplexTypes.ARRAY) {
            const tagData = TypeHelper.formatTag((complexType as ArrayType).items, record);
            tagData.text = `ARRAY<${tagData.text}>`;
            return (
                <DataType
                    color={TagColorPicker.pick((complexType as ArrayType).type)}
                    key={key.toString()}
                    data={tagData}
                />
            );
        } else if (complexType instanceof Array) { // This is UNION
            const type1 = complexType[0];
            const type2 = complexType[1];

            return (
                <Fragment key={key.toString()}>
                    {
                        TagHelper.render(type1, record)
                    }
                    OR&nbsp;&nbsp;
                    {
                        TagHelper.render(type2, record)
                    }
                </Fragment>
            );
        } else if (complexType.type === ComplexTypes.MAP) {
            const tagData = TypeHelper.formatTag((complexType as MapType).values, record);
            tagData.text = `MAP<${tagData.text}>`;
            return (
                <DataType
                    color={TagColorPicker.pick((complexType as MapType).type)}
                    key={key.toString()}
                    data={tagData}
                />
            );
        } else if ((complexType as unknown as LogicalType).logicalType && (complexType as unknown as LogicalType).logicalType.length) {
            return (
                <DataType
                    color={TagColorPicker.pick(complexType.type)}
                    key={key.toString()}
                    data={TypeHelper.formatTag(type, record)}
                />
            );
        }

        return (
            <DataType
                color={TagColorPicker.pick(complexType.type)}
                key={key.toString()}
                data={TypeHelper.formatTag(type, record)}
            />
        );
    }
}
