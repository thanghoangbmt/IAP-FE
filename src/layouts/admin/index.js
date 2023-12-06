// Chakra imports
import {
  Portal,
  Box,
  useDisclosure,
  Text,
  Button,
  Link,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import Footer from "components/footer/FooterAdmin.js";
// Layout components
import Navbar from "components/navbar/NavbarAdmin.js";
import Sidebar from "components/sidebar/Sidebar.js";
import { SidebarContext } from "contexts/SidebarContext";
import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import routes from "routes.js";
import { BASE_API_URL } from "utils/Constants";

import UserReports from "views/admin/default";

// Custom Chakra theme
export default function Dashboard(props) {
  const { ...rest } = props;
  // states and functions
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  // functions for changing the states from components
  const getRoute = () => {
    return window.location.pathname !== "/admin/full-screen-maps";
  };
  const getActiveRoute = (routes) => {
    let activeRoute = "Auvik Log System";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].items);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else if (routes[i].category) {
        let categoryActiveRoute = getActiveRoute(routes[i].items);
        if (categoryActiveRoute !== activeRoute) {
          return categoryActiveRoute;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };
  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveNavbar = getActiveNavbar(routes[i].items);
        if (collapseActiveNavbar !== activeNavbar) {
          return collapseActiveNavbar;
        }
      } else if (routes[i].category) {
        let categoryActiveNavbar = getActiveNavbar(routes[i].items);
        if (categoryActiveNavbar !== activeNavbar) {
          return categoryActiveNavbar;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].secondary;
        }
      }
    }
    return activeNavbar;
  };
  const getActiveNavbarText = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveNavbar = getActiveNavbarText(routes[i].items);
        if (collapseActiveNavbar !== activeNavbar) {
          return collapseActiveNavbar;
        }
      } else if (routes[i].category) {
        let categoryActiveNavbar = getActiveNavbarText(routes[i].items);
        if (categoryActiveNavbar !== activeNavbar) {
          return categoryActiveNavbar;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].messageNavbar;
        }
      }
    }
    return activeNavbar;
  };
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      }
      if (prop.collapse) {
        return getRoutes(prop.items);
      }
      if (prop.category) {
        return getRoutes(prop.items);
      } else {
        return null;
      }
    });
  };
  document.documentElement.dir = "ltr";
  const { onOpen } = useDisclosure();
  document.documentElement.dir = "ltr";

  

  const getDateTime = () => {
    let dateRange = [new Date('2022-02-01 00:00:00'), new Date('2022-05-01 23:59:59')];
  
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 7);
  
    const tenMinutesAgo = new Date(currentTime);
    tenMinutesAgo.setMinutes(currentTime.getMinutes() - 10);
  
    dateRange[0] = tenMinutesAgo;
    dateRange[1] = currentTime;
  
    return dateRange;
  };

  const [search, setSearch] = useState({
    startDate: getDateTime()[0],
    endDate: getDateTime()[1],
    deviceName: "All",
  });

  const [device, setDevice] = useState([])
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
	axios
      .post(BASE_API_URL + "/distinctDevice", search)
      .then((response) => {
		let setDevices = new Set([...response.data]);
		let devices = [...setDevices];
        setDevice(devices);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [search])

  if (device != null) {
	return (
		<Box>
		  <Box>
			<SidebarContext.Provider
			  value={{
				toggleSidebar,
				setToggleSidebar,
			  }}
			>
			  <Sidebar routes={routes} display="none" {...rest} />
			  <Box
				float="right"
				minHeight="100vh"
				height="100%"
				overflow="auto"
				position="relative"
				maxHeight="100%"
				w="100%"
				maxWidth="100%"
			  >
				<Portal>
				  <Box>
					<Navbar
					  setSearch={setSearch}
					  device={device}
					  onOpen={onOpen}
					  logoText={"Horizon UI Dashboard PRO"}
					  brandText={getActiveRoute(routes)}
					  secondary={getActiveNavbar(routes)}
					  message={getActiveNavbarText(routes)}
					  fixed={fixed}
					  {...rest}
					/>
				  </Box>
				</Portal>
	
				<Box
				  mx="auto"
				  p={{ base: "20px", md: "30px" }}
				  pe="20px"
				  minH="100vh"
				  pt="50px"
				>
				  <UserReports isLoading={isLoading} setIsLoading={setIsLoading} search={search} />
				</Box>
			  </Box>
			</SidebarContext.Provider>
		  </Box>
      {
      isLoading ? (
        <Box style={{position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh' }}>
          <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
          />
        </Box>
      ) : (<></>)
    }
		</Box>
   
	  );
  }
  else {
	return (<>
  <Spinner/>
  </>);
  }
}
