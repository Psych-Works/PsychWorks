
const Layout = ({ children } : { children: React.ReactNode}) => {
    return (
        <div>
            
        </div>
    );
}

export default function AuthLayout({
    children,
    }:
    Readonly<{
        children: React.ReactNode;
    }>){
        return (
            <html lang="en">
                <body>
                    {children}
                </body>
            </html>
        );
    }