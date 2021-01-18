## About

State-based validation hook. Unlike other component/form based validations, `react-joi` allows you to use native HTML elements & requires no `<form />` element to do your `submit` validation. In short, we don't mess with your DOM.

The core validator uses [Joi](https://joi.dev/) as in it's name.

## Installation

install package via [npm](https://www.npmjs.com/package/react-joi).

install [joi](https://joi.dev/).

```
yarn add react-joi

// or

npm -i react-joi
```



## Usage

```jsx
import Joi from "joi"
import { useValidator } from "react-joi"

function App() {
    const { state, setData, validate } = useValidator({
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
    })

    const updateName = (e) => {
		// react < v17
        e.persist();
        
        setData((old) => ({
            ...old,
            name: e.target.value,
        }))
    }

    const updateEmail = (e) => {
		// react < v17
        e.persist();
        
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
                <input type="text" onChange={updateName} />
                <br />
                {state.$errors.name.map((data) => data.$message).join(",")}

                <br />
                <br />

                <label>Email</label>
                <br />
                <input type="text" onChange={updateEmail} />
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



## State Documentation

| name                  | description                                                  |
| --------------------- | ------------------------------------------------------------ |
| `$data`               | Values of the instance                                       |
| `$dirty`              | Dirty state of the instance                                  |
| `$data_state`         | State of the values: `$dirty` means if the initial data is touched or not |
| `$source_errors`      | Raw errors of the instance. This re-validates every time `$data` is changed regardless of `$dirty` is `true` or `false` |
| `$errors`             | `Recommended` way of retrieving errors of each fields. Each fields respects global `$dirty` state of the instance and `$data_state`'s `$dirty` states. |
| `$all_errors`         | List of all errors respecting `$dirty` states of their own and global state. |
| `$all_source_errors`  | List of all errors not respecting `$dirty` states of their own and global state. |
| `$invalid`            | Validity of the instance respecting global `$dirty`.         |
| `$auto_invalid`       | Validity of the instance not respecting global `$dirty`. `Recommended` use case for disabled submit button |
| `$validation_success` | Positive validity of the instance respecting global `$dirty`. |