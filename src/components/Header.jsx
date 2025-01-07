import Link from 'next/link';
import React from 'react';

function Header(props) {
    return (
        <div className='w-full flex justify-center items-center bg-secondary-300 py-6 max-w-screen-sm mx-auto '>
            <Link className='text-lg text-secondary-600 font-bold' href={"http//:vip1-finland.freehost.io"}>
            VPNVIP 🇩🇪 🇫🇮 🇺🇸</Link>
        </div>
    );
}

export default Header;