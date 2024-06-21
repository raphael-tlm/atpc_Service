import React, { useEffect, useState } from 'react'
import { useAuth } from '../assets/components/custom/hooks/AuthProvider'

import HandlePage from '../assets/components/HandlePage'

export default function Home() {
    const auth = useAuth();
    return (
        <HandlePage title="home" nav={auth}>
            <h1> welcome {auth.name} {auth.firstName}</h1>

        </HandlePage>
    )
}
