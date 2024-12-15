import Announcement from "@/components/Announcement"
import AttendanceChartCountainer from "@/components/AttendanceChartCountainer"
import CountChartContainer from "@/components/CountChartContainer"
import EventCalendarContainer from "@/components/EventCalendarContainer"
import Eventcalendar from "@/components/Eventcalendar"
import Financechart from "@/components/Financechart"
import Usercard from "@/components/Usercard"

const AdminPage = ({
  searchParams
}:{
  searchParams:{[keys:string]:string | undefined
  }}) => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* Left Side */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
         {/* USER CARDS*/}
         <div className="flex gap-4 justify-between flex-wrap">
            <Usercard type="admin" />
            <Usercard type="teacher" />
            <Usercard type="student" />
            <Usercard type="parent" />
         </div>
         {/* Middle Chart */}
         <div className="flex gap-4 flex-col lg:flex-row">
            {/* Count Chart */}
            <div className="w-full lg:w-1/3 h-[450px]">
              <CountChartContainer />
            </div>
            {/* attendance Chart */}
            <div className="w-full lg:w-2/3 h-[450px]">
              <AttendanceChartCountainer />
            </div>
         </div>
         {/* Bottom Chart */}
         <div className="w-full h-[500px]">
            <Financechart />
         </div>
      </div>
      {/* right Side */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8 ">
        {/* Calendar */}
        <EventCalendarContainer searchParams={searchParams} />
        {/* Announcement */}
        <Announcement />
      </div>
    </div>
  )
}

export default AdminPage
