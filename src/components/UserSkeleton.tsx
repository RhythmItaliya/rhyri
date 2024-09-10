export function UserSkeleton() {
  return (
    <>
      <div className="w-full max-w-6xl mx-auto p-8 space-y-8">
        <div className="animate-pulse">
          <div className="flex justify-between items-center mb-10">
            <div className="h-8 w-48 bg-gray-300 rounded"></div>
            <div className="h-8 w-48 bg-gray-300 rounded"></div>
          </div>
        </div>

        <div className="animate-pulse">
          <div className="flex justify-between items-center mb-4">
            <div className="h-8 w-32 bg-gray-300 rounded"></div>
            <div className="h-8 w-32 bg-gray-300 rounded"></div>
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="h-6 w-48 bg-gray-300 rounded"></div>
              <div className="h-4 w-32 bg-gray-300 rounded"></div>
              <div className="h-4 w-40 bg-gray-300 rounded"></div>
              <div className="h-4 w-36 bg-gray-300 rounded"></div>
              <div className="h-4 w-44 bg-gray-300 rounded"></div>
            </div>

            <div className="space-y-4">
              <div className="h-6 w-48 bg-gray-300 rounded"></div>
              <div className="h-4 w-32 bg-gray-300 rounded"></div>
              <div className="h-4 w-40 bg-gray-300 rounded"></div>
              <div className="h-4 w-36 bg-gray-300 rounded"></div>
              <div className="h-4 w-44 bg-gray-300 rounded"></div>
            </div>
          </div>

          <div className="border rounded-sm mt-8">
            <div className="p-4 border-b bg-gray-100">
              <div className="h-6 w-32 bg-gray-300 rounded"></div>
            </div>
            <div className="p-4">
              <div className="animate-pulse space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-4 w-24 bg-gray-300 rounded"></div>
                  <div className="h-4 w-16 bg-gray-300 rounded"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-4 w-24 bg-gray-300 rounded"></div>
                  <div className="h-4 w-16 bg-gray-300 rounded"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-4 w-24 bg-gray-300 rounded"></div>
                  <div className="h-4 w-16 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
