import EventList from "./EventList"
import Image from 'next/image';
import Eventcalendar from "./Eventcalendar";

const EventCalendarContainer = async ({
    searchParams
}:{
    searchParams:{[keys:string]:string | undefined
    }}) => {

    const {date} = searchParams
  return (
    <div className="bg-white p-4 rounded-md">
            <Eventcalendar />
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold my-4">Events</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20} />
            </div>
            <div className="flex flex-col gap-4">
             <EventList dateParams={date} />
            </div>
    </div>
  )
}

export default EventCalendarContainer