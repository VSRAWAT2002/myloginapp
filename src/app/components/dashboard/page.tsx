import users from '../../data/user.json';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
       
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome back!  
        </h1>
        <p className="text-gray-600">
          Here is the current directory of all registered users in the system.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((user: any) => (
          <div 
            key={user.id} 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow"
          >
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
              {user.username.charAt(0).toUpperCase()}
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800">
              {user.username}
            </h2>
            
            <p className="text-xs text-green-500 font-medium mt-1">Active User</p>
          </div>
        ))}
      </div>
    </div>
  );
}