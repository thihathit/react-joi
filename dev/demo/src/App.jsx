import React from "react"

import Demo1 from "@/components/Demo1"
import Demo2 from "@/components/Demo2"

const App = () => {
    return (
        <main
            style={{
                maxWidth: 1000,
                padding: 30,
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridGap: 30,
            }}
        >
            <article>
                <h2>Demo 1</h2>
                <Demo1 />
            </article>

            <article>
                <h2>Demo 2</h2>
                <Demo2 />
            </article>
        </main>
    )
}

export default App
