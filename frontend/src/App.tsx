import { useState } from "react"
import Home from "./pages/Home"
import ComposeEmail from "./pages/ComposeEmail"

function App() {
  const [page, setPage] = useState("home")

  if (page === "compose") {
    return <ComposeEmail onCancel={() => setPage("home")} />
  }

  return <Home onCompose={() => setPage("compose")} />
}

export default App
