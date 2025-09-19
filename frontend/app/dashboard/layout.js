import NavigationAccordion from "@/components/NavigationAccordion/NavigationAccordion";
import Topbar from "@/components/Topbar/Topbar";

export default function DClientLayout({ children }) {
    return (
        <div className="min-h-screen ">
            <main className="w-full flex">|
                <aside className="w-64 ">
                    <NavigationAccordion />
                </aside>
                <section className="flex-1">
                    <Topbar />
                    <div className=" p-4">
                        {children}
                    </div>
                </section>
            </main>
        </div>
    )
}