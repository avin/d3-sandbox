import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './styles.module.scss';
import SandBox from '../Pages/SandBox/SandBox';
import DivHistogram from '../Pages/DivHistogram/DivHistogram';

export const urls = [['/sandbox', '__sandBox__', SandBox], ['/divHistogram', '(1) DivHistogram', DivHistogram]];

export default class Menu extends React.Component {
    render() {
        return (
            <div className={styles.menu}>
                <div className={styles.logo}>D3-Sandbox</div>
                <ul>
                    {urls.map(([url, name]) => (
                        <li key={url}>
                            <NavLink to={url} activeClassName={styles.active}>
                                {name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}
