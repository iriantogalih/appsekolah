import Announcement from "@/components/Announcement"
import Attendancechart from "@/components/Attendancechart"
import Countchart from "@/components/Countchart"
import Eventcalendar from "@/components/Eventcalendar"
import Financechart from "@/components/Financechart"
import Usercard from "@/components/Usercard"

const AdminPage = () => {
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
              <Countchart />
            </div>
            {/* attendance Chart */}
            <div className="w-full lg:w-2/3 h-[450px]">
              <Attendancechart />
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
        <Eventcalendar />
        {/* Announcement */}
        <Announcement />
      </div>
    </div>
  )
}

export default AdminPage
