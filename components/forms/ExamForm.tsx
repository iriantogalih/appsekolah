"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm } from "react-hook-form";
import { z } from "zod"
import InputField from "../Inputfield";
import Image from "next/image";

const schema = z.object({
       
    
})

type Inputs = z.infer<typeof schema>;

const ExamForm = ({
    type, 
    data,
}:{
    type:"create" | "update";
    data?:any;
}) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver:zodResolver(schema)
    })

    const onsubmit = handleSubmit((data) => {
        console.log(data);
    });
    
    return (
        <form className="flex flex-col gap-8" onSubmit={onsubmit}>
            <h1 className="text-xl font-semibold">Create a new exam</h1>
            <span className="text-sm text-gray-400 font-medium">Authentication Information</span>
            <div className="flex justify-between flex-wrap gap-4">
                
            </div>
            <span className="text-sm text-gray-400 font-medium">Personal Information</span>
            <div className="flex justify-between flex-wrap gap-4">
                
            </div>
            

            <button className="bg-blue-400 text-white p-2 rounded-md">
                {type==="create" ? "Create" : "Update"}
            </button>
        </form>
    )
}

export default ExamForm