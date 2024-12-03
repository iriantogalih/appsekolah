import Formmodal from "@/components/Formmodal"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import Tablesearch from "@/components/Tablesearch"
import { classesData,role } from "@/lib/data"
import prisma from "@/lib/prisma"
import { ITEM_PER_PAGE } from "@/lib/settings"
import { Class, Grade, Prisma, Teacher } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import { ImageResponse } from "next/server"

type ClassesList = Class & {supervisor: Teacher} & {grade: Grade}

{/* Create header table */}
const columns = [
  {
    header: "Class Name", 
    accessor: "name",
  },
  {
    header: "Capacity", 
    accessor: "capacity", 
    
  },
  {
    header: "Grade", 
    accessor: "grade", 
    className:"hidden lg:table-cell",
  },
  {
    header: "Supervisor", 
    accessor: "supervisor", 
    className:"hidden lg:table-cell",
  },
  {
    header: "Actions", 
    accessor: "actions", 
  },
]

const renderRow = (item: ClassesList) => (
  <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
    <td className="flex items-center gap-4 p-4">{item.name}</td>
    <td className="">{item.capacity}</td>
    <td className="hidden lg:table-cell">{item.grade.level}</td>
    <td className="hidden lg:table-cell">{item.supervisor.name + " " + item.supervisor.surname}</td>
    <td>
      <div className="flex items-center gap-2">
        {/*<Link href={`/list/classes/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center bg-lamaSky rounded-full">
            <Image src="/edit.png" alt="" width={16} height={16} />
          </button>
          
        </Link>*/}
        {role === "admin" && (
          //<button className="w-7 h-7 flex items-center justify-center bg-lamaPurple rounded-full">
          //  <Image src="/delete.png" alt="" width={16} height={16} />
          //</button>
          <>
          <Formmodal table="class" type="update" data={item} />
          <Formmodal table="class" type="delete" id={item.id} />
          </>
          
        )}
      </div>
    </td>
  </tr>
)
const ClassesListPage = async ({
  searchParams,
}:{
  searchParams: {[key:string]:string | undefined }
}) => {
  
  const {page, ...queryParams} = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.ClassWhereInput = {}

  if (queryParams) {
    for (const[key,value] of Object.entries(queryParams)) {
      if(value !== undefined){
        switch(key) {
          case "supervisorId":
            query.supervisorId = value
          break
          case "search":
            //query.name = {contains:value, mode:"insensitive"}
            query.OR = [
              {supervisor: {name: {contains:value, mode:"insensitive"}}},
              {supervisor: {surname: {contains:value, mode:"insensitive"}}},
              {name: {contains:value, mode:"insensitive"}},
            ]
            
          default:
          break
        }
      }
      
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.class.findMany({
      where:query,
      include:{
        supervisor: {select: {name: true, surname: true}},
        grade: {select: {level: true}},
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.class.count({
      where:query,
    })
  ])



  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>
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
              <Formmodal table="class" type="create" />
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

export default ClassesListPage