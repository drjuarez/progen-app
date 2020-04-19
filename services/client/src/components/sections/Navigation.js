import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {LinkContainer} from 'react-router-bootstrap';
import {Navbar, Nav, NavbarBrand, NavLink} from 'reactstrap';
import '../../styles/components/navigation.scss';
import Logo from '../../styles/images/logo.png'
import ProjectPicker from './ProjectPicker'

class Navigation extends Component {
  render() {
    const links = [
      {
        title: 'Projects',
        href: '/projectSelect'
      },
      {
        title: 'Statement',
        href: '/statement'
      }
    ];
    return (
      <Navbar expand='md'>
        <NavbarBrand href='/'>
          <img style={{objectFit: 'contain', height: '2em'}}src={Logo} />
              Progen
        </NavbarBrand>
        {/*<Nav className='flex-grow-1' navbar>*/}
          {/*{links.map((navItem) =>*/}
            {/*<NavLink key={navItem.href} tag={Link} to={navItem.href}>*/}
              {/*{navItem.title}*/}
            {/*</NavLink>*/}
              {/*)}*/}
        {/*</Nav>*/}
        {/*<Nav className='flex-grow-1' navbar>*/}
          {/*<section className={'flex-grow-1'}>*/}
            {/*<ProjectPicker />*/}
          {/*</section>*/}
        {/*</Nav>*/}
      </Navbar>
    )
    // return (
    //   <Navbar fluid collapseOnSelect>
    //     <Navbar.Header>
    //       <Navbar.Brand>
    //         <div style={{display: 'flex'}}>

    //         </div>
    //       </Navbar.Brand>
    //       <Navbar.Toggle />
    //     </Navbar.Header>
    //     <Navbar.Collapse>
    //       <Nav>

    //           navItem.dropdownTitle ?
    //             <NavDropdown eventKey={i}
    //               title={navItem.dropdownTitle}
    //               key={`dropdown${i}`}
    //               id={`dropdown${i}`}
    //             >
    //               {navItem.links.map((menuItem, j=1) =>
    //                  <LinkContainer key={menuItem.href} to={menuItem.href}>
    //                   <MenuItem eventKey={parseInt(`${i}.${j}`)}>
    //                     {menuItem.title}
    //                   </MenuItem>
    //                 </LinkContainer>
    //               )}
    //             </NavDropdown>
    //             :
    //             <LinkContainer key={navItem.href} to={navItem.href}>
    //             </LinkContainer>
    //         )}
    //         <li className={'project-picker-nav'}><ProjectPicker/></li>
    //       </Nav>
    //     </Navbar.Collapse>
    //   </Navbar>
    // );
  }
}

export default Navigation;
