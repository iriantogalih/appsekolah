import Announcement from "@/components/Announcement"
import Bigcalendar from "@/components/Bigcalendar"
import EventCalendarContainer from "@/components/EventCalendarContainer"
import Eventcalendar from "@/components/Eventcalendar"

const StudentPage = ({
  searchParams
}:{
  searchParams:{[keys:string]:string | undefined
  }}) => {
  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* Left Side */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule (4A)</h1>
          <Bigcalendar />
        </div>
      </div>
      {/* Right Side */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8 ">
        {/* Calendar */}
        <EventCalendarContainer searchParams={searchParams} />
        {/* Announcement */}
        <Announcement />
      </div>

    </div>
  )
}

export default StudentPage