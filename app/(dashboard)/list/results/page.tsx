import Formmodal from "@/components/Formmodal"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import Tablesearch from "@/components/Tablesearch"
import {resultsData, role } from "@/lib/data"
import prisma from "@/lib/prisma"
import { ITEM_PER_PAGE } from "@/lib/settings"
import { Assignment, Exam, Prisma, Result, Student } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import { ImageResponse } from "next/server"

type Resultlist = {
  id: number;
  title: string;
  studentName: string;
  studentSurname: string;
  teacherName: string;
  teacherSurname: string;
  score: number;
  className: string;
  startTime: Date;
}

{/* Create header table */}
const columns = [
  {
    header: "Title", 
    accessor: "title",
  },    
  {
    header: "Class ", 
    accessor: "class", 
    
  },
  {
    header: "Teacher Names", 
    accessor: "teachers", 
    className:"hidden lg:table-cell",
  },
  {
    header: "Student Names", 
    accessor: "student", 
    className:"hidden lg:table-cell",
  },
  {
    header: "Dates", 
    accessor: "date", 
    className:"hidden lg:table-cell",
  },
  {
    header: "Scores", 
    accessor: "score", 
    className:"hidden lg:table-cell",
  },
  {
    header: "Actions", 
    accessor: "actions", 
  },
]

const renderRow = (item: Resultlist) => (
  <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
    <td className="flex items-center gap-4 p-4">
        {item.title}
    </td>
    <td className="">{item.className}</td>
    <td className="hidden md:table-cell">{item.teacherName + " " + item.teacherSurname}</td>
    <td className="hidden md:table-cell">{item.studentName+ " " +item.studentSurname}</td>
    <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-US").format(item.startTime)}</td>
    <td className="hidden md:table-cell">{item.score}</td>
    <td>
      <div className="flex items-center gap-2">
        {/*<Link href={`/list/results/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center bg-lamaSky rounded-full">
            <Image src="/edit.png" alt="" width={16} height={16} />
          </button>
          
        </Link>*/}
        {role === "admin" && (
          //<button className="w-7 h-7 flex items-center justify-center bg-lamaPurple rounded-full">
          //  <Image src="/delete.png" alt="" width={16} height={16} />
          //</button>
          <>
            <Formmodal table="result" type="update" data={item} />
            <Formmodal table="result" type="delete" id={item.id} />
          </>
          
        )}
      </div>
    </td>
  </tr>
)

const ResultsListPage = async ({
  searchParams,
}:{
  searchParams: {[key:string]:string | undefined}
}) => {
  
  const {page, ...queryParams} = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.ResultWhereInput = {}

  if (queryParams) {
    for (const[key,value] of Object.entries(queryParams)) {
      if(value !== undefined){
        switch(key) {
          case "studentId":
            query.studentId = value
          break
          case "search":
            query.OR = [
              { exam: { title: { contains: value, mode: "insensitive" } } },
              { studnet: { name: { contains: value, mode: "insensitive" } } },
            ]

          default:
          break
        }
      }
      
    }
  }

  const [dataRes, count] = await prisma.$transaction([
    prisma.result.findMany({
      where:query,
      include:{
        studnet: {select: {name: true, surname: true}},
        exam:{
          include:{
            lesson: {
              select:{
                class: {select: {name: true}},
                teacher: {select: {name: true, surname: true}},
              }
            }
          }
        },
        assignment:{
          include:{
            lesson: {
              select:{
                class: {select: {name: true}},
                teacher: {select: {name: true, surname: true}},
              }
            }
          }
        }
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.result.count({
      where:query,
    })
  ])

  const data = dataRes.map((item) => {
    {/* for checking is the data available in exam or assignment */}
    const assessment = item.exam || item.assignment

    if (!assessment) return null

    const isExam = "startTime" in assessment

    return {
      id: item.id,
      title: assessment.title,
      studentName: item.studnet?.name,
      studentSurname: item.studnet?.surname,
      teacherName: assessment.lesson.teacher.name,
      teacherSurname: assessment.lesson.teacher.surname,
      score: item.score,
      className: assessment.lesson.class.name,
      startTime: isExam ? assessment.startTime : assessment.startDate,
    }
  })
  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
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
              <Formmodal table="result" type="create" />
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

export default ResultsListPage