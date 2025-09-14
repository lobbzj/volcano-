
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import '../App.css';
import React  from 'react';
import { useAuth } from '../functions/AuthContext';

const Nav = () => {
    const { logged, email, handleLogout } = useAuth();
    return (
        <div>
            <nav>
                <ul className="nav">
                    <li className="nav-item">
                        <NavLink exact="true" to="/home" className="nav-link" activeclassname="active">
                            Home
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink exact="true" to="/volcanoList" className="nav-link" activeclassname="active">
                            VolcanoList
                        </NavLink>
                    </li>
                    {!logged ? (<>
                        <li className="nav-item">
                            <NavLink exact="true" to="/login" className="nav-link" activeclassname="active">
                                Login
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink exact="true" to="/register" className="nav-link" activeclassname="active">
                                Register
                            </NavLink>
                        </li> </>
                    ) : (<>
                        <li className="nav-item">
                            <button className="nav-link" onClick={handleLogout}>
                                Logout
                            </button>
                        </li>
                        <li className="nav-item email-container">
                            <div className=' nav-email '> {email} </div>
                        </li>
                    </>)}
                </ul>
            </nav>
        </div>

    );
};

export default Nav;
