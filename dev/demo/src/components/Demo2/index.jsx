import React, { useEffect } from "react"
import useModels from "react-use-models"
import Joi from "joi"

import useValidator from "react-joi"

export const Demo2 = () => {
    const { models, register } = useModels({
        defaultState: {
            name: "My Name",
            email: "",
        },
    })

    const { state, setData, validate } = useValidator({
        initialData: models,
        schema: Joi.object({
            name: Joi.string().required(),
            email: Joi.string()
                .email({
                    tlds: { allow: false },
                })
                .required(),
        }),
    })

    // Sync model <-> validator
    useEffect(() => {
        setData(models)
    }, [models])

    return (
        <section>
            <label>Name</label>
            <br />
            <input {...register.input({ name: "name" })} />
            <br />
            {state.$errors.name.map((data) => data.$message).join(",")}

            <br />
            <br />

            <label>Email</label>
            <br />
            <input {...register.input({ name: "email" })} />
            <br />
            {state.$errors.email.map((data) => data.$message).join(",")}

            <br />

            <button onClick={validate}>Submit</button>

            <code>
                <h2>Models</h2>
                <pre>{JSON.stringify(models, null, 2)}</pre>
            </code>

            <hr />

            <code>
                <h2>Validation</h2>
                <pre>{JSON.stringify(state, null, 2)}</pre>
            </code>
        </section>
    )
}

export default Demo2
