interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
    href?: string;
    target?: string;
    rel?: string;
    onClick?: () => void;
    strength?: number;
}

export const MagneticButton = ({ children, className, href, target, rel, onClick }: MagneticButtonProps) => {
    if (href) {
        return <a className={className} href={href} target={target} rel={rel} onClick={onClick}>{children}</a>;
    }
    return <button className={className} onClick={onClick}>{children}</button>;
};
