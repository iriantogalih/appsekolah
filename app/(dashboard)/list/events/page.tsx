import Formmodal from "@/components/Formmodal"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import Tablesearch from "@/components/Tablesearch"
import { eventsData, role } from "@/lib/data"
import Image from "next/image"
import Link from "next/link"
import { ImageResponse } from "next/server"

{/* temporary load data */}

type Event = {
  id: number,
  title: string,
  class: string,
  date: string,
  startTime: string,
  endTime: string,
}

{/* Create header table */}
const columns = [
  {
    header: "Titles", 
    accessor: "title", 
    
  },
  {
    header: "Class", 
    accessor: "class",
  },
  {
    header: "Date", 
    accessor: "date", 
    className:"hidden lg:table-cell",
  },
  {
    header: "Start Time", 
    accessor: "startTime", 
    className:"hidden lg:table-cell",
  },
  {
    header: "End Time", 
    accessor: "endTime", 
    className:"hidden lg:table-cell",
  },
  {
    header: "Actions", 
    accessor: "actions", 
  },
]

const EventsListPage = () => {

  const renderRow = (item: Event) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="">{item.title}</td>
      <td className="">{item.class}</td>
      <td className="hidden lg:table-cell">{item.date}</td>
      <td className="hidden lg:table-cell">{item.startTime}</td>
      <td className="hidden lg:table-cell">{item.endTime}</td>
      <td>
        <div className="flex items-center gap-2">
          {/*<Link href={`/list/events/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center bg-lamaSky rounded-full">
              <Image src="/edit.png" alt="" width={16} height={16} />
            </button>
            
          </Link>*/}
          {role === "admin" && (
            //<button className="w-7 h-7 flex items-center justify-center bg-lamaPurple rounded-full">
            //  <Image src="/delete.png" alt="" width={16} height={16} />
            //</button>
            <>
              <Formmodal table="event" type="update" data={item} />
              <Formmodal table="event" type="delete" id={item.id} />
            </>
            
          )}
        </div>
      </td>
    </tr>
  )

  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <Tablesearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center bg-lamaYellow rounded-full" >
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-lamaYellow rounded-full" >
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              //<button className="w-8 h-8 flex items-center justify-center bg-lamaYellow rounded-full" >
              // <Image src="/plus.png" alt="" width={14} height={14} />
              //</button>
              <Formmodal table="event" type="create" />
            )}
           
          </div> 
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={eventsData}/>
      {/* PAGINATION */}
      <Pagination />
    </div>
  )
}

export default EventsListPage