import {
    ValidationOptions,
    ObjectSchema,
    NullableType,
    ValidationErrorItem,
} from "joi"

type Type$ExplictFields<FieldTypes> = Partial<{
    [key in keyof FieldTypes]: boolean
}>

type Type$DataState<FieldTypes> = {
    [key in keyof FieldTypes]: {
        $dirty: boolean
    }
}

type Type$Errors<FieldTypes> = {
    [key in keyof FieldTypes]: {
        $property: keyof FieldTypes
        $message: ValidationErrorItem["message"]
    }[]
}

export type TypeUseValidatorConfig<FieldTypes> = {
    initialData: NullableType<FieldTypes>
    schema: ObjectSchema<FieldTypes>
    explicitCheck?: Type$ExplictFields<FieldTypes>
    validationOptions?: Pick<ValidationOptions, "abortEarly">
}

export type TypeUseValidatorState<FieldTypes> = {
    $data: NullableType<FieldTypes>
    $dirty: boolean
    $explict_fields: Type$ExplictFields<FieldTypes>
    $data_state: Type$DataState<FieldTypes>
    $source_errors: Type$Errors<FieldTypes>
    $errors: Type$Errors<FieldTypes>
    $all_source_errors: Type$Errors<FieldTypes>
    $all_errors: Type$Errors<FieldTypes>
    $invalid: boolean
    $auto_invalid: boolean
    $validation_success: boolean
}

export interface TypeUseValidator<FieldTypes> {
    state: TypeUseValidatorState<FieldTypes>
}

export const useValidator: <T>(
    options: TypeUseValidatorConfig<T>
) => TypeUseValidator<T>

export default useValidator
