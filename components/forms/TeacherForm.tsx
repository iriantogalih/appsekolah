"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm } from "react-hook-form";
import { z } from "zod"
import InputField from "../Inputfield";
import Image from "next/image";

const schema = z.object({
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters!" })  
        .max(20, { message: "Username must be at most 20 characters!" }),
    email: z
        .string()
        .email({ message: "Invalid email address!" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 6 characters!" }),
    firstName: z
        .string()
        .min(1, { message: "First name is required!" }),
    lastName: z
        .string()
        .min(1, { message: "Last name is required!" }),
    phone: z
        .string()
        .min(1, { message: "Phone number is required!" }),
    address: z
        .string()
        .min(1, { message: "Address is required!" }),
    blood: z.enum(["A", "B", "AB", "O"], { message: "Blood type is required!" }),
    birthday: z
        .date({ message: "Birthday is required!" }),
    sex: z.enum(["male", "female"], { message: "Sex is required!" }),
    img: z.instanceof(File, { message: "Image is required!" }),
       
    
})

type Inputs = z.infer<typeof schema>;

const TeacherForm = ({
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
            <h1 className="text-xl font-semibold">Create a new teacher</h1>
            <span className="text-sm text-gray-400 font-medium">Authentication Information</span>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField 
                    label="Username"
                    name="username"
                    defaultValue={data?.username}
                    register={register}
                    error={errors.username}
                />
                <InputField 
                    label="email"
                    name="email"
                    defaultValue={data?.email}
                    register={register}
                    error={errors.email}
                />
                <InputField 
                    label="Password"
                    name="password"
                    defaultValue={data?.password}
                    register={register}
                    error={errors.password}
                    type="password"
                />
            </div>
            <span className="text-sm text-gray-400 font-medium">Personal Information</span>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField 
                    label="First Name"
                    name="firstname"
                    defaultValue={data?.firstName}
                    register={register}
                    error={errors.firstName}
                />
                <InputField 
                    label="Last Name"
                    name="lastname"
                    defaultValue={data?.lastName}
                    register={register}
                    error={errors.password}
                />
                <InputField 
                    label="Phonenumber"
                    name="phone"
                    defaultValue={data?.phone}
                    register={register}
                    error={errors.phone}
                />
                <InputField 
                    label="Address"
                    name="address"
                    defaultValue={data?.address}
                    register={register}
                    error={errors.address}
                />
                <InputField 
                    label="Birthday"
                    name="birthday"
                    defaultValue={data?.birthday}
                    register={register}
                    error={errors.birthday}
                    type="date"
                />
                <InputField 
                    label="Blood Type"
                    name="blood"
                    defaultValue={data?.blood}
                    register={register}
                    error={errors.blood}
                />
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-sm text-gray-400">Sex</label>
                    <select 
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" 
                        {...register("sex")}
                        defaultValue={data?.sex}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    {errors.sex?.message && (
                        <p className="text-xs text-red-400">{errors.sex.message.toString()}</p>
                    )}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
                    <label className="text-sm text-gray-400 flex items-center gap-2 cursor-pointer" htmlFor="img">
                        <Image src="/upload.png" alt="" width={28} height={28} className=" rounded-full" />
                        <span>Upload a photo</span>
                    </label>
                    <input type="file" id="img" className="hidden" {...register("img")} />
                    {errors.img?.message && (
                        <p className="text-xs text-red-400">{errors.img.message.toString()}</p>
                    )}
                </div>
                
            </div>
            

            <button className="bg-blue-400 text-white p-2 rounded-md">
                {type==="create" ? "Create" : "Update"}
            </button>
        </form>
    )
}

export default TeacherForm