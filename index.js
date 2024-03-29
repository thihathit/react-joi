import Joi from "joi"

import { useEffect, useMemo, useState } from "react"

const initialMeta = { $dirty: false, $validated: false }

export const useValidator = ({
    initialData,
    schema,
    explicitCheck = {},
    validationOptions = {},
}) => {
    const [$data, set$data] = useState({ ...initialData })
    const [$meta, set$meta] = useState({ ...initialMeta })
    const [$explict_fields, set$explict_fields] = useState({ ...explicitCheck })

    const set$explict_field = (field, value) => {
        set$explict_fields((old) => ({ ...old, [field]: value }))
    }

    const { $dirty, $validated } = $meta

    const $data_state = useMemo(() => {
        const states = {}

        for (const field in $data) {
            let fieldState = {}

            // Dirty state check
            // Only global $dirty when explicitly suppressed
            if (field in $explict_fields && !$explict_fields[field]) {
                fieldState["$dirty"] = $dirty
            }
            // Dirty state check
            // both global $dirty & value change
            else {
                const originalValue = initialData[field]
                const currentValue = $data[field]

                const isMatch = Joi.any()
                    .valid(originalValue)
                    .validate(currentValue).error
                    ? false
                    : true

                fieldState["$dirty"] = $dirty || !isMatch
            }

            states[field] = fieldState
        }

        return states
    }, [$data, $dirty, $explict_fields, initialData, Joi])

    const $source_errors = useMemo(() => {
        const results = {}

        const fields = Array.from(schema._ids._byKey.keys())
        fields.map((field) => {
            const messages = []
            const errors = schema
                .extract(field)
                .validate($data[field], validationOptions).error

            if (errors?.details) {
                errors.details.map((err) => {
                    messages.push({
                        $property: field,
                        $message: err.message,
                    })
                })
            }

            results[field] = messages
        })

        return results
    }, [$data, schema])

    const $errors = useMemo(() => {
        const results = {}

        for (const field in $source_errors) {
            if ($data_state[field].$dirty) {
                results[field] = $source_errors[field]
            } else {
                results[field] = []
            }
        }

        return results
    }, [$source_errors, $data_state])

    const $all_errors = useMemo(() => {
        const errors = []

        for (const field in $errors) {
            $errors[field].map((error) => {
                errors.push(error)
            })
        }

        return errors
    }, [$errors])

    const $all_source_errors = useMemo(() => {
        const errors = []

        for (const field in $source_errors) {
            $source_errors[field].map((error) => {
                errors.push(error)
            })
        }

        return errors
    }, [$source_errors])

    const $invalid = useMemo(() => {
        return $dirty && $all_errors.length !== 0
    }, [$dirty, $all_errors])

    const $auto_invalid = useMemo(
        () => $all_source_errors.length !== 0,
        [$all_source_errors]
    )

    const $validation_success = useMemo(
        () => $dirty && !$invalid,
        [$dirty, $invalid]
    )

    const state = useMemo(
        () => ({
            $data,
            $dirty,
            $explict_fields,
            $data_state,
            $source_errors,
            $errors,
            $all_errors,
            $all_source_errors,
            $invalid,
            $auto_invalid,
            $validation_success,
            $validated,
        }),
        [
            $data,
            $dirty,
            $explict_fields,
            $data_state,
            $source_errors,
            $errors,
            $all_errors,
            $all_source_errors,
            $invalid,
            $auto_invalid,
            $validation_success,
            $validated,
        ]
    )

    const validate = () => {
        set$meta({
            $dirty: true,
            $validated: true,
        })
    }

    // Reset everything
    const reset = () => {
        set$meta((old) => ({
            ...old,
            ...initialMeta,
        }))
        set$data((old) => ({
            ...old,
            ...initialData,
        }))
        set$explict_fields((old) => ({
            ...old,
            ...explicitCheck,
        }))
    }

    // Resets validated state when data is updated
    useEffect(() => {
        set$meta((old) => ({
            ...old,
            $validated: false,
        }))
    }, [$data])

    return {
        state,
        setData: set$data,
        setExplicitField: set$explict_field,
        validate,
        reset,
    }
}

export default useValidator
