function Home({ onCompose }: { onCompose: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-5">
        <h1 className="text-xl font-bold text-gray-900 mb-8">
          ReachInbox
        </h1>

        <nav className="space-y-2">
          <button className="w-full text-left px-4 py-3 rounded-lg bg-gray-100 font-medium">
            Emails
          </button>

          <button className="w-full text-left px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100">
            Scheduled
          </button>

          <button className="w-full text-left px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100">
            Sent
          </button>
        </nav>

        <div className="absolute bottom-5">
          <p className="text-sm font-medium text-gray-700">
            User
          </p>

          <button className="text-sm text-gray-500 mt-2">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">

        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Emails
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Manage your scheduled and sent emails
            </p>
          </div>

          <button onClick={onCompose} className="bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800">
            + Compose Email
          </button>
        </header>

        {/* Tabs */}
        <div className="px-8 pt-6">
          <div className="flex gap-8 border-b border-gray-200">

            <button className="pb-3 border-b-2 border-black font-medium">
              Scheduled
            </button>

            <button className="pb-3 text-gray-500">
              Sent
            </button>

          </div>
        </div>

        {/* Empty State */}
        <section className="px-8 py-12">

          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">

            <div className="text-4xl mb-4">
              ✉️
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              No scheduled emails
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Your scheduled emails will appear here.
            </p>

            <button className="mt-6 bg-black text-white px-5 py-2.5 rounded-lg">
              Compose your first email
            </button>

          </div>

        </section>

      </main>
    </div>
  )
}

export default Home