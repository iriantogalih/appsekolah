import Formmodal from "@/components/Formmodal"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import Tablesearch from "@/components/Tablesearch"
import prisma from "@/lib/prisma"
import { ITEM_PER_PAGE } from "@/lib/settings"
import { auth } from "@clerk/nextjs/server"
import { Class, Event, Prisma } from "@prisma/client"
import Image from "next/image"


type Eventlist = Event & {class: Class}

const EventsListPage = async ({
  searchParams,
}:{
  searchParams: {[key:string]:string | undefined}
}) => {

  const {userId, sessionClaims } = await auth()
  const role = (sessionClaims?.metadata as { role?: string })?.role
  const currentUserId = userId



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
      header: "Description", 
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
    //{/* if role admin action will appear if not action will not appear */}
    ...(role === "admin" ? [{
      header: "Actions", 
      accessor: "actions", 
    }] :[]),
  ]

  const renderRow = (item: Eventlist) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="">{item.title}</td>
      <td className="">{item.class?.name || "All Class"}</td>
      <td className="hidden lg:table-cell">{item.description}</td>
      <td className="hidden lg:table-cell">{new Intl.DateTimeFormat("id-ID", {dateStyle:"medium"}).format(item.startDate)}</td>
      <td className="hidden lg:table-cell">{new Intl.DateTimeFormat("id-ID", {dateStyle:"medium"}).format(item.endDate)}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <Formmodal table="event" type="update" data={item} />
              <Formmodal table="event" type="delete" id={item.id} />
            </>
            
          )}
        </div>
      </td>
    </tr>
  )
  
  const {page, ...queryParams} = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.EventWhereInput = {}

  if (queryParams) {
    for (const[key,value] of Object.entries(queryParams)) {
      if(value !== undefined){
        switch(key) {
          case "search":
            query.OR = [
              {title: {contains:value, mode:"insensitive"}},
              {description: {contains:value, mode:"insensitive"}},
              {class: {name: {contains:value, mode:"insensitive"}}},
            ]

          default:
          break
        }
      }
      
    }
  }

   // ROLE CONDITION

   const roleConditions = {
      teacher:  {lessons: {some: { teacherId: currentUserId!}}},
      student:  {students: {some: { id: currentUserId!}}},
      parent:   {students: {some: { parentId: currentUserId!}}},
   }

  query.OR = [
    {classId: null},
    {
      class: roleConditions[role as keyof typeof roleConditions ]|| {}, 
    },
  ]

  const [data, count] = await prisma.$transaction([
    prisma.event.findMany({
      where:query,
      include:{
        class: {select:{name:true}}
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.event.count({
      where:query,
    })
  ])

  

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
              <Formmodal table="event" type="create" />
            )}
           
          </div> 
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data}/>
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  )
}

export default EventsListPage