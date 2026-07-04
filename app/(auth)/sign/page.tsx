"use client"
import {Signin} from "@/component/Landing/Signin/Signin";
import {Signup} from "@/component/Landing/Signup/Signup";
import {  useLayoutEffect, useRef, useState } from "react";

export default function Sign() {
    const [showForm , setShowForm] = useState<boolean>(true)
    const [height , setHeight] =useState(0); 
    const activeRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
      if(activeRef.current) {
        setHeight(activeRef.current.scrollHeight);
      }
      console.log(activeRef.current?.scrollHeight)
      console.log(showForm)
    } , [showForm])

  return (
    <>
    <div className="relative w-screen  h-screen bg-zinc-950 p-5  flex items-center  justify-center">
      <div
        style={{height}}
        className= {` bg-zinc-900 w-full md:w-1/2 rounded-xl  border shadow-2xl shadow-zinc-800  transition-[height] duration-300 overflow-hidden`}>
        <div 
          className= "relative ">
         <Signup 
            ref = {showForm === true ? activeRef : null}
            onConfirm = {() => setShowForm(false)}
            show={showForm}/>
         <Signin 
          ref = {showForm === false ? activeRef : null}
            onConfirm = {() => setShowForm(true)}
            show={showForm} />
        </div>
      </div>
      </div>
    </>
  );
}
