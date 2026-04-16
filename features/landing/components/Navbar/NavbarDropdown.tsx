import Link from "next/link";

interface NavbarDropdownProps {
    isOpen: boolean;
    items: { label: string, href: string}[];
    onItemClick: (e:React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

export function NavbarDropdown({ isOpen, items, onItemClick}: NavbarDropdownProps) {
    if (!isOpen) return null;

    return (
        <div className="absolute right-0 mt-2 w-48 rounded-md border bg-white py-2 shadow-lg">
            {items.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    scroll={false}
                    onClick={(e) => onItemClick(e, item.href)}
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                    {item.label}
                </Link>
            ))}
        </div>
    );
}