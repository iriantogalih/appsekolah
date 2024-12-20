import Formmodal from "@/components/Formmodal"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import Tablesearch from "@/components/Tablesearch"
import prisma from "@/lib/prisma"
import { ITEM_PER_PAGE } from "@/lib/settings"
import { auth } from "@clerk/nextjs/server"
import { Assignment, Class, Prisma, Subject, Teacher } from "@prisma/client"
import Image from "next/image"

type Assignmentlist = Assignment & {lesson:{
  subject: Subject,
  class: Class,
  teacher: Teacher,
}}


const AssignmentsListPage = async ({
  searchParams,
}:{
  searchParams: {[key:string]:string | undefined}
}) => {
  

  const { userId, sessionClaims } = await auth()
  const role = (sessionClaims?.metadata as { role?: string })?.role
  const currentUserId = userId

  {/* Create header table */}
  const columns = [
    {
      header: "Subject Name", 
      accessor: "name",
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
      header: "Due dates", 
      accessor: "date", 
      className:"hidden lg:table-cell",
    },
    //{/* if role admin action will appear if not action will not appear */}
    ...(role === "admin" || role === "teacher" ? [{
      header: "Actions", 
      accessor: "actions", 
    }] :[]),
  ]

  const renderRow = (item: Assignmentlist) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="flex items-center gap-4 p-4">
          {item.lesson.subject.name}
      </td>
      <td className="">{item.lesson.class.name}</td>
      <td className="hidden md:table-cell">{item.lesson.teacher.name + " " + item.lesson.teacher.surname}</td>
      <td className="hidden md:table-cell">{new Intl.DateTimeFormat("id-ID", {dateStyle:"medium"}).format(item.dueDate)}</td>
      <td>
        <div className="flex items-center gap-2">
          {/*<Link href={`/list/assignments/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center bg-lamaSky rounded-full">
              <Image src="/edit.png" alt="" width={16} height={16} />
            </button>
            
          </Link>*/}
          {(role === "admin" || role === "teacher") && (
            <>
            <Formmodal table="assignment" type="update" data={item} />
            <Formmodal table="assignment" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  )

  const {page, ...queryParams} = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.AssignmentWhereInput = {}
  query.lesson = {}

  if (queryParams) {
    for (const[key,value] of Object.entries(queryParams)) {
      if(value !== undefined){
        switch(key) {
          case "teacherId":
            query.lesson = {teacherId : value}
          break
          case "classId":
            query.lesson.classId =  parseInt(value)
          break
          case "search":
            query.OR = [
              //{title: {contains:value, mode:"insensitive"}},
              {lesson: {subject: {name: {contains:value, mode:"insensitive"}}}},
              {lesson: {teacher: {name: {contains:value, mode:"insensitive"}}}},
              {lesson: {class: {name: {contains:value, mode:"insensitive"}}}},
            ]

          default:
          break
        }
      }
      
    }
  }

  // ROLE CONDITIONS
  console.log(currentUserId)
  switch (role) {
    case "admin":
      break;
      case "teacher":
        query.lesson.teacherId = currentUserId!;
        break;
      case "student":
        query.lesson.class = {
          students:{
            some: {
              id: currentUserId!,
          }}
        }
        break;
      case "parent":
          query.lesson.class = {
            students:{
              some: {
                parentId: currentUserId!,
            }}
          }
        break;
    default:
      break;
  }




  const [data, count] = await prisma.$transaction([
    prisma.assignment.findMany({
      where:query,
      include:{
        lesson: {
          select:{
            subject: {select:{name:true}},
            teacher: {select:{name:true,surname:true}},
            class: {select:{name:true}},
          }
        }
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.assignment.count({
      where:query,
    })
  ])

  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Assignments</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <Tablesearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center bg-lamaYellow rounded-full" >
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-lamaYellow rounded-full" >
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {(role === "admin" || role === "teacher") && (
              <Formmodal table="assignment" type="create" />
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

export default AssignmentsListPage