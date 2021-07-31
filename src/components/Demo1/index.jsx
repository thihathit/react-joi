import React from "react"
import Joi from "joi"

import useValidator from "react-joi"

export const Demo1 = () => {
    const { state, setData, setExplicitField, validate } = useValidator({
        initialData: {
            name: null,
            email: null,
        },
        schema: Joi.object({
            name: Joi.string().required(),
            email: Joi.string()
                .email({
                    tlds: { allow: false },
                })
                .required(),
        }),
        explicitCheck: {
            name: false,
            email: false,
        },
    })

    const updateName = (e) => {
        // react < v17
        e.persist()

        setData((old) => ({
            ...old,
            name: e.target.value,
        }))
    }

    const updateEmail = (e) => {
        // react < v17
        e.persist()

        setData((old) => ({
            ...old,
            email: e.target.value,
        }))
    }

    return (
        <section>
            <div>
                <label>Name</label>
                <br />
                <input
                    type="text"
                    onChange={updateName}
                    onBlur={() => setExplicitField("name", true)}
                />
                <br />
                {state.$errors.name.map((data) => data.$message).join(",")}

                <br />
                <br />

                <label>Email</label>
                <br />
                <input
                    type="text"
                    onChange={updateEmail}
                    onBlur={() => setExplicitField("email", true)}
                />
                <br />
                {state.$errors.email.map((data) => data.$message).join(",")}

                <br />
                <br />
                <br />

                <button onClick={validate}>Submit</button>
            </div>

            <br />
            <hr />
            <br />

            <code>
                <pre>{JSON.stringify(state, null, 2)}</pre>
            </code>
        </section>
    )
}

export default Demo1
