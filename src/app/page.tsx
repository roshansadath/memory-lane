export default function Home() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-6'>
            <h1 className='text-3xl font-bold text-gray-900'>Memory Lane</h1>
            <nav className='flex space-x-4'>
              <a href='#' className='text-gray-600 hover:text-gray-900'>
                Home
              </a>
              <a href='#' className='text-gray-600 hover:text-gray-900'>
                Login
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='text-center'>
          <h2 className='text-4xl font-bold text-gray-900 mb-4'>
            Welcome to Memory Lane
          </h2>
          <p className='text-xl text-gray-600 mb-8'>
            Create and share chronological collections of your memories
          </p>

          <div className='bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto'>
            <h3 className='text-2xl font-semibold text-gray-900 mb-4'>
              Coming Soon
            </h3>
            <p className='text-gray-600 mb-6'>
              This is a clean Next.js application setup for the Memory Lane
              project. The foundation is ready for implementing features.
            </p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-left'>
              <div className='p-4 bg-gray-50 rounded-lg'>
                <h4 className='font-semibold text-gray-900 mb-2'>
                  🏠 Home Page
                </h4>
                <p className='text-sm text-gray-600'>
                  Netflix-style layout with tag-based carousels
                </p>
              </div>
              <div className='p-4 bg-gray-50 rounded-lg'>
                <h4 className='font-semibold text-gray-900 mb-2'>
                  📝 Memory Lanes
                </h4>
                <p className='text-sm text-gray-600'>
                  Chronological timeline of memories
                </p>
              </div>
              <div className='p-4 bg-gray-50 rounded-lg'>
                <h4 className='font-semibold text-gray-900 mb-2'>
                  🔐 Authentication
                </h4>
                <p className='text-sm text-gray-600'>
                  Simple password-based login system
                </p>
              </div>
              <div className='p-4 bg-gray-50 rounded-lg'>
                <h4 className='font-semibold text-gray-900 mb-2'>
                  🖼️ Image Management
                </h4>
                <p className='text-sm text-gray-600'>
                  Upload and organize images with Supabase
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
