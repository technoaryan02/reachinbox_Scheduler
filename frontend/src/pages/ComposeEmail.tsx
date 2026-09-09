import { useState } from "react"

function ComposeEmail({ onCancel }: { onCancel: () => void }) {
  const [recipient, setRecipient] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [scheduledAt, setScheduledAt] = useState("")
  const [recipientCount, setRecipientCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleCsvUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    const reader = new FileReader()

    reader.onload = (event) => {
      const text = event.target?.result as string

      const rows = text
        .split("\n")
        .map((row) => row.trim())
        .filter((row) => row.length > 0)

      // First row is header
      const emails = rows
        .slice(1)
        .map((row) => row.split(",")[0].trim())
        .filter((email) => email.includes("@"))

      setRecipientCount(emails.length)

      // For now use first recipient for backend testing
      if (emails.length > 0) {
        setRecipient(emails[0])
      }
    }

    reader.readAsText(file)
  }

  const handleSchedule = async () => {
    if (!recipient || !subject || !body || !scheduledAt) {
      alert("Please fill all required fields")
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        "http://localhost:5000/api/emails/schedule",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipient,
            subject,
            body,
            scheduledAt,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to schedule email")
      }

      alert("Email scheduled successfully!")

      console.log("Scheduled:", data)

      onCancel()
    } catch (error) {
      console.error(error)

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white border-b border-gray-200 px-8 py-5">
        <h1 className="text-2xl font-semibold text-gray-900">
          Compose Email
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Create and schedule your email campaign
        </p>
      </header>

      <main className="max-w-4xl mx-auto p-8">

        <div className="bg-white border border-gray-200 rounded-xl p-6">

          <h2 className="text-lg font-semibold mb-6">
            Email Details
          </h2>

          {/* Recipient */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Email
            </label>

            <input
              type="email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="recipient@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>

          {/* Subject */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>

            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>

          {/* Body */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Body
            </label>

            <textarea
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your email..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none"
            />
          </div>

          {/* CSV */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Leads CSV
            </label>

            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="w-full border border-gray-300 rounded-lg p-3"
            />

            <p className="text-xs text-gray-500 mt-2">
              Upload a CSV containing recipient email addresses.
            </p>
          </div>

          {/* Start Time */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>

            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delay Between Emails (seconds)
              </label>

              <input
                type="number"
                min="0"
                placeholder="2"
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hourly Email Limit
              </label>

              <input
                type="number"
                min="1"
                placeholder="200"
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />
            </div>

          </div>

          {/* Recipient Count */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Recipients
            </p>

            <p className="text-2xl font-semibold mt-1">
              {recipientCount}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-8">

            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 border border-gray-300 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSchedule}
              disabled={loading}
              className="px-5 py-2.5 bg-black text-white rounded-lg disabled:opacity-50"
            >
              {loading ? "Scheduling..." : "Schedule Emails"}
            </button>

          </div>

        </div>

      </main>
    </div>
  )
}

export default ComposeEmail