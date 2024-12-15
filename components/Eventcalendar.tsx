"use client"


import { on } from 'events';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const Eventcalendar = () => {
    const [value, onChange] = useState<Value>(new Date());
    
    {/* for change url base on date or router*/}

    const router = useRouter()

    useEffect(() => {
        if(value instanceof Date){
            router.push(`?date=${value.toLocaleDateString('en-US')}`)
        }
    }, [value, router])

    return <Calendar onChange={onChange} value={value} />
}

export default Eventcalendar