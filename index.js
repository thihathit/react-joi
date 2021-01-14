import Joi from "joi"

import { useMemo, useState } from "react"

export const Schema = Joi

export const useValidator = ({ initialData, schema, joi = Schema }) => {
    const [$data, set$data] = useState(() => Object.assign({}, initialData))

    const [$dirty, set$dirty] = useState(false)

    const $data_state = useMemo(() => {
        const states = {}

        for (const field in $data) {
            const originalValue = initialData[field]
            const currentValue = $data[field]

            const isMatch = joi
                .any()
                .valid(originalValue)
                .validate(currentValue).error
                ? false
                : true

            let fieldState = {}

            // Dirty state
            fieldState["$dirty"] = $dirty || !isMatch

            states[field] = fieldState
        }

        return states
    }, [$data, $dirty, initialData, joi])

    const $source_errors = useMemo(() => {
        const results = {}

        const fields = Array.from(schema._ids._byKey.keys())
        fields.map((field) => {
            const messages = []
            const error = schema.extract(field).validate($data[field]).error

            if (error) {
                messages.push({
                    $property: field,
                    $message: error.message,
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

    const $auto_invalid = useMemo(() => $all_source_errors.length !== 0, [
        $all_source_errors,
    ])

    const $validation_success = useMemo(() => $dirty && !$invalid, [
        $dirty,
        $invalid,
    ])

    const state = useMemo(
        () => ({
            $data,
            $dirty,
            $data_state,
            $source_errors,
            $errors,
            $all_errors,
            $all_source_errors,
            $invalid,
            $auto_invalid,
            $validation_success,
        }),
        [
            $data,
            $dirty,
            $data_state,
            $source_errors,
            $errors,
            $all_errors,
            $all_source_errors,
            $invalid,
            $auto_invalid,
            $validation_success,
        ]
    )

    const validate = () => {
        set$dirty(true)
    }

    return {
        state,
        setData: set$data,
        validate,
    }
}

export default useValidator
