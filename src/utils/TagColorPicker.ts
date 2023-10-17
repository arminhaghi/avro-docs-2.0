import { NullType, PrimitiveTypes, ComplexTypes, Type, ComplexType } from "../models/AvroSchema";


export class TagColorPicker {

    public static pick(type: Type): string {
        try {
            if (!type) {
                return "grey";
            }

            switch (type) {
            case NullType:
                return "red";
            case PrimitiveTypes.BOOLEAN:
            case PrimitiveTypes.BYTES:
            case PrimitiveTypes.DOUBLE:
            case PrimitiveTypes.FLOAT:
            case PrimitiveTypes.INT:
            case PrimitiveTypes.LONG:
            case PrimitiveTypes.STRING:
                return "blue";
            case ComplexTypes.UNION:
                return "orange";
            case ComplexTypes.RECORD:
                return "geekblue";
            case ComplexTypes.ENUM:
                return "purple";
            case ComplexTypes.ARRAY:
                return "green";
            case ComplexTypes.MAP:
                return "volcano";
            case ComplexTypes.FIXED:
                return "magenta";
            }


            const complexType = type as ComplexType;

            if (!complexType.type) {
                return "grey";
            }

            switch (complexType.type) {
            case ComplexTypes.UNION:
                return "orange";
            case ComplexTypes.RECORD:
                return "geekblue";
            case ComplexTypes.ENUM:
                return "purple";
            case ComplexTypes.ARRAY:
                return "green";
            }
        } catch (error) {
            console.error(type, error);
        }

        return "grey";
    }
}
