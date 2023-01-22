import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const menuItems = [
    { name: "Add post", href: "/add-post" },
    { name: "Menu link 2", href: "/menu-2" },
    { name: "Menu link 3", href: "/menu-3" },
  ]
  return (
    <header className={"z-20 sticky top-0 backdrop-blur"}>
      <nav className={"mx-auto flex flex-row items-center px-1 py-2 max-w-3xl"}>
        <Link href={"/"} className={"flex-initial"}>
          <Image
            className={"max-h-16"}
            src={"/logo.svg"}
            alt={"logo"}
            width={200}
            height={40}
          />
        </Link>
        <ul className={"flex-1 justify-around flex h-10 gap-6"}>
          {menuItems.map(({ href, name }, index) => (
            <li
              key={index}
              className={"flex transition hover:text-pink-400 hover:underline justify-center items-center"}
            >
              <Link href={href}>{name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
