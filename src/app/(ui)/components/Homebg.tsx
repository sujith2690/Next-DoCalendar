import React from 'react'

function HomePageLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div
            className="h-screen w-full bg-cover bg-center flex flex-col items-center justify-center"
            style={{
                backgroundImage:
                    "url('https://images.pexels.com/photos/636237/pexels-photo-636237.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
            }}
        >
            {children}
        </div>
    )
}

export default HomePageLayout