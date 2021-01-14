## About

State-based validation hook. Unlike other component/form based validations, `react-joi` allows you to use native HTML elements & requires no `<form /> ` element to do your `submit` validation.

The core validator uses [Joi](https://joi.dev/) as in it's name.

## Installation

```
yarn add react-joi

// or

npm -i react-joi
```



## Usage

```jsx
function App() {
    const { state, setData, validate } = useValidator({
        initialData: {
            name: null,
            email: null,
        },
        schema: Schema.object({
            name: Schema.string().required(),
            email: Schema.string()
                .email({
                    tlds: { allow: false },
                })
                .required(),
        }),
    })

    const updateName = (e) => {
        setData((old) => ({
            ...old,
            name: e.target.value,
        }))
    }

    const updateEmail = (e) => {
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

