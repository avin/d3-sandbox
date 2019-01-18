import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './styles.module.scss';
import SandBox from '../Pages/SandBox/SandBox';
import DivHistogram from '../Pages/DivHistogram/DivHistogram';
import LinearClassic from '../Pages/LinearClassic/LinearClassic';
import LinearReact from '../Pages/LinearReact/LinearReact';
import DotsMap from '../Pages/DotsMap/DotsMap';
import ForceLayout from '../Pages/ForceLayout/ForceLayout';

export const urls = [
    ['/sandbox', '__sandBox__', SandBox],
    ['/divHistogram', '(1) DivHistogram', DivHistogram],
    ['/linearClassic', '(2/1) LinearClassic (pure d3)', LinearClassic],
    ['/LinearReact', '(2/2) LinearReact (d3 as helper)', LinearReact],
    ['/DotsMap', '(3) DotsMap', DotsMap],
    ['/ForceLayout', '(4) ForceLayout', ForceLayout],
];

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
