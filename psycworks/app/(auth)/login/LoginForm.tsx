import React from 'react'

export function LoginForm() {
  return (
        <div className="login-background">
            <div className="relative">
                <form className="space-y-5">
                    <h2 className='text-center text-white'> Email: </h2>
                    <input className='w-full h-12 border border-gray-800 px-3 rounded-lg' placeholder="Email" type="text" />
                    <h2 className='text-center text-white'> Password: </h2>                        
                    <input className='w-full h-12 border border-gray-800 px-3 rounded-lg' placeholder="Password" type="text" />                        
                    <button style={{ backgroundColor: '#334F83' }}  className="w-full h-12 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Sign in</button>
                    <a className=" hover:text-blue-400 text-sm" href="#">Forgot Password?</a>
                </form>
            </div>
        </div>
  )
}

export default LoginForm
