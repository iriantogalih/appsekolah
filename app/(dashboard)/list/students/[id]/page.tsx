import Announcement from "@/components/Announcement"
import Bigcalendar from "@/components/Bigcalendar"
import Performance from "@/components/Performance"
import Image from "next/image"
import Link from "next/link"

const SingleStudentPage = () => {
  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
        {/* Left Side */}
        <div className="w-full xl:w-2/3">
            {/* TOP */}
            <div className="flex flex-col lg:flex-row gap-4 ">
                {/* User Info Card */}
                <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
                    {/* Avatar */}
                    <div className="w-1/3">
                        <Image 
                            src="https://images.pexels.com/photos/5414817/pexels-photo-5414817.jpeg?auto=compress&cs=tinysrgb&w=1200" 
                            alt="" 
                            width={144} 
                            height={144} 
                            className="w-36 h-36 rounded-full object-cover"
                        />
                    </div>
                    {/* Text */}
                    <div className="w-2/3 flex flex-col justify-between gap-4">
                        <h1 className="text-xl font-semibold">Cameron Moran</h1>
                        <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                        {/* detail text */}
                        <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                            <div className="w-full lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                <Image src="/blood.png" alt="" width={14} height={14} />
                                <span>A+</span>
                            </div>
                            <div className="w-full lg:w-full 2xl:w-1/3  flex items-center gap-2">
                                <Image src="/date.png" alt="" width={14} height={14} />
                                <span>January 2025</span>
                            </div>
                            <div className="w-full lg:w-full 2xl:w-1/3  flex items-center gap-2">
                                <Image src="/mail.png" alt="" width={14} height={14} />
                                <span>user@gmail.com</span>
                            </div>
                            <div className="w-full lg:w-full 2xl:w-1/3  flex items-center gap-2">
                                <Image src="/phone.png" alt="" width={14} height={14} />
                                <span>081919122334</span>
                            </div>
                        </div>
                    </div>
                </div>
                 {/* Small Card */}
                <div className="flex-1 flex gap-4 justify-between flex-wrap">
                 {/* Card */}
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                        <Image src="/singleAttendance.png" alt="" width={24} height={24} className="w-6 h-6"/>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-semibold">90%</h1>
                            <span className="text-xs text-gray-500">Attendance</span>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                        <Image src="/singleBranch.png" alt="" width={24} height={24} className="w-6 h-6"/>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-semibold">6</h1>
                            <span className="text-xs text-gray-500">Grade</span>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                        <Image src="/singleLesson.png" alt="" width={24} height={24} className="w-6 h-6"/>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-semibold">18</h1>
                            <span className="text-xs text-gray-500">Lesson</span>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                        <Image src="/singleClass.png" alt="" width={24} height={24} className="w-6 h-6"/>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-semibold">6A</h1>
                            <span className="text-xs text-gray-500">Class</span>
                        </div>
                    </div>
                </div>      
            </div>
            {/* BOTTOM */}
            <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
                <h1>Student's Schedule</h1>
                <Bigcalendar />
            </div>
        </div>
        {/* Right Side */}
        <div className="w-full xl:w-1/3 flex flex-col gap-4">
            <div className="bg-white p-4 rounded-md">
                <h1 className="text-xl font-semibold">Shortcuts</h1>
                <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
                    <Link className="p-3 rounded-md bg-lamaPurpleLight" href={`/list/teachers?classId=${2}`}>
                        Student's Teacher
                    </Link>
                    <Link className="p-3 rounded-md bg-lamaPurpleLight" href="/">Student's Lessons</Link>
                    <Link className="p-3 rounded-md bg-pink-50" href="/">Student's Exams</Link>
                    <Link className="p-3 rounded-md bg-lamaPurple" href="/">Student's Assignments</Link>
                    <Link className="p-3 rounded-md bg-lamaSkyLight" href="/">Student's Result</Link>
                </div>
            </div>
            <Performance />
            <Announcement />
        </div>
    </div>
  )
}

export default SingleStudentPage