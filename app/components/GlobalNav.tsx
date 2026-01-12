import { NavBar, IMenuOption } from "@opengov/components-nav-bar";
import React, { ComponentProps } from "react";
import { Link as RouteLink } from "react-router";

/**
 * The react-router `Link` component, but it takes `href` instead of `to`. This
 * is useful for interop with libraries and components that work with `href`,
 * such as @opengov/components-nav-bar.
 */
const HrefLink = React.forwardRef<
  HTMLAnchorElement,
  Omit<ComponentProps<typeof RouteLink>, "to"> & { href: string }
>((props, ref) => <RouteLink {...props} ref={ref} to={props.href} />);

HrefLink.displayName = 'HrefLink';

export default function GlobalNav() {
  const menuOptions: IMenuOption[] = [
    {
      label: "Home",
      id: "home",
      url: "/",
      linkComponent: HrefLink,
    },
    {
      label: "Section 1",
      id: "section1",
      maxWidth: "100%",
      submenuSections: [
        {
          title: "Category A",
          items: [
            {
              label: "Item 1",
              id: "item1",
              url: "#",
              linkComponent: HrefLink,
            },
            {
              label: "Item 2",
              id: "item2",
              url: "#",
              linkComponent: HrefLink,
            },
            {
              label: "Item 3",
              id: "item3",
              url: "#",
              linkComponent: HrefLink,
            },
          ],
        },
      ],
    },
    {
      label: "Section 2",
      id: "section2",
      submenuSections: [
        {
          items: [
            {
              label: "Feature A",
              id: "featureA",
              url: "#",
              linkComponent: HrefLink,
            },
            {
              label: "Feature B",
              id: "featureB",
              url: "#",
              linkComponent: HrefLink,
            },
          ],
        },
      ],
    },
  ];

  return (
    <NavBar
      appName="My Module"
      enableRebrand
      menuOptions={menuOptions}
      utilityTrayOptions={{
        settingsOptions: {
          menuSections: [
            {
              label: "Settings",
              menuItems: [
                {
                  label: "General Settings",
                  url: "#",
                  linkComponent: HrefLink,
                },
                {
                  label: "Configuration",
                  url: "#",
                  linkComponent: HrefLink,
                },
              ],
            },
          ],
        },
        profileSettingsOptions: {
          placeHolderInitials: "JD",
          handleSignOut: () => {
            console.log("Sign out clicked");
          },
        },
        createNewActionOptions: [
          {
            label: "Create Item",
            handleCreate: () => console.log("Create Item clicked"),
            dataOg: "create-item",
          },
          {
            label: "Create Record",
            handleCreate: () => console.log("Create Record clicked"),
            dataOg: "create-record",
          },
        ],
      }}
      autoDismissToasts
    />
  );
}
