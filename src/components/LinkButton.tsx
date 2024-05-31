import { Button } from "@mui/joy";
import { forwardRef } from "react";
import { NavLink, NavLinkProps, To } from "react-router-dom";

const LinkButton = forwardRef(function(props: Omit<Omit<Omit<Parameters<typeof Button>[0], "children">, "component">, 'ref'> & {to: To, children: NavLinkProps["children"]}, ref) {
	// @ts-expect-error the typeof props has Omit<props, "component">, but if you ignored that and passed in a component prop anyway it might break.
	const {children, component, ...propsWithoutExtra} = props;
	// @ts-ignore
	return <Button {...propsWithoutExtra} component={forwardRef((otherProps, r) => <NavLink to={props.to} {...otherProps}>{children}</NavLink>)}/>
});

export default LinkButton;