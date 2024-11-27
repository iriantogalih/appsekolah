import Formmodal from "@/components/Formmodal"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import Tablesearch from "@/components/Tablesearch"
import { role, subjectsData } from "@/lib/data"
import prisma from "@/lib/prisma"
import { ITEM_PER_PAGE } from "@/lib/settings"
import { Prisma, Subject, Teacher } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import { ImageResponse } from "next/server"

type SubjectsList =Subject & {teachers: Teacher[]}

{/* Create header table */}
const columns = [
  {
    header: "Subject Name", 
    accessor: "name",
  },    
  {
    header: "Teacher Names", 
    accessor: "teachers", 
   
  },
  {
    header: "Actions", 
    accessor: "actions", 
  },
]

const renderRow = (item: SubjectsList) => (
  <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
    <td className="flex items-center gap-4 p-4">
        {item.name}
    </td>
    <td className="">{item.teachers.map((teacher) => teacher.name + " " + teacher.surname).join(", ")}</td>
    <td>
      <div className="flex items-center gap-2">
        {/*<Link href={`/list/subjects/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center bg-lamaSky rounded-full">
            <Image src="/edit.png" alt="" width={16} height={16} />
          </button>
          
        </Link> */}
        {role === "admin" && (
          //<button className="w-7 h-7 flex items-center justify-center bg-lamaPurple rounded-full">
          //  <Image src="/delete.png" alt="" width={16} height={16} />
          //</button>
          <>
            <Formmodal table="subject" type="update" data={item} />
            <Formmodal table="subject" type="delete" id={item.id} />
          </>
          
        )}
      </div>
    </td>
  </tr>
)

const SubjectListPage = async (
  {
    searchParams,
  }:{
    searchParams: {[key:string]:string | undefined }
  }) => {
    
    const {page, ...queryParams} = searchParams;
  
    const p = page ? parseInt(page) : 1;
  
    // URL PARAMS CONDITION

  const query: Prisma.SubjectWhereInput = {}

  if (queryParams) {
    for (const[key,value] of Object.entries(queryParams)) {
      if(value !== undefined){
        switch(key) {
          case "search":
            query.name = {contains:value, mode:"insensitive"}
            break
          default:
            break
        }
      }
      
    }
  }
  
    const [data, count] = await prisma.$transaction([
      prisma.subject.findMany({
        where:query,
        include:{
          teachers: {select:{name: true, surname: true}}
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
      }),
      prisma.subject.count()
    ])

  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>
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
              <Formmodal table="subject" type="create" />
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

export default SubjectListPage