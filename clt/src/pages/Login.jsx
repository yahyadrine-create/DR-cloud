import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { UserIcon ,MailIcon, LockIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
const Login = ({mode="login"}) => {

  const isRegistre= mode ==="registre";

  const navigate = useNavigate();
  const {login,register} = useApp();

  const [form,SetForm] = React.useState({
    email:"",
    password:"",
  })
  const [isLoading,SetIsLoading] = React.useState(false);

  const updateField = (key,value) => SetForm((prev)=>({...prev,[key]:value}));

  const handleSubmit = async (e) => { 
    e.preventDefault();
    SetIsLoading(true)
    const ok = isRegistre ? await register(form.name,form.email,form.password) : await login(form.email,form.password);
    setIsLoading(false)
    if(ok) navigate("/")


  }

  return (
    <div className="min-h-screen text-zinc-900 flex flex-col md:flex-row">
      {/* left side */}

        <div className="md:w-1/2 p-8 md:p-12 lg:p-16 bg-linear-to-br
        form-orange-50 via-zinc-100 to-red-50 border-b md:border-b-0 md:border-r border-zinc-200
        flex flex-col justify-between relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('/pattern.svg')]"></div>
            <div className="relative z-10 flex items-center gap-3">
              <img src="/logo.svg" alt="DR_Cloud Logo" className="max-h-9"/>
              <span className="text-4xl font-medium uppercase text-zinc-900">DR_Cloud</span>
            </div>
            <div className="relative z-10 my-12 space-y-6">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tight
                  text-zinc-900 leading-thight">Your Cloud.Your Control<br/></h2>
                  <p className="text-sm md:text-base text-zinc-600 max-w-md leading-relaxed">
                    Store your files securely in our drive, organize into folders, share with
                    permissions and access anywhere.
                  </p>
            </div>
            <div className="relative z-10 text-sm text-zinc-500">My First Project </div>
        </div>
      {/* right side */}

        <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex items-center justify-center bg-white">
           <div className="w-full max-w-md space-y-6 animate-fade-in">
              <div>
                <h3 className="text-2xl font-medium text-zinc-900">{isRegistre  ?"Create an account": "Welcome back"}</h3>
                <p className="text-sm text-zinc-500 mt-1"> 
                  {isRegistre ? "Entre your details to get started with 1 GB free storage": 
                  "Enter your details to access your account"}
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegistre && (<Input label="Full Name"
                    icon={UserIcon}
                    placeHolder="Name"
                    value={form.name}
                    onChange={(e)=>updateField('name', e.target.value)}
                    required/>
                    )}
                    <Input label="Email Adresse"
                    type="email"
                    icon={MailIcon}
                    placeHolder="you@exemple.com"
                    value={form.email}
                    onChange={(e)=>updateField('email', e.target.value)}
                    required
                    />
                    <Input label="Password"
                    type="password"
                    icon={LockIcon}
                    placeHolder="********"
                    value={form.password}
                    onChange={(e)=>updateField('password', e.target.value)}
                    required
                    />
                    <Button type="submit" variant="primary" className="w-full py-3"
                    isLoading={isLoading}>
                      <span className='font-medium text-base'>
                        {isRegistre ? "Registre Account" : "Sign in"}
                      </span>
                    </Button>
              </form>
              <div className="text-center pt-2">
                    {isRegistre ? (<p className="text-xs text-zinc-500"> Already have an account? {" "}
                      <Link to="/login" className="text-orange-600 font-medium hover:underline">Sign in here</Link>
                    </p>):(
                      <p className="text-xs text-zinc-500"> Don't have an account yet? {" "}
                      <Link to="/registre" className="text-orange-600 font-medium hover:underline">Create account</Link>
                    </p>
                    ) }
              </div>
            </div> 
        </div>
     </div>
  )

}
export default Login