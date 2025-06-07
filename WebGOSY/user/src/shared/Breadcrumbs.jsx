// Breadcrumbs.jsx
import { Link, useLocation } from "react-router-dom";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);
    if (location.pathname === "/") {
        return null; // Do not render breadcrumbs on homepage
    }

    return (
        <Breadcrumb className="my-9 mt-6  lg:ml-16 sm:ml-14" separator=">">
            <Breadcrumb.Item>
                <Link to="/">
                    <HomeOutlined className="mr-1" /> Home
                </Link>
            </Breadcrumb.Item>
            {pathnames.map((name, index) => {
                const path = `/${pathnames.slice(0, index + 1).join("/")}`;
                return (
                    <Breadcrumb.Item key={path}>
                        <Link to={path}>
                            {name.charAt(0).toUpperCase() + name.slice(1)}
                        </Link>
                    </Breadcrumb.Item>
                );
            })}
        </Breadcrumb>
    );
};

export default Breadcrumbs;
