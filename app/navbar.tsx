import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const menuItems: {name: string, href: string}[] = [
    { name: "about us", href: "/about-us" },
    { name: "our dogs", href: "/dogs" },
    { name: "contact", href: "/contact" },
    { name: "add post", href: "/add-post" },
    { name: "edit posts", href: "/edit-posts" },
  ]
  return (
    <header className={"z-20 sticky top-0 bg-white/70 backdrop-blur"}>
      <nav className={"mx-auto max-w-3xl flex gap-6 content-around items-center px-1 py-2"}>
        <Link href={"/"} className={"flex-initial"}>
          <Image
            src={"/logo.svg"}
            loading={"eager"}
            width={64}
            height={64}
            alt={"logo"}
          />
        </Link>
        <ul className={"flex h-10 gap-6"}>
          {menuItems.map(({ href, name }, index) => (
            <li
              className={"flex transition hover:text-pink-400 hover:underline justify-center items-center"}
              key={index}
            >
              <Link
                className={"capitalize"}
                href={href}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
