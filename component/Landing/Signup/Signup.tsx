"use client";
import AuthSignForm from "@/component/form/AuthSignForm";
import ConfirmEmailPop from "@/component/Popup/ConfirmEmailPop";
import { SignupType } from "@/types/auth";
import { signupInput, SignupSchema } from "@/validations/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useState} from "react";
import { useForm } from "react-hook-form";



type props = {
  show?: boolean;
  onConfirm: () => void;
};

type userData = {
  id : number | null,
  firstname : string,
  lastname : string,
  username : string,
  email : string
}

export const Signup = forwardRef<HTMLDivElement, props>(
  ({ show, onConfirm }, ref) => {

    const [showConfirmPop , setShowConfirmPop] = useState<boolean>(false)
    const [userData , setUserData] = useState<userData>({
      id: null,
      firstname : "",
      lastname : "",
      username : "",
      email : ""
    })

    const {
      register : registerData,
      handleSubmit : handleSubmitData,
      formState : {errors},
      reset : resetForm,
    } = useForm<signupInput>({
      resolver : zodResolver(SignupSchema)
    })

    const onSignup = async (data : SignupType) => {
      try {
        const response = await fetch('http://localhost:5000/register' , {
          method : 'POST',
          headers : {
            'Content-Type' : 'application/json',
          },
          body : JSON.stringify(data)
        });

        if(response.ok) {
          resetForm();
          const result = await response.json();
          setShowConfirmPop(true)
          onConfirm()
          setUserData(result)
        }else {
          alert('Registeration failed.')
        }
      }catch(error) {
        console.log('Error:' , error);
      }
    }

    // useLookScroll(showConfirmPop)

    return (
      <div
        className={`absolute inset-0 transition-all duration-500  ${show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"}`}
      >

        {showConfirmPop && <ConfirmEmailPop  
          email = {userData.email}
          closePopup={() => setShowConfirmPop(false)}
          />}


        <div ref={ref} className="p-2 md:p-10 ">
          <AuthSignForm
            title="Sign Up Account"
            onSubmit={handleSubmitData(onSignup)}
            onConfirm={onConfirm}
            haveAccountTitle="Dont have an account?sign in"
          >
            <div className="flex justify-between items-center w-full gap-2 ">
              <label className=" w-1/2 ">
                <h3 className="text-white/70 text-sm">First Name</h3>
                <input
                  {...registerData("firstname")}                  
                  placeholder="eg. Ahmed"
                  className=" bg-zinc-800 w-full px-3 py-2 border border-zinc-700 rounded-sm outline-none text-sm"
                />

                {errors.firstname && (
                  <p>{errors.firstname.message}</p>
                )}
              </label>

              <label className="w-1/2 ">
                <h3 className="text-white/70 text-sm">Last Name</h3>
                <input
                  {...registerData("lastname")}  
                  placeholder="eg. Jheer"
                  className="bg-zinc-800 w-full px-3 py-2 border border-zinc-700 rounded-sm outline-none text-sm"
                />

                {errors.lastname && (
                  <p>{errors.lastname.message}</p>
                )}
              </label>
            </div>

            <label>
              <h3 className="text-white/70 text-sm">User name</h3>
              <input
                {...registerData("username")}  
                placeholder="eg. Ahmed-jheer"
                className="bg-zinc-800 w-full px-3 py-2 border border-zinc-700 rounded-sm outline-none text-sm"
              />
              {errors.username && (
                  <p>{errors.username.message}</p>
                )}
            </label>

            <label>
              <h3 className="text-white/70 text-sm">Email</h3>
              <input
                {...registerData("email")}  
                placeholder="eg. Ahmed@gmail.com"
                className="bg-zinc-800 w-full px-3 py-2 border border-zinc-700 rounded-sm outline-none text-sm"
              />
              {errors.email && (
                  <p>{errors.email.message}</p>
                )}
            </label>

            <label>
              <h3 className="text-white/70 text-sm">Password</h3>
              <input
                type="password"
                {...registerData("password")}  
                placeholder="Enter your password"
                className="bg-zinc-800 w-full px-3 py-2 border border-zinc-700 rounded-sm outline-none text-sm"
              />
              {errors.password && (
                  <p>{errors.password.message}</p>
                )}
            </label>

            <div className="w-full space-y-1 mt-5">
              <button
                className="w-full bg-zinc-950 border border-gray-800 py-2 rounded-md text-white/70 hover:text-white hover:scale-105 cursor-pointer flex items-center justify-center gap-1"
              >
                Sign Up
              </button>
            </div>

          </AuthSignForm>
        </div>
      </div>
    );
  },
);

Signup.displayName = "Signup";
