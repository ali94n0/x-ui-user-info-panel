import Link from 'next/link';
import React from 'react';
import { RiTelegram2Line, RiWhatsappLine } from "react-icons/ri";

function Footer(props) {
    return (
        <div className='w-full flex flex-col justify-center items-center bg-secondary-300 py-6 max-w-screen-sm mx-auto gap-y-4'>
            <div className='flex items-center gap-x-10'>
                <Link href={"https://t.me/vpnvip_support"}><RiTelegram2Line className='w-8 h-8 fill-secondary-600'/></Link>
                <Link href={"https://wa.me/+15074147481"}><RiWhatsappLine className='w-8 h-8 fill-secondary-600' /></Link>
            </div>
            <p className='text-xs text-secondary-500 '>Imessage : ali94n0@icloud.com</p>
        </div>
    );
}

export default Footer;