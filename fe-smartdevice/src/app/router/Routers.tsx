import React from 'react'
import { DashBoard } from '../page/DashBoard'
import { Layout } from '../comp/layout/Layout'
import { Statistics } from '../page/Statistics'
import { History } from '../page/History'
import { Profile } from '../page/Profile'

export const Routers:any  = {
    path: "/",
    element: <Layout />,
    children: [
      { path: "dashboard", element: <DashBoard /> },
      { path: "statistics", element: <Statistics /> },
      { path: "history", element: <History /> },
      { path: "profile", element: <Profile /> },
    ],
}
