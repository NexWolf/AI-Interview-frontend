"use client";
import AuthSignForm from "@/component/form/AuthSignForm";
import { signinInput, SigninSchema } from "@/validations/authSchema";
import { forwardRef } from "react";
import { useForm } from "react-hook-form";
import { SigninType } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

type props = {
  show?: boolean;
  onConfirm: () => void;
};

export const Signin = forwardRef<HTMLDivElement, props>(
  ({ show, onConfirm }, ref) => {
    const router = useRouter();

    /* form hook options */
    const {
      register: registerData,
      handleSubmit: handleSubmitData,
      formState: { errors },
      reset: resetForm,
    } = useForm<signinInput>({
      resolver: zodResolver(SigninSchema),
    });

    const onRegister = async (data: SigninType) => {
      try {
        const response = await fetch("http://localhost:5000/login", {
          method: "POST",
          credentials : 'include',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if(response.status === 403) {
          return router.push('/verify-email')
        }

        if (response.status === 200) {
          const token = result.token;
          localStorage.setItem('token' , token);
          resetForm();
          alert("loginSuccessfully");
          router.push("/dashboard/overview");
        }
      } catch (error) {
        if (error) {
          console.error(error);
        }
      }
    };

    return (
      <div
        className={`absolute inset-0 transition-all duration-500  ${show ? "translate-x-full opacity-0 pointer-events-none" : "translate-x-0 opacity-100"}`}
      >
        <div ref={ref} className="p-2 md:p-5">
          <AuthSignForm
            title="Sign In Account"
            onSubmit={handleSubmitData(onRegister)}
            onConfirm={onConfirm}
            haveAccountTitle="Already have an account?sgin up"
          >
            <label>
              <h3 className="text-white/70 text-sm">Email</h3>
              <input
                {...registerData("email")}
                placeholder="eg. Ahmed@gmail.com"
                className="bg-zinc-800 w-full px-3 py-2 border border-zinc-700 rounded-sm outline-none text-sm"
              />
              {errors.email && <p>{errors.email.message}</p>}
            </label>

            <label>
              <h3 className="text-white/70 text-sm">Password</h3>
              <input
                type="password"
                {...registerData("password")}
                placeholder="Enter your password"
                className="bg-zinc-800 w-full px-3 py-2 border border-zinc-700 rounded-sm outline-none text-sm"
              />
              {errors.password && <p>{errors.password?.message}</p>}
            </label>

            <div className="w-full space-y-1 mt-5">
              <button className="w-full bg-zinc-950 border border-gray-800 py-2 rounded-md text-white/70 hover:text-white hover:scale-105 cursor-pointer flex items-center justify-center gap-1">
                Sign In
              </button>
            </div>
          </AuthSignForm>
        </div>
      </div>
    );
  },
);

Signin.displayName = "Signin";
