import Formmodal from "@/components/Formmodal"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import Tablesearch from "@/components/Tablesearch"
import prisma from "@/lib/prisma"
import { ITEM_PER_PAGE } from "@/lib/settings"
import { auth } from "@clerk/nextjs/server"
import { Lesson, Prisma, Report, Student, Teacher } from "@prisma/client"
import Image from "next/image"

const {sessionClaims } = await auth()
const role = (sessionClaims?.metadata as { role?: string })?.role

type ReportList = Report & {student: Student} & {teacher: Teacher} & {lesson: Lesson}

{/* Create header table */}
const columns = [
  {
    header: "Date", 
    accessor: "date",
  },
  {
    header: "Lesson Name", 
    accessor: "lesson",
  },
  {
    header: "Feedback", 
    accessor: "feedback",
  },
  {
    header: "Student Name", 
    accessor: "student", 
    
  },
  {
    header: "Teacher Name", 
    accessor: "teacher", 
    className:"hidden lg:table-cell",
  },
  //{/* if role admin action will appear if not action will not appear */}
  ...(role === "teacher" ? [{
    header: "Actions", 
    accessor: "actions", 
  }] :[]),
]

const renderRow = (item: ReportList) => (
  <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
    <td className="">{new Intl.DateTimeFormat("id-ID", {dateStyle:"medium"}).format(item.date)}</td>
    <td className="">{item.lesson.name}</td>
    <td className="">{item.feedback}</td>
    <td className="hidden lg:table-cell">{item.student.name + " " + item.student.surname}</td>
    <td className="hidden lg:table-cell">{item.teacher.name + " " + item.teacher.surname}</td>
    <td>
      <div className="flex items-center gap-2">
        {role === "teacher" && (
          <>
            <Formmodal table="lesson" type="update" data={item} />
            <Formmodal table="lesson" type="delete" id={item.id} />
          </>
          
        )}
      </div>
    </td>
  </tr>
)

const ReportPage = async ({
  searchParams,
}:{
  searchParams: {[key:string]:string | undefined}
}) => {
  
  const {page, ...queryParams} = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.ReportWhereInput = {}

  if (queryParams) {
    for (const[key,value] of Object.entries(queryParams)) {
      if(value !== undefined){
        switch(key) {
          case "teacherId":
            query.teacherId = value
          break
          case "classId":
            query.studentId = value
          break
          case "search":
            query.OR = [
              {lesson: {name: {contains:value, mode:"insensitive"}}},
              {teacher: {name: {contains:value, mode:"insensitive"}}},
              {student: {name: {contains:value, mode:"insensitive"}}},
            ]

          default:
          break
        }
      }
      
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.report.findMany({
      where:query,
      include:{
        lesson: {select:{name: true}},
        student: {select:{name: true, surname: true}},
        teacher: {select:{name: true, surname: true}},
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.report.count({
      where:query,
    })
  ])

  

  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Report</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <Tablesearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center bg-lamaYellow rounded-full" >
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-lamaYellow rounded-full" >
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "teacher" && (
              <Formmodal table="report" type="create" />
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

export default ReportPage