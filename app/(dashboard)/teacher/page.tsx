import Announcement from "@/components/Announcement"
import Bigcalendar from "@/components/Bigcalendar"

const TeacherPage = () => {
  return (
    <div className=" flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* Left Side */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule</h1>
          <Bigcalendar />
        </div>
      </div>
      {/* Right Side */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8 ">
        
        {/* Announcement */}
        <Announcement />
      </div>

    </div>
  )
}

export default TeacherPage