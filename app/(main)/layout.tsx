import FooterNav from "@/components/layouts/FooterNav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <main className="pb-16 ">{children}</main>
            <FooterNav />
        </div>
    );
}