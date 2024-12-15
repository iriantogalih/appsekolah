import Image from 'next/image';
import Attendancechart from './Attendancechart';
import prisma from '@/lib/prisma';

const AttendanceChartCountainer = async () => {

    {/* Get the day of the week */}

    const today = new Date()
    const dayofweek = today.getDay()
    const daysSinceMonday = dayofweek === 0 ? 7 : dayofweek - 1

    const lastMonday = new Date(today)
    lastMonday.setDate(today.getDate() - daysSinceMonday)

    const resData = await prisma.attendance.findMany({
        where: {
            date: {
                gte: lastMonday,
            },
        },
        select: {
            date:true,
            present: true,
        },
    })

    {/* mapping date to days */}

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"]

    const attendanceMap : {[key:string] : {present:number; absent:number}} = {
        Mon: {present:0, absent:0},
        Tue: {present:0, absent:0},
        Wed: {present:0, absent:0},
        Thu: {present:0, absent:0}, 
        Fri: {present:0, absent:0},
    }

    resData.forEach(item => {
        const itemDate = new Date(item.date)
        const dayofweek = itemDate.getDay();

        if (dayofweek >= 1 && dayofweek <= 5 ){
            const dayName = daysOfWeek[dayofweek - 1]
            if (item.present) {
                attendanceMap[dayName].present += 1
            }else{
                attendanceMap[dayName].absent += 1
            }
        }
    })

    const data = daysOfWeek.map((day) => ({
        name: day,
        present: attendanceMap[day].present,
        absent: attendanceMap[day].absent,
    }));

  return (
    <div className="bg-white rounded-xl p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <Image src="/moreDark.png" alt='' width={20} height={20} />
      </div>
        <Attendancechart data={data} />
      </div>
  )
}

export default AttendanceChartCountainer