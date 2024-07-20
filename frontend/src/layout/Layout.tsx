import { PropsWithChildren } from "react";

type LayoutProps = PropsWithChildren;

function Layout({ children }: LayoutProps) {
  return <div className="h-screen w-screen">{children}</div>;
}

export default Layout;
