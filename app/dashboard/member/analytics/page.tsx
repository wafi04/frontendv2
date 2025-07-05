"use client"

import useGetAnalyticsUser from "../server/route"

export default function Page(){
    const {data}  = useGetAnalyticsUser({
        filterStatus : "online"
    })
    console.log(data)
    return (
        <main></main>
    )
}