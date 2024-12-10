import Formmodal from "@/components/Formmodal"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import Tablesearch from "@/components/Tablesearch"
import prisma from "@/lib/prisma"
import { ITEM_PER_PAGE } from "@/lib/settings"
import { auth } from "@clerk/nextjs/server"
import { Announcement, Class, Prisma } from "@prisma/client"
import Image from "next/image"

const {sessionClaims } = await auth()
const role = (sessionClaims?.metadata as { role?: string })?.role


type Announcementlist = Announcement & {class: Class}

{/* Create header table */}
const columns = [
  {
    header: "Title Name", 
    accessor: "title",
  },    
  {
    header: "Class ", 
    accessor: "class", 
    
  },
  {
    header: "Date", 
    accessor: "date", 
    className:"hidden lg:table-cell",
  },
  //{/* if role admin action will appear if not action will not appear */}
  ...(role === "admin" ? [{
    header: "Actions", 
    accessor: "actions", 
  }] :[]),
]

const renderRow = (item: Announcementlist) => (
  <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
    <td className="flex items-center gap-4 p-4">
        {item.title}
    </td>
    <td className="">{item.class?.name}</td>
    <td className="hidden md:table-cell">{new Intl.DateTimeFormat("id-ID", {dateStyle:"medium"}).format(item.date)}</td>
    <td>
      <div className="flex items-center gap-2">
        {/*<Link href={`/list/announcements/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center bg-lamaSky rounded-full">
            <Image src="/view.png" alt="" width={16} height={16} />
          </button>
          
        </Link> */}
        {role === "admin" && (
          <>
            <Formmodal table="announcement" type="update" data={item} />
            <Formmodal table="announcement" type="delete" id={item.id} />
          </>
          
        )}
      </div>
    </td>
  </tr>
)

const AnnouncementsListPage = async ({
  searchParams,
}:{
  searchParams: {[key:string]:string | undefined}
}) => {
  
  const {page, ...queryParams} = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.AnnouncementWhereInput = {}

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

  const [data, count] = await prisma.$transaction([
    prisma.announcement.findMany({
      where:query,
      include:{
        class: {select:{name:true}}
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.announcement.count({
      where:query,
    })
  ])
  

  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Announcements</h1>
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
              <Formmodal table="announcement" type="create" />
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

export default AnnouncementsListPage