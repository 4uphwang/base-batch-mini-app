"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoHomeFill } from 'react-icons/go';
import { BsCreditCard } from 'react-icons/bs';
import { FaMoneyBillAlt } from 'react-icons/fa';

const navItems = [
    { href: '/mycard', label: 'My BaseCard', icon: BsCreditCard },
    { href: '/', label: 'Home', icon: GoHomeFill },
    { href: '/earn', label: 'Earn', icon: FaMoneyBillAlt },
];

export default function FooterNav() {
    const pathname = usePathname();

    return (
        <footer className="fixed bottom-0 left-0 right-0 border-t bg-white z-10">
            <nav className="flex justify-around max-w-lg mx-auto p-2">
                {navItems.map((item) => {
                    const IconComponent = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center p-2 text-xs transition-colors text-center flex-1 
              ${pathname === item.href ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-800'}`
                            }
                        >
                            <IconComponent className="text-xl"/>
                            <span className="mt-1">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
        </footer>
    );
}