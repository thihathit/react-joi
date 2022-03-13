## About

State-based validation hook. Unlike other component/form based validations, `react-joi` allows to use native HTML elements & require no `<form />` element to do your `submit` validation. In short, we don't mess with your DOM.

The core validator uses [Joi](https://joi.dev/) as in it's name.

## Installation

install package via [npm](https://www.npmjs.com/package/react-joi).

install [joi](https://joi.dev/).

```
yarn add react-joi

// or

npm i react-joi
```

## Usage

```jsx
import Joi from "joi"
import { useValidator } from "react-joi"

function App() {
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
        validationOptions: {
            abortEarly: true
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
        <div>
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
        </div>
    )
}
```

![](https://i.ibb.co/93wndgy/image.png)

Note that the **explicitCheck** object is **optional**, and is only needed if it is desired to suppress error messages during
input until the onBlur method has fired at least once. If this behavior is not required/desired, then omit it as shown
in the second example.

## State Documentation

| name                  | description                                                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `$data`               | Values of the instance                                                                                                                                 |
| `$dirty`              | Dirty state of the instance                                                                                                                            |
| `$explicitfields`     | Settings of any fields that have been explicitly set                                                                                                   |
| `$data_state`         | State of the values:`$dirty` means if the initial data is touched or not                                                                               |
| `$source_errors`      | Raw errors of the instance. This re-validates every time `$data` is changed regardless of `$dirty` is `true` or `false`                                |
| `$errors`             | `Recommended` way of retrieving errors of each fields. Each fields respects global `$dirty` state of the instance and `$data_state`'s `$dirty` states. |
| `$all_errors`         | List of all errors respecting `$dirty` states of their own and global state.                                                                           |
| `$all_source_errors`  | List of all errors not respecting `$dirty` states of their own and global state.                                                                       |
| `$invalid`            | Validity of the instance respecting global `$dirty`.                                                                                                   |
| `$auto_invalid`       | Validity of the instance not respecting global `$dirty`. `Recommended` use case for disabled submit button                                             |
| `$validation_success` | Positive validity of the instance respecting global `$dirty`.                                                                                          |

### Combo with [react-use-models](https://www.npmjs.com/package/react-use-models).

```jsx
import React, { useEffect } from "react"

import useModels from "react-use-models"
import Joi from "joi"
import useValidator from "react-joi"

export default function App() {
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
        <div>
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
        </div>
    )
}
```
